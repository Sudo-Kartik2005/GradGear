import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Recommendation } from "@/types";
import { Cpu, MemoryStick, Scale, DollarSign, BrainCircuit, Weight } from "lucide-react";

export function LaptopCard({ laptop }: { laptop: Recommendation }) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline">{laptop.name}</CardTitle>
        <CardDescription>{laptop.brand}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 flex-grow text-sm">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="text-xl font-semibold">
            ${laptop.price.toLocaleString()}
          </span>
        </div>
        <div className="flex items-start space-x-3">
          <Cpu className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <span>{laptop.cpu}</span>
        </div>
        <div className="flex items-start space-x-3">
          <MemoryStick className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <span>{laptop.ram}GB RAM</span>
        </div>
        <div className="flex items-start space-x-3">
          <BrainCircuit className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <span>{laptop.gpu}</span>
        </div>
        <div className="flex items-start space-x-3">
          <Weight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <span>{laptop.weight}kg</span>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 mt-auto">
        <p className="text-sm text-muted-foreground italic">"{laptop.reason}"</p>
      </CardFooter>
    </Card>
  );
}
