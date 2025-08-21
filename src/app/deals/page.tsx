
"use client";

import { useState, useEffect } from "react";
import type { Recommendation, SearchCriteria, Laptop } from "@/types";
import { Sidebar } from "@/components/sidebar";
import { LaptopCard } from "@/components/laptop-card";
import { ComparisonDialog } from "@/components/comparison-dialog";
import { Package, Star } from "lucide-react";
import laptopsData from "@/data/laptops.json";

const allLaptops: Laptop[] = laptopsData as Laptop[];

export default function DealsPage() {
  const [dealLaptops, setDealLaptops] = useState<Recommendation[]>([]);
  const [comparisonLaptops, setComparisonLaptops] = useState<Laptop[]>([]);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [starredLaptops, setStarredLaptops] = useState<Laptop[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const discountedLaptops = allLaptops
      .filter(laptop => laptop.studentDiscount)
      .map(laptop => ({
        ...laptop,
        reason: `Great student deal available for this model.`,
        softwareCompatibility: null,
      }));
    setDealLaptops(discountedLaptops);
    
    const storedStarred = localStorage.getItem('starredLaptops');
    if (storedStarred) {
      setStarredLaptops(JSON.parse(storedStarred));
    }
    const storedNotes = localStorage.getItem('laptopNotes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
    const storedComparison = localStorage.getItem('comparisonLaptops');
    if (storedComparison) {
        setComparisonLaptops(JSON.parse(storedComparison));
    }
  }, []);

  const handleComparisonChange = (laptop: Laptop, isSelected: boolean) => {
    const newComparisonList = isSelected
        ? [...comparisonLaptops, laptop]
        : comparisonLaptops.filter(l => l.id !== laptop.id);
    setComparisonLaptops(newComparisonList);
    localStorage.setItem('comparisonLaptops', JSON.stringify(newComparisonList));
  }

  const handleNoteChange = (laptopId: string, note: string) => {
    const newNotes = {...notes, [laptopId]: note};
    setNotes(newNotes);
    localStorage.setItem('laptopNotes', JSON.stringify(newNotes));
  }

  const handleStarChange = (laptop: Laptop, isStarred: boolean) => {
    const newStarredList = isStarred
        ? [...starredLaptops, laptop]
        : starredLaptops.filter(l => l.id !== laptop.id);
    setStarredLaptops(newStarredList);
    localStorage.setItem('starredLaptops', JSON.stringify(newStarredList));
  };
  
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar />
      <main className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <header className="mb-12">
            <div className="text-left">
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary tracking-tight flex items-center">
                <Package className="w-10 h-10 mr-4" />
                Student Deals
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                Check out these laptops with special discounts and offers for students.
              </p>
            </div>
          </header>

          <section>
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-primary">
                    Available Deals
                </h2>
                {comparisonLaptops.length > 1 && (
                <ComparisonDialog laptops={comparisonLaptops} />
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {dealLaptops.map((laptop) => (
                <LaptopCard
                  key={`deal-${laptop.id}`}
                  laptop={laptop}
                  purpose={"study"}
                  onCompareChange={handleComparisonChange}
                  isSelectedForCompare={comparisonLaptops.some(l => l.id === laptop.id)}
                  note={notes[laptop.id] || ''}
                  onNoteChange={handleNoteChange}
                  onStarChange={handleStarChange}
                  isStarred={starredLaptops.some(l => l.id === laptop.id)}
                />
              ))}
            </div>
          </section>

           {starredLaptops.length > 0 && (
            <section className="mt-16">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-primary flex items-center">
                  <Star className="w-8 h-8 mr-4 text-amber-400 fill-amber-400" />
                  Your Starred Laptops
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                {starredLaptops.map((laptop) => (
                  <LaptopCard
                    key={`starred-deal-${laptop.id}`}
                    laptop={laptop as Recommendation}
                    purpose={"study"}
                    onCompareChange={handleComparisonChange}
                    isSelectedForCompare={comparisonLaptops.some(l => l.id === laptop.id)}
                    note={notes[laptop.id] || ''}
                    onNoteChange={handleNoteChange}
                    onStarChange={handleStarChange}
                    isStarred={starredLaptops.some(l => l.id === laptop.id)}
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
