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
}

export type Purpose = "study" | "coding" | "design" | "gaming";

export interface SearchCriteria {
  budget: number;
  purpose: Purpose;
  brandPreference?: string;
  portability?: boolean;
}

export interface DayInLifeInput {
    laptopName: string;
    cpu: string;
    gpu: string;
    ram: number;
    purpose: Purpose;
}
