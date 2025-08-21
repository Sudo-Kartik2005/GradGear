import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Recommendation, SearchCriteria, Laptop } from "@/types";
import { Cpu, MemoryStick, BrainCircuit, Weight, Info, PercentCircle, MessageSquare } from "lucide-react";
import { DayInLifeDialog } from "./day-in-life-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "./ui/separator";

export function LaptopCard({
  laptop,
  purpose,
  onCompareChange,
  isSelectedForCompare,
  note,
  onNoteChange,
}: {
  laptop: Recommendation;
  purpose: SearchCriteria["purpose"];
  onCompareChange: (laptop: Laptop, selected: boolean) => void;
  isSelectedForCompare: boolean;
  note: string;
  onNoteChange: (laptopId: string, note: string) => void;
}) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-soft-blue/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-soft-blue">{laptop.name}</CardTitle>
            <CardDescription>{laptop.brand}</CardDescription>
          </div>
           <div className="flex items-center space-x-2">
            <Checkbox id={`compare-${laptop.id}`} checked={isSelectedForCompare} onCheckedChange={(checked) => onCompareChange(laptop, !!checked)} />
            <Label htmlFor={`compare-${laptop.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Compare
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 flex-grow text-sm">
         {laptop.studentDiscount && (
             <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground cursor-help">
                     <PercentCircle className="w-4 h-4 mr-2" />
                    Student Deal
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{laptop.discountInfo}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

        <div className="flex items-center space-x-3">
          <span className="text-2xl font-semibold text-soft-blue">
            ₹{laptop.price.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex items-start space-x-3">
          <Cpu className="w-5 h-5 text-soft-blue flex-shrink-0 mt-0.5" />
          <span>{laptop.cpu}</span>
        </div>
        <div className="flex items-start space-x-3">
          <MemoryStick className="w-5 h-5 text-soft-blue flex-shrink-0 mt-0.5" />
          <span>{laptop.ram}GB RAM</span>
        </div>
        <div className="flex items-start space-x-3">
          <BrainCircuit className="w-5 h-5 text-soft-blue flex-shrink-0 mt-0.5" />
          <span>{laptop.gpu}</span>
        </div>
        <div className="flex items-start space-x-3">
          <Weight className="w-5 h-5 text-soft-blue flex-shrink-0 mt-0.5" />
          <span>{laptop.weight}kg</span>
        </div>

        {laptop.softwareCompatibility && (
           <div className="mt-4 p-3 bg-light-blue/50 rounded-lg">
              <h4 className="font-semibold text-sm text-soft-blue mb-2 flex items-center">
                Software Compatibility Check
                 <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 ml-2 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">This AI-powered analysis estimates how well this laptop will run the software you specified.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h4>
              <p className="text-xs text-gray-600 whitespace-pre-wrap">{laptop.softwareCompatibility}</p>
           </div>
        )}
      </CardContent>
       <div className="px-6 pb-4">
        <Separator className="my-4" />
        <div className="space-y-2">
            <Label htmlFor={`notes-${laptop.id}`} className="flex items-center text-sm font-semibold text-soft-blue">
                <MessageSquare className="w-4 h-4 mr-2" />
                My Notes
            </Label>
            <Textarea 
                id={`notes-${laptop.id}`}
                placeholder="e.g. Check reviews on YouTube..." 
                className="text-sm bg-light-blue/30" 
                value={note}
                onChange={(e) => onNoteChange(laptop.id, e.target.value)}
                rows={2}
            />
        </div>
      </div>
      <CardFooter className="bg-gray-50 p-4 mt-auto grid gap-4">
        <p className="text-sm text-gray-500 italic">"{laptop.reason}"</p>
        <DayInLifeDialog laptop={laptop} purpose={purpose} />
      </CardFooter>
    </Card>
  );
}
