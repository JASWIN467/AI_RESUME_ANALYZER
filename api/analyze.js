// api/analyze.js — Vercel Serverless Function
// Uses @google/generative-ai SDK with gemini-2.5-flash

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_MODEL = 'gemini-2.5-flash';
// NOTE: responseMimeType:'application/json' truncates output in the Node SDK — do NOT use it.
const MAX_CHARS = 15000;

const buildPrompt = (resumeText, jobDescription) => `
You are an expert resume analyst and career coach. Analyze the resume below and return ONLY a single valid JSON object — no markdown, no code fences, no explanation, no trailing text.

${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}\n` : ''}

RESUME:
${resumeText}

Return exactly this JSON structure (all fields required):
{
  "overallScore": <integer 0-100>,
  "categoryScores": {
    "atsCompatibility": <integer 0-100>,
    "keywordMatch": <integer 0-100>,
    "formatting": <integer 0-100>,
    "impactVerbs": <integer 0-100>,
    "clarity": <integer 0-100>
  },
  "strengths": [
    "<specific strength 1>",
    "<specific strength 2>",
    "<specific strength 3>"
  ],
  "improvements": [
    "<specific actionable improvement 1>",
    "<specific actionable improvement 2>",
    "<specific actionable improvement 3>",
    "<specific actionable improvement 4>",
    "<specific actionable improvement 5>"
  ],
  "missingKeywords": [
    "<keyword 1>",
    "<keyword 2>"
  ],
  "bulletRewrite": {
    "before": "<exact weak bullet point from the resume>",
    "after": "<rewritten strong version with metrics and action verb>"
  }
}

Rules:
- overallScore must be a weighted average of category scores (integer)
- strengths must be specific to THIS resume, not generic advice
- improvements must be actionable and specific
- missingKeywords: if no job description provided, return 3-5 commonly expected keywords for the apparent role
- bulletRewrite.before must be a real bullet from the resume (verbatim or near-verbatim)
- Return ONLY the JSON object. No markdown. No backticks. No prose.
`.trim();

function extractJSON(raw) {
  // 1. Direct parse (best case)
  try { return JSON.parse(raw); } catch (_) {}

  // 2. Strip markdown fences
  let cleaned = raw
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/im, '')
    .trim();
  try { return JSON.parse(cleaned); } catch (_) {}

  // 3. Extract first {...} block
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);

  throw new Error('Could not extract valid JSON from response');
}

function coerceNumbers(obj) {
  if (obj.overallScore !== undefined) obj.overallScore = Number(obj.overallScore);
  if (obj.categoryScores) {
    for (const key of Object.keys(obj.categoryScores)) {
      obj.categoryScores[key] = Number(obj.categoryScores[key]);
    }
  }
  return obj;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error. API key not configured.' });
  }

  const { resumeText, jobDescription } = req.body ?? {};

  if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 50) {
    return res.status(400).json({ error: 'Resume text is required and must be at least 50 characters.' });
  }

  if (resumeText.length > MAX_CHARS) {
    return res.status(400).json({
      error: `Resume text exceeds the ${MAX_CHARS.toLocaleString()} character limit. Please trim or paste a shorter version.`,
    });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 8192,
      // Do NOT set responseMimeType here — it causes the Node SDK to return
      // a truncated partial response instead of the full JSON object.
    },
  });

  const prompt = buildPrompt(resumeText.trim(), (jobDescription ?? '').trim());
  let raw = '';

  try {
    const result = await model.generateContent(prompt);
    raw = result.response.text();
    console.log(`[analyze] model=${GEMINI_MODEL} rawLen=${raw.length}`);

    const parsed = coerceNumbers(extractJSON(raw));

    if (typeof parsed.overallScore !== 'number' || isNaN(parsed.overallScore)) {
      throw new Error('Response missing overallScore');
    }

    return res.status(200).json(parsed);

  } catch (firstErr) {
    console.warn('[analyze] First attempt failed:', firstErr.message);
    console.warn('[analyze] Raw:', raw?.slice(0, 300));

    // Retry once with explicit instruction
    try {
      const retryResult = await model.generateContent(
        prompt + '\n\nIMPORTANT: Output must start with { and end with }. Absolutely no other characters.'
      );
      raw = retryResult.response.text();
      const parsed = coerceNumbers(extractJSON(raw));

      if (typeof parsed.overallScore !== 'number' || isNaN(parsed.overallScore)) {
        throw new Error('Retry response also missing overallScore');
      }

      return res.status(200).json(parsed);

    } catch (retryErr) {
      console.error('[analyze] Retry failed:', retryErr.message);
      return res.status(502).json({
        error: 'Analysis failed after retry. Please try again in a moment.',
      });
    }
  }
}
