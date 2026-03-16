import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Erlaube Response Streaming bis zu 30s
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = await streamText({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        model: openai('gpt-4o-mini') as any,
        system: `Du bist der "THITRONIK Support-Assistent", ein KI-Agent für die B2B-Händler Akademie "Nord-Ostsee Campus".
    Dein Ziel ist es, den Händlern bei technischen Fragen und beim Einbau von THITRONIK-Produkten (z.B. WiPro III, Pro-finder, NFC-Module) zu helfen.
    Antworte stets professionell, höflich und technisch präzise auf Deutsch. Verweise bei komplexen Problemen darauf, dass der Level-2 Support eingeschaltet wird.`,
        messages,
        tools: {
            getMassepunktInfo: tool({
                description: 'Liefert Informationen zum korrekten Massepunkt beim Einbau der WiPro III.',
                parameters: z.object({}),
                execute: async () => {
                    return "Der ideale Massepunkt für die WiPro III ist das Bodenblech der Karosserie oder eine Gurtverschraubung. Plastikverkleidungen oder Schrauben von Rückleuchten sind ungeeignet, da sie den Kontakt stören oder Störeinstrahlungen verursachen können.";
                },
            }),
            getNfcInfo: tool({
                description: 'Liefert Informationen zur Montage des NFC-Moduls',
                parameters: z.object({}),
                execute: async () => {
                    return "Das NFC-Pad funkt problemlos durch Kunststoff, Holz oder GFK bis ca. 10mm Stärke. Es darf NICHT auf oder hinter Blech montiert werden, da Metall die NFC-Funkwellen blockiert.";
                },
            }),
        },
    });

    return result.toAIStreamResponse();
}
