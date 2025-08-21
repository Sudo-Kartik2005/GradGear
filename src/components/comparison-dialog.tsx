"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Laptop } from "@/types";
import { Rows, Cpu, MemoryStick, BrainCircuit, Weight, BadgeIndianRupee } from "lucide-react";


export function ComparisonDialog({ laptops }: { laptops: Laptop[] }) {

  const features = [
    { key: 'price', label: 'Price', icon: BadgeIndianRupee },
    { key: 'cpu', label: 'CPU', icon: Cpu },
    { key: 'ram', label: 'RAM (GB)', icon: MemoryStick },
    { key: 'gpu', label: 'GPU', icon: BrainCircuit },
    { key: 'weight', label: 'Weight (kg)', icon: Weight },
  ] as const;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Rows className="mr-2" />
          Compare Selected ({laptops.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-soft-blue">Laptop Comparison</DialogTitle>
          <DialogDescription>
            Here is a side-by-side comparison of the laptops you selected.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold w-[150px]">Feature</TableHead>
                {laptops.map(laptop => (
                  <TableHead key={laptop.id} className="font-semibold text-primary">{laptop.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map(feature => (
                <TableRow key={feature.key}>
                  <TableCell className="font-medium flex items-center">
                    <feature.icon className="w-4 h-4 mr-2 text-muted-foreground" />
                    {feature.label}
                  </TableCell>
                  {laptops.map(laptop => (
                    <TableCell key={laptop.id}>
                      {feature.key === 'price' 
                        ? `₹${laptop[feature.key].toLocaleString('en-IN')}`
                        : laptop[feature.key]
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
