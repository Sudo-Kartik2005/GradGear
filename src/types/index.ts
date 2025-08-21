import { z } from "zod";

export interface Laptop {
  id: string;
  name: string;
  brand: string;
  price: number;
  ram: number;
  cpu: string;
  gpu:string;
  weight: number;
  purposeTags: string[];
}

export interface Recommendation extends Laptop {
  reason: string;
  softwareCompatibility?: string | null;
}

export type Purpose = "study" | "coding" | "design" | "gaming";

export interface SearchCriteria {
  budget: number;
  purpose: Purpose;
  brandPreference?: string;
  portability?: boolean;
  software?: string;
}

export interface DayInLifeInput {
    laptopName: string;
    cpu: string;
    gpu: string;
    ram: number;
    purpose: Purpose;
}

export const GenerateSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});
export type GenerateSpeechInput = z.infer<typeof GenerateSpeechInputSchema>;

export const GenerateSpeechOutputSchema = z.object({
  audio: z
    .string()
    .describe(
      "The generated audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."
    ),
});
export type GenerateSpeechOutput = z.infer<typeof GenerateSpeechOutputSchema>;
