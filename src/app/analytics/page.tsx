"use client";

import { useState, useEffect } from "react";
import type { Laptop } from "@/types";
import { Sidebar } from "@/components/sidebar";
import { ComparisonCharts } from "@/components/comparison-charts";
import { AlertCircle, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const [comparisonLaptops, setComparisonLaptops] = useState<Laptop[]>([]);
  const [isClient, setIsClient] = useState(false);
  // Add a key to force re-render on theme change
  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
    const storedComparison = localStorage.getItem("comparisonLaptops");
    if (storedComparison) {
      setComparisonLaptops(JSON.parse(storedComparison));
    }

    const handleThemeChange = () => {
      setThemeKey(prevKey => prevKey + 1);
    };

    window.addEventListener('themeChanged', handleThemeChange);

    // Set initial theme key
    handleThemeChange();

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  if (!isClient) {
    return null; // Don't render server-side
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar />
      <main className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <header className="mb-12">
            <div className="text-left">
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary tracking-tight flex items-center">
                <BarChart className="w-10 h-10 mr-4" />
                Comparison Analytics
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                Visually compare the key specifications of your selected laptops.
              </p>
            </div>
          </header>

          {comparisonLaptops.length > 1 ? (
            <ComparisonCharts key={themeKey} laptops={comparisonLaptops} />
          ) : (
            <Card className="shadow-lg border-primary/20 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center">
                  <AlertCircle className="w-6 h-6 mr-3" />
                  Not Enough Laptops to Compare
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  You need to select at least two laptops to compare them. Go back to the main page and use the "Compare" checkbox on the laptop cards.
                </p>
                <Button asChild>
                  <Link href="/">Back to Finder</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
