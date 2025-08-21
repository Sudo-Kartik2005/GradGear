"use server";

import type { SearchCriteria, Recommendation, Laptop, DayInLifeInput } from "@/types";
import laptopsData from "@/data/laptops.json";
import { generateDayInLifeStory } from "@/ai/flows/day-in-life-flow";


const allLaptops: Laptop[] = laptopsData as Laptop[];

const getCpuScore = (cpu: string): number => {
  const lowerCpu = cpu.toLowerCase();
  if (lowerCpu.includes("m3 pro") || lowerCpu.includes("m3 max")) return 12;
  if (lowerCpu.includes("m3")) return 11;
  if (lowerCpu.includes("m2 pro") || lowerCpu.includes("m2 max")) return 10;
  if (lowerCpu.includes("m2")) return 9;
  if (lowerCpu.includes("m1 pro") || lowerCpu.includes("m1 max")) return 8;
  if (lowerCpu.includes("m1")) return 7;
  if (lowerCpu.includes("i9") || lowerCpu.includes("ryzen 9")) return 10;
  if (lowerCpu.includes("i7") || lowerCpu.includes("ryzen 7")) return 8;
  if (lowerCpu.includes("i5") || lowerCpu.includes("ryzen 5")) return 6;
  if (lowerCpu.includes("i3") || lowerCpu.includes("ryzen 3")) return 4;
  return 2;
};

const getGpuScore = (gpu: string): number => {
    const lowerGpu = gpu.toLowerCase();
    if (lowerGpu.includes('rtx 4090')) return 12;
    if (lowerGpu.includes('rtx 4080')) return 11;
    if (lowerGpu.includes('rtx 4070')) return 10;
    if (lowerGpu.includes('rtx 4060')) return 9;
    if (lowerGpu.includes('rtx 3080') || lowerGpu.includes('rtx 4050')) return 8;
    if (lowerGpu.includes('rtx 3070')) return 7;
    if (lowerGpu.includes('rtx 3060') || lowerGpu.includes('rtx 2050')) return 6;
    if (lowerGpu.includes('rtx 3050')) return 5;
    if (lowerGpu.includes('iris xe')) return 4;
    if (lowerGpu.includes('radeon')) return 3;
    if (lowerGpu.includes('integrated') || lowerGpu.includes('uhd')) return 2;
    return 1;
}

export async function findLaptops(
  criteria: SearchCriteria
): Promise<Recommendation[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

  const { budget, purpose, brandPreference, portability } = criteria;

  const filtered = allLaptops.filter((laptop) => {
    if (laptop.price > budget) return false;
    if (!laptop.purposeTags.includes(purpose)) return false;
    if (
      brandPreference &&
      laptop.brand.toLowerCase() !== brandPreference.trim().toLowerCase()
    )
      return false;
    if (portability && laptop.weight > 1.8) return false;
    return true;
  });

  const scored = filtered.map(laptop => {
    const purposeWeights = {
        study: { ram: 2, cpu: 2, gpu: 1, price: 3 },
        coding: { ram: 3, cpu: 3, gpu: 1, price: 2 },
        design: { ram: 3, cpu: 2, gpu: 3, price: 1 },
        gaming: { ram: 2, cpu: 2, gpu: 4, price: 1 },
    };
    const weights = purposeWeights[purpose];

    const score = 
        (laptop.ram * weights.ram) + 
        (getCpuScore(laptop.cpu) * weights.cpu) +
        (getGpuScore(laptop.gpu) * weights.gpu) +
        ((laptop.price / budget) * weights.price);

    return { ...laptop, score };
  })

  const sorted = scored.sort((a, b) => b.score - a.score);

  const topLaptops = sorted.slice(0, 5);

  const recommendations: Recommendation[] = topLaptops.map((laptop) => ({
    ...laptop,
    reason: `A great choice for ${purpose}, featuring a ${laptop.cpu}, ${laptop.ram}GB of RAM, and a capable ${laptop.gpu}. It fits perfectly within your budget.`,
  }));

  return recommendations;
}

export async function generateDayInLifeStoryAction(input: DayInLifeInput): Promise<string> {
    const result = await generateDayInLifeStory(input);
    return result.story;
}
