import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type MacroEstimate = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

type FoodEstimateItem = {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

type FoodPhotoMacroResult = {
  foods: FoodEstimateItem[];
  totals: MacroEstimate;
  notes?: string;
};

const toNonNegativeNumber = (value: unknown): number => {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, num);
};

const normalizeFoodPhotoResult = (raw: any): FoodPhotoMacroResult => {
  const foodsRaw = Array.isArray(raw?.foods) ? raw.foods : [];
  const foods: FoodEstimateItem[] = foodsRaw
    .map((f: any) => ({
      name: String(f?.name || 'Unknown'),
      calories: toNonNegativeNumber(f?.calories),
      protein_g: toNonNegativeNumber(f?.protein_g),
      carbs_g: toNonNegativeNumber(f?.carbs_g),
      fat_g: toNonNegativeNumber(f?.fat_g),
    }))
    .filter((f: FoodEstimateItem) => f.name.trim().length > 0);

  const totalsRaw = raw?.totals || {};
  const totals: MacroEstimate = {
    calories: toNonNegativeNumber(totalsRaw?.calories),
    protein_g: toNonNegativeNumber(totalsRaw?.protein_g),
    carbs_g: toNonNegativeNumber(totalsRaw?.carbs_g),
    fat_g: toNonNegativeNumber(totalsRaw?.fat_g),
  };

  return {
    foods,
    totals,
    notes: typeof raw?.notes === 'string' ? raw.notes : undefined,
  };
};

const tryParseJsonObject = (text: string): any | null => {
  let candidate = text.trim();

  const fenceMatch = candidate.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenceMatch?.[1]) {
    candidate = fenceMatch[1].trim();
  }

  try {
    return JSON.parse(candidate);
  } catch {
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start >= 0 && end > start) {
      const slice = candidate.slice(start, end + 1);
      try {
        return JSON.parse(slice);
      } catch {
        return null;
      }
    }
    return null;
  }
};

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Food photo macro capture: multipart/form-data
    if (contentType.includes('multipart/form-data')) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: 'OPENAI_API_KEY is not configured on the server.' },
          { status: 501 }
        );
      }

      const form = await request.formData();
      const image = form.get('image');

      if (!(image instanceof File)) {
        return NextResponse.json({ error: 'Missing image file.' }, { status: 400 });
      }

      const arrayBuffer = await image.arrayBuffer();
      const maxBytes = 10 * 1024 * 1024;
      if (arrayBuffer.byteLength > maxBytes) {
        return NextResponse.json(
          { error: 'Image too large. Please upload a smaller photo.' },
          { status: 413 }
        );
      }

      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json(
          { error: 'Only JPG or PNG images are supported.' },
          { status: 400 }
        );
      }

      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const mime = image.type || 'image/jpeg';
      const dataUrl = `data:${mime};base64,${base64}`;

      const client = new OpenAI({
        apiKey,
      });

      try {
        const response = await client.responses.create({
          model: 'gpt-4.1-mini',
          input: [
            {
              role: 'user',
              content: [
                {
                  type: 'input_text',
                  text: 'Identify the food(s) in the photo and estimate calories and macros (protein, carbs, fat) for the visible portion. If multiple items are present, list each item and include totals. Return ONLY valid json (no markdown). Output schema: {"foods":[{"name":string,"calories":number,"protein_g":number,"carbs_g":number,"fat_g":number}],"totals":{"calories":number,"protein_g":number,"carbs_g":number,"fat_g":number},"notes":string}. Values are estimates; if unsure, make conservative assumptions and mention uncertainty in notes.',
                },
                {
                  type: 'input_image',
                  image_url: dataUrl,
                  detail: 'auto',
                },
              ],
            },
          ],
        });

        const content: string | undefined = response.output_text;

        if (!content) {
          console.error('OpenAI Responses API returned no output text:', response);
          return NextResponse.json(
            { error: 'AI response was empty. Please try again.' },
            { status: 502 }
          );
        }

        const parsed = tryParseJsonObject(content);
        if (!parsed) {
          console.error('Could not parse AI response as JSON:', content.slice(0, 200));
          return NextResponse.json(
            { error: 'AI returned an unreadable response. Please try again.' },
            { status: 502 }
          );
        }

        const result = normalizeFoodPhotoResult(parsed);
        return NextResponse.json({ result });
      } catch (aiError: any) {
        console.error('Error calling OpenAI:', aiError);

        // Handle OpenAI-specific errors with clear messages
        if (aiError?.status === 401) {
          return NextResponse.json(
            { error: 'OpenAI API key is invalid or expired. Please check server configuration.' },
            { status: 502 }
          );
        }

        if (aiError?.status === 403) {
          return NextResponse.json(
            { error: 'Access denied. Your OpenAI account does not have permission to use vision models. Please upgrade your plan or enable vision API access.' },
            { status: 502 }
          );
        }

        if (aiError?.status === 429) {
          const message = aiError?.message || '';
          if (message.toLowerCase().includes('quota')) {
            return NextResponse.json(
              { error: 'OpenAI quota exceeded. Please check your billing and usage limits in the OpenAI dashboard.' },
              { status: 502 }
            );
          }
          return NextResponse.json(
            { error: 'OpenAI rate limit reached. Please try again in a few moments.' },
            { status: 502 }
          );
        }

        if (aiError?.status === 400) {
          const message = aiError?.message || '';
          return NextResponse.json(
            { error: `Invalid request to OpenAI: ${message.slice(0, 150)}` },
            { status: 502 }
          );
        }

        if (aiError?.code === 'insufficient_quota') {
          return NextResponse.json(
            { error: 'OpenAI account has insufficient credits. Please add credits or upgrade your plan.' },
            { status: 502 }
          );
        }

        // Generic fallback with partial error details if available
        const errorHint = aiError?.message ? ` (${aiError.message.slice(0, 100)})` : '';
        return NextResponse.json(
          { error: `AI request failed. Please try again.${errorHint}` },
          { status: 502 }
        );
      }
    }

    // Default JSON endpoint (kept as placeholder so existing callers aren't broken)
    await request.json().catch(() => null);
    return NextResponse.json(
      {
        message: 'AI Coach API endpoint',
        status: 'not_implemented',
        data: null,
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Unexpected error in POST handler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
