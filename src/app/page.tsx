
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { findLaptops } from "@/app/actions";
import type { Recommendation, SearchCriteria, Laptop } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LaptopCard } from "@/components/laptop-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ComparisonDialog } from "@/components/comparison-dialog";
import { Bot, Star, ArrowDown } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import Image from "next/image";


const formSchema = z.object({
  budget: z.coerce
    .number({ invalid_type_error: "Please enter a valid number." })
    .min(10000, { message: "Budget must be at least ₹10,000." })
    .max(1000000, { message: "Budget must be less than ₹10,00,000." }),
  purpose: z.enum(["study", "coding", "design", "gaming"], {
    required_error: "You need to select a purpose.",
  }),
  brandPreference: z.string().optional(),
  portability: z.boolean().default(false).optional(),
  software: z.string().optional(),
});

export default function Home() {
  const [recommendations, setRecommendations] = useState<
    Recommendation[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(
    null
  );
  const [comparisonLaptops, setComparisonLaptops] = useState<Laptop[]>([]);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [starredLaptops, setStarredLaptops] = useState<Laptop[]>([]);
  const [isClient, setIsClient] = useState(false);
  const finderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    // Load starred and notes from localStorage if they exist
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: 80000,
      purpose: "study",
      brandPreference: "",
      portability: false,
      software: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setRecommendations(null);
    setHasSearched(true);
    setSearchCriteria(values);
    // Keep existing comparison, starred and notes on new search
    const results = await findLaptops(values);
    setRecommendations(results);
    setLoading(false);
  }

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
  
  const handleGetStartedClick = () => {
    finderRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  if (!isClient) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar />
      <main className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
           <section className="text-center md:text-left md:flex md:items-center md:justify-between py-12 md:py-24">
            <div className="max-w-2xl">
              <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary tracking-tight">
                Find Your Perfect Student Laptop
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground">
                Overwhelmed by choice? Our AI-powered tool simplifies your search. Just tell us your budget and needs, and we&apos;ll find the ideal laptop for your studies, projects, and everything in between.
              </p>
              <Button size="lg" className="mt-8" onClick={handleGetStartedClick}>
                Get Started
                <ArrowDown className="ml-2"/>
              </Button>
            </div>
            <div className="mt-12 md:mt-0 md:ml-12">
               <Image 
                src="https://placehold.co/400x400.png"
                alt="Student using a laptop"
                width={400}
                height={400}
                className="rounded-lg shadow-2xl"
                data-ai-hint="student laptop"
               />
            </div>
          </section>

          <div className="max-w-4xl mx-auto" ref={finderRef}>
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Find Your Laptop</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Budget (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g. 80000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="purpose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Purpose</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a purpose" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="study">Study</SelectItem>
                                <SelectItem value="coding">Coding</SelectItem>
                                <SelectItem value="design">Design</SelectItem>
                                <SelectItem value="gaming">Gaming</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="brandPreference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand Preference (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Apple, Dell, HP" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="software"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Software (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. AutoCAD, Photoshop" {...field} />
                            </FormControl>
                            <FormDescription>
                              Comma-separated list of software you use.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="portability"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel>Need a lightweight laptop?</FormLabel>
                                <FormDescription>
                                  Prioritize portability (under 1.8kg).
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? "Searching..." : "Find Laptops"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

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
                    key={`starred-${laptop.id}`}
                    laptop={laptop as Recommendation}
                    purpose={searchCriteria?.purpose || "study"}
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

          <section className="mt-16">
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="shadow-lg">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-5/6" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                    <CardFooter className="p-4">
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {hasSearched && !loading && recommendations && searchCriteria && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-primary">
                    Our Top Recommendations
                  </h2>
                  {comparisonLaptops.length > 1 && (
                    <ComparisonDialog laptops={comparisonLaptops} />
                  )}
                </div>
                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                    {recommendations.map((laptop) => (
                      <LaptopCard
                        key={laptop.id}
                        laptop={laptop}
                        purpose={searchCriteria.purpose}
                        onCompareChange={handleComparisonChange}
                        isSelectedForCompare={comparisonLaptops.some(l => l.id === laptop.id)}
                        note={notes[laptop.id] || ''}
                        onNoteChange={handleNoteChange}
                        onStarChange={handleStarChange}
                        isStarred={starredLaptops.some(l => l.id === laptop.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 px-6 bg-card rounded-lg shadow-md">
                    <Bot size={48} className="mx-auto text-primary" />
                    <h3 className="mt-4 text-2xl font-bold">No Matches Found</h3>
                    <p className="mt-2 text-muted-foreground">
                      We couldn't find any laptops matching your criteria.
                      <br />
                      Try adjusting your budget or filters.
                    </p>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

    