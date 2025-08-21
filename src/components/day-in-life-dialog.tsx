"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, LoaderCircle } from "lucide-react";
import type { Laptop, Purpose } from "@/types";
import { generateDayInLifeStoryAction } from "@/app/actions";

export function DayInLifeDialog({
  laptop,
  purpose,
}: {
  laptop: Laptop;
  purpose: Purpose;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateStory = async () => {
    if (!isOpen) { // Only generate when opening
        setError("");
        setStory("");
        setLoading(true);
        try {
        const result = await generateDayInLifeStoryAction({
            laptopName: laptop.name,
            cpu: laptop.cpu,
            gpu: laptop.gpu,
            ram: laptop.ram,
            purpose: purpose,
        });
        setStory(result);
        } catch (e) {
        setError("Sorry, something went wrong. Please try again.");
        console.error(e);
        } finally {
        setLoading(false);
        }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleGenerateStory} className="w-full bg-accent-light-green text-green-900 hover:bg-accent-light-green/80">
          <Sparkles className="mr-2" />
          Visualize My Day
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-soft-blue">A Day in Your Life with the {laptop.name}</DialogTitle>
          <DialogDescription>
            An AI-generated glimpse into how this laptop fits your routine.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 min-h-[150px]">
          {loading && (
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <LoaderCircle className="animate-spin text-soft-blue" />
              <span>Generating your story...</span>
            </div>
          )}
          {error && <p className="text-destructive text-sm">{error}</p>}
          {story && (
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {story}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
