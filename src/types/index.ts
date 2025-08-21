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
  studentDiscount?: boolean;
  discountInfo?: string;
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

export const DayInLifeInputSchema = z.object({
  laptopName: z.string().describe('The name of the laptop.'),
  cpu: z.string().describe('The CPU of the laptop.'),
  gpu: z.string().describe('The GPU of the laptop.'),
  ram: z.number().describe('The amount of RAM in GB.'),
  purpose: z.enum(['study', 'coding', 'design', 'gaming']).describe('The primary purpose for using the laptop.'),
});
export type DayInLifeInput = z.infer<typeof DayInLifeInputSchema>;

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
