'use server';
/**
 * @fileOverview A flow to check if a laptop can run a list of software smoothly.
 *
 * - checkSoftwareCompatibility - A function that performs the check.
 * - SoftwareCheckInput - The input type for the check.
 * - SoftwareCheckOutput - The return type for the check.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SoftwareCheckInputSchema = z.object({
  laptopName: z.string().describe('The name of the laptop.'),
  cpu: z.string().describe('The CPU of the laptop.'),
  gpu: z.string().describe('The GPU of the laptop.'),
  ram: z.number().describe('The amount of RAM in GB.'),
  software: z.array(z.string()).describe('A list of software to check compatibility for.'),
});
export type SoftwareCheckInput = z.infer<typeof SoftwareCheckInputSchema>;

const SoftwareCheckOutputSchema = z.object({
  analysis: z.string().describe("A brief, helpful analysis (2-3 sentences) on how well the specified laptop can run the listed software. Mention if the experience will be smooth, adequate, or sluggish for demanding tasks. Avoid making definitive 'yes' or 'no' statements."),
});
export type SoftwareCheckOutput = z.infer<typeof SoftwareCheckOutputSchema>;

export async function checkSoftwareCompatibility(input: SoftwareCheckInput): Promise<SoftwareCheckOutput> {
  return softwareCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'softwareCheckPrompt',
  input: { schema: SoftwareCheckInputSchema },
  output: { schema: SoftwareCheckOutputSchema },
  prompt: `You are a helpful assistant for a student laptop recommendation app. Your task is to analyze if a given laptop can run a list of software smoothly.

Laptop Specifications:
- Name: {{laptopName}}
- CPU: {{cpu}}
- GPU: {{gpu}}
- RAM: {{ram}}GB

Software to check:
{{#each software}}
- {{this}}
{{/each}}

Based on the laptop's specifications, provide a brief, helpful analysis (2-3 sentences) on how well it can run the listed software. Mention if the experience will be smooth for professional work, adequate for most tasks, or potentially sluggish for very demanding operations. Do not give a simple "yes" or "no". Frame the analysis from the perspective of a student's needs.`,
});

const softwareCheckFlow = ai.defineFlow(
  {
    name: 'softwareCheckFlow',
    inputSchema: SoftwareCheckInputSchema,
    outputSchema: SoftwareCheckOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
