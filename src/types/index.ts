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

export interface SearchCriteria {
  budget: number;
  purpose: "study" | "coding" | "design" | "gaming";
  brandPreference?: string;
  portability?: boolean;
}
