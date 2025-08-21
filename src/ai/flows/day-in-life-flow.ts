'use server';
/**
 * @fileOverview A flow to generate a "day in the life" story for a student using a specific laptop.
 *
 * - generateDayInLifeStory - A function that generates the story.
 * - DayInLifeInput - The input type for the story generation.
 * - DayInLifeOutput - The return type for the story generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DayInLifeInputSchema = z.object({
  laptopName: z.string().describe('The name of the laptop.'),
  cpu: z.string().describe('The CPU of the laptop.'),
  gpu: z.string().describe('The GPU of the laptop.'),
  ram: z.number().describe('The amount of RAM in GB.'),
  purpose: z.enum(['study', 'coding', 'design', 'gaming']).describe('The primary purpose for using the laptop.'),
});
export type DayInLifeInput = z.infer<typeof DayInLifeInputSchema>;

const DayInLifeOutputSchema = z.object({
  story: z.string().describe("A short, engaging, first-person story about a student's day using the specified laptop for their main purpose."),
});
export type DayInLifeOutput = z.infer<typeof DayInLifeOutputSchema>;

export async function generateDayInLifeStory(input: DayInLifeInput): Promise<DayInLifeOutput> {
  return dayInLifeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dayInLifePrompt',
  input: { schema: DayInLifeInputSchema },
  output: { schema: DayInLifeOutputSchema },
  prompt: `You are a creative storyteller who inspires students. Write a short, engaging, first-person story (about 150-200 words) from the perspective of a student having a great day using their new laptop.

The student's main goal is {{purpose}}.

The laptop is the {{laptopName}}, and it has a {{cpu}} processor, {{ram}}GB of RAM, and a {{gpu}} graphics card.

Weave in 1-2 subtle details about how the laptop's features (like its powerful CPU, ample RAM, or capable GPU) make their day easier or more enjoyable for their specific purpose.

For example, if the purpose is 'coding', you could mention how quickly the code compiles. If it's 'design', you could mention smooth rendering. If it's 'gaming', mention high frame rates. If it's 'study', mention seamless multitasking with lots of tabs open.

The tone should be positive, aspirational, and relatable. Start the story in the morning and end it in the evening. Don't use markdown.`,
});

const dayInLifeFlow = ai.defineFlow(
  {
    name: 'dayInLifeFlow',
    inputSchema: DayInLifeInputSchema,
    outputSchema: DayInLifeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
