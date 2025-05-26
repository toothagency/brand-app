// c:\Users\tnjei\Documents\Projects\MVP\brand-app\app\api\generate-creative\route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is in .env.local
});

// Helper function to generate brand strategies
async function generateBrandStrategies(brandDescription: string): Promise<string | undefined> {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Or "gpt-4o", "gpt-4-turbo"
            messages: [
                { role: "system", content: "You are a brilliant brand strategist." },
                {
                    role: "user",
                    content: `Generate 3 distinct brand strategy pillars for a company described as: "${brandDescription}". For each pillar, provide a brief explanation and key messaging points. Format as a numbered list.`,
                },
            ],
        });
        return completion.choices[0]?.message?.content?.trim();
    } catch (error) {
        console.error("Error generating brand strategies:", error);
        return "Error generating brand strategies.";
    }
}

interface ColorInfo {
    name: string;
    hex: string;
}

interface ColorPalette {
    primary: ColorInfo;
    secondary: ColorInfo[];
    accent: ColorInfo;
    explanation: string;
}
interface VisualAssetResponse {
    prompts: string[];
    images: string[];
}

// Helper function to generate visual asset ideas/prompts (or directly images)
async function generateVisualAssets(
    brandDescription: string,
    palette?: ColorPalette
): Promise<VisualAssetResponse> {
    try {
        const promptGenCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a creative director skilled in visual branding." },
                { role: "user", content: `Based on the brand description: "${brandDescription}", generate 3 distinct DALL-E prompts for logo concepts or brand imagery. Each prompt should be concise and descriptive.` }
            ]
        });
        const dallEPromptsText = promptGenCompletion.choices[0]?.message?.content?.trim();
        const dallEPrompts = dallEPromptsText?.split('\n').map(p => p.replace(/^\d+\.\s*/, '').trim()).filter(p => p.trim() !== '') || [];


        if (dallEPrompts.length === 0) {
            return { prompts: [], images: ["Error: Could not generate DALL-E prompts from the description."] };
        }

        let dallePromptColorSuffix = "";
        if (palette && palette.primary && palette.accent) {
            const primaryColorName = palette.primary.name || palette.primary.hex;
            const accentColorName = palette.accent.name || palette.accent.hex;
            dallePromptColorSuffix = ` using primary color ${primaryColorName} (${palette.primary.hex}) with accent color ${accentColorName} (${palette.accent.hex})`;
        } else if (palette) {
            console.warn("Palette provided to generateVisualAssets, but it's missing primary or accent colors.");
        }

        const imagePromises = dallEPrompts.slice(0, 2).map(prompt => // Limit to 2 images for MVP
            openai.images.generate({
                model: "dall-e-3",
                prompt: `${prompt}${dallePromptColorSuffix}. Visual style suitable for brand: ${brandDescription.substring(0, 120)}`, // Adjusted substring length
                n: 1,
                size: "1024x1024",
                response_format: "url",
            })
        );
        const imageResults = await Promise.allSettled(imagePromises);

        const imageUrls = imageResults
            .filter(result => result.status === 'fulfilled')
            .map(result => {
                const value = (result as PromiseFulfilledResult<OpenAI.Images.ImagesResponse>).value;
                return value?.data?.[0]?.url;
            })
            .filter((url): url is string => typeof url === 'string');


        return {
            prompts: dallEPrompts,
            images: imageUrls.length > 0 ? imageUrls : ["Error: No images were successfully generated."]
        };

    } catch (error) {
        console.error("Error generating visual assets:", error);
        return { prompts: [], images: ["Error generating visual assets due to an internal issue."] };
    }
}

// Helper function to generate marketing strategies
async function generateMarketingStrategies(brandDescription: string): Promise<string | undefined> {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an expert marketing strategist." },
                {
                    role: "user",
                    content: `Develop a basic marketing and social media strategy for a company described as: "${brandDescription}". Include:
1. Target Audience (brief description).
2. Key Marketing Channels (suggest 2-3).
3. Three distinct campaign ideas.
4. Five engaging social media post ideas (specify platform if relevant, e.g., Instagram, LinkedIn).
Format clearly.`,
                },
            ],
        });
        return completion.choices[0]?.message?.content?.trim();
    } catch (error) {
        console.error("Error generating marketing strategies:", error);
        return "Error generating marketing strategies.";
    }
}

