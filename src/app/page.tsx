"use client";

import { useState, useEffect } from "react";
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
import { Bot, Rows } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
    setComparisonLaptops([]);
    setNotes({});
    const results = await findLaptops(values);
    setRecommendations(results);
    setLoading(false);
  }

  const handleComparisonChange = (laptop: Laptop, isSelected: boolean) => {
    setComparisonLaptops(prev => 
      isSelected 
        ? [...prev, laptop] 
        : prev.filter(l => l.id !== laptop.id)
    );
  }

  const handleNoteChange = (laptopId: string, note: string) => {
    setNotes(prev => ({...prev, [laptopId]: note}));
  }

  if (!isClient) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
       <header className="flex justify-between items-center mb-12">
        <div className="text-left">
           <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary tracking-tight">
            Budget Laptop Finder
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Tell us your budget and what you need a laptop for. Our AI assistant
            will help you find the perfect match.
          </p>
        </div>
        <ThemeToggle />
      </header>


      <div className="max-w-4xl mx-auto">
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
    </main>
  );
}
