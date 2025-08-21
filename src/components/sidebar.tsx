
"use client"

import Link from "next/link"
import {
  GraduationCap,
  Home,
  LineChart,
  Package,
} from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ThemeToggle } from "./theme-toggle"
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/deals", icon: Package, label: "Deals" },
    { href: "/analytics", icon: LineChart, label: "Analytics" },
  ];


  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <GraduationCap className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">GradGear</span>
          </Link>
          {navItems.map((item) => (
             <Tooltip key={item.label}>
             <TooltipTrigger asChild>
               <Link
                 href={item.href}
                 className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                 }`}
               >
                 <item.icon className="h-5 w-5" />
                 <span className="sr-only">{item.label}</span>
               </Link>
             </TooltipTrigger>
             <TooltipContent side="right">{item.label}</TooltipContent>
           </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <ThemeToggle />
        </nav>
      </TooltipProvider>
    </aside>
  )
}