// Helper function to generate color palettes
async function generateColorPalettes(brandDescription: string): Promise<ColorPalette | string> {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106", // Using a model that's good with JSON and supports response_format
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: "You are a design expert specializing in color theory and branding. Respond with a valid JSON object." },
                {
                    role: "user",
                    content: `Based on the brand description: "${brandDescription}", suggest a color palette.
Return a JSON object with the following structure:
{
  "primary": { "name": "ColorName", "hex": "#RRGGBB" },
  "secondary": [
    { "name": "ColorName1", "hex": "#RRGGBB1" },
    { "name": "ColorName2", "hex": "#RRGGBB2" }
  ],
  "accent": { "name": "ColorName", "hex": "#RRGGBB" },
  "explanation": "Brief explanation for the palette choice."
}

Example:
{
  "primary": { "name": "Ocean Blue", "hex": "#0077CC" },
  "secondary": [
    { "name": "Seafoam Green", "hex": "#98FB98" },
    { "name": "Sandy Beige", "hex": "#F5F5DC" }
  ],
  "accent": { "name": "Coral Pink", "hex": "#FF7F50" },
  "explanation": "This palette evokes trust and tranquility (blue), growth (green), warmth (beige), with a vibrant touch (coral) suitable for a modern and approachable brand."
}`,
                },
            ],
        });
        const content = completion.choices[0]?.message?.content?.trim();
        if (content) {
            try {
                return JSON.parse(content) as ColorPalette;
            } catch (parseError) {
                console.error("Error parsing color palette JSON:", parseError, "Received content:", content);
                return "Error: Could not parse color palette data from AI.";
            }
        }
        return "Error: No content received from AI for color palettes.";
    } catch (error) {
        console.error("Error generating color palettes:", error);
        return `Error generating color palettes: ${error instanceof Error ? error.message : String(error)}`;
    }
}

// Helper function to generate font suggestions
async function generateFontSuggestions(brandDescription: string): Promise<string | undefined> {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a typography expert with a keen eye for branding." },
                {
                    role: "user",
                    content: `For a company described as: "${brandDescription}", suggest a font pairing.
Provide:
1.  Heading Font: (Suggest a specific font name, e.g., Montserrat, Playfair Display, or a font category like 'Geometric Sans-serif').
2.  Body Font: (Suggest a specific font name, e.g., Open Sans, Lato, or a font category like 'Readable Serif').
3.  Rationale: (Briefly explain why this font pairing is suitable for the brand's described personality and target audience, 1-2 sentences).
Format this clearly. For example:
Heading Font: Montserrat (Bold)
Body Font: Open Sans (Regular)
Rationale: Montserrat offers a modern, clean look for headings, while Open Sans ensures high readability for body text, creating a professional and accessible feel.`,
                },
            ],
        });
        return completion.choices[0]?.message?.content?.trim();
    } catch (error) {
        console.error("Error generating font suggestions:", error);
        return "Error generating font suggestions.";
    }
}


export async function POST(request: NextRequest) {
    try {
        const { brandDescription } = await request.json();

        if (!brandDescription || typeof brandDescription !== 'string' || brandDescription.trim() === "") {
            return NextResponse.json({ error: 'Brand description is required.' }, { status: 400 });
        }

        // Step 1: Generate color palettes first, as visual assets depend on it.
        const colorPalettesResult = await generateColorPalettes(brandDescription);

        // Step 2: Generate other text-based assets in parallel.
        const [
            brandStrategiesResult,
            marketingStrategiesResult,
            fontSuggestionsResult,
        ] = await Promise.all([
            generateBrandStrategies(brandDescription),
            generateMarketingStrategies(brandDescription),
            generateFontSuggestions(brandDescription),
        ]);

        // Step 3: Generate visual assets, using the generated color palette if available.
        let visualAssetsResult: VisualAssetResponse;
        if (typeof colorPalettesResult === 'object' && colorPalettesResult !== null && 'primary' in colorPalettesResult) {
            // Successfully generated a ColorPalette object
            visualAssetsResult = await generateVisualAssets(brandDescription, colorPalettesResult as ColorPalette);
        } else {
            // Fallback if color palette generation failed or returned an error string
            console.warn("Color palette generation failed or returned an error string. Generating visual assets without specific color guidance. Palette result:", colorPalettesResult);
            visualAssetsResult = await generateVisualAssets(brandDescription); // Call without palette
        }

        return NextResponse.json({
            brandStrategies: brandStrategiesResult,
            visualAssets: visualAssetsResult,
            marketingStrategies: marketingStrategiesResult,
            colorPalettes: colorPalettesResult, // This will be the ColorPalette object or an error string
            fontSuggestions: fontSuggestionsResult,
        });

    } catch (error) {
        console.error("Main API error:", error);
        let errorMessage = "An unexpected error occurred while processing your request.";
        // In a real app, you might want to log the error to a service like Sentry
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
