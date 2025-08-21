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
import { Sparkles, LoaderCircle, Volume2, Waves } from "lucide-react";
import type { Laptop, Purpose } from "@/types";
import { generateDayInLifeStoryAction, generateSpeechAction } from "@/app/actions";

type AudioState = 'idle' | 'loading' | 'playing' | 'error';

export function DayInLifeDialog({
  laptop,
  purpose,
}: {
  laptop: Laptop;
  purpose: Purpose;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [story, setStory] = useState("");
  const [storyLoading, setStoryLoading] = useState(false);
  const [storyError, setStoryError] = useState("");
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerateStory = async () => {
    if (story) return; // Don't re-generate if we have it

    setStoryError("");
    setStory("");
    setStoryLoading(true);
    setAudioState('idle');
    setAudioUrl(null);
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
      setStoryError("Sorry, something went wrong. Please try again.");
      console.error(e);
    } finally {
      setStoryLoading(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!story || audioState === 'loading' || audioUrl) return;

    setAudioState('loading');
    try {
      const audioDataUri = await generateSpeechAction({ text: story });
      setAudioUrl(audioDataUri);
      setAudioState('playing');
    } catch (e) {
      setAudioState('error');
      console.error(e);
    }
  }

  const handleAudioEnded = () => {
    setAudioState('idle');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleGenerateStory} className="w-full">
          <Sparkles className="mr-2" />
          Visualize My Day
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary">A Day in Your Life with the {laptop.name}</DialogTitle>
          <DialogDescription>
            An AI-generated glimpse into how this laptop fits your routine.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 min-h-[150px]">
          {storyLoading && (
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <LoaderCircle className="animate-spin text-primary" />
              <span>Generating your story...</span>
            </div>
          )}
          {storyError && <p className="text-destructive text-sm">{storyError}</p>}
          {story && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {story}
              </p>
              <div className="flex items-center justify-start gap-4">
                <Button variant="outline" size="sm" onClick={handleGenerateAudio} disabled={audioState === 'loading' || audioState === 'playing'}>
                  {audioState === 'idle' && <Volume2 className="mr-2"/>}
                  {audioState === 'loading' && <LoaderCircle className="mr-2 animate-spin" />}
                  {audioState === 'playing' && <Waves className="mr-2 text-primary" />}
                  {audioState === 'error' && "Error"}
                  Listen
                </Button>
                {audioState === 'error' && <p className="text-xs text-destructive">Could not generate audio.</p>}
              </div>

              {audioUrl && audioState === 'playing' && (
                <audio src={audioUrl} autoPlay onEnded={handleAudioEnded}>
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
