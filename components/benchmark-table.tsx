"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sectorBenchmarks, type SectorBenchmark } from "@/lib/valuation-data";
import { Search, Building2, Factory, TrendingUp, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function BenchmarkTable() {
  const [filter, setFilter] = useState<"all" | "craft" | "manufacturing">("all");
  const [search, setSearch] = useState("");

  const filteredSectors = sectorBenchmarks.filter((sector) => {
    const matchesFilter = filter === "all" || sector.category === filter;
    const matchesSearch =
      search === "" ||
      sector.name.toLowerCase().includes(search.toLowerCase()) ||
      sector.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const craftCount = sectorBenchmarks.filter((s) => s.category === "craft").length;
  const mfgCount = sectorBenchmarks.filter((s) => s.category === "manufacturing").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Branchen-EBIT-Multiple Benchmarks
        </CardTitle>
        <CardDescription>
          Branchenspezifische Bewertungsmultiples für Handwerk und Industrie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Branchen durchsuchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              <TabsTrigger value="all">
                Alle ({sectorBenchmarks.length})
              </TabsTrigger>
              <TabsTrigger value="craft" className="gap-1">
                <Building2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Handwerk</span> ({craftCount})
              </TabsTrigger>
              <TabsTrigger value="manufacturing" className="gap-1">
                <Factory className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Industrie</span> ({mfgCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b text-sm">
                <th className="text-left py-3 px-2 font-medium">Branche</th>
                <th className="text-center py-3 px-2 font-medium">Typ</th>
                <th className="text-center py-3 px-2 font-medium">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 mx-auto">
                        Niedrig
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>25. Perzentil der Transaktionen</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
                <th className="text-center py-3 px-2 font-medium">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 mx-auto">
                        Median
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>50. Perzentil - typische Transaktion</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
                <th className="text-center py-3 px-2 font-medium">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 mx-auto">
                        Hoch
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>75. Perzentil - Premium-Transaktionen</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
                <th className="text-center py-3 px-2 font-medium">EBIT-Marge</th>
                <th className="text-left py-3 px-2 font-medium">Schlüsselfaktoren</th>
              </tr>
            </thead>
            <tbody>
              {filteredSectors.map((sector) => (
                <SectorRow key={sector.id} sector={sector} />
              ))}
              {filteredSectors.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    Keine Branchen gefunden, die Ihren Kriterien entsprechen
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p>
            <strong>Datenquelle:</strong> Zusammengestellt aus Markttransaktionsdaten, Branchenberichten
            und M&A-Beratungserfahrung im deutschsprachigen Raum. Multiples spiegeln Enterprise
            Value / EBIT für KMU (1 Mio. - 50 Mio. EUR Umsatz) wider.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SectorRow({ sector }: { sector: SectorBenchmark }) {
  return (
    <tr className="border-b hover:bg-secondary/30 transition-colors">
      <td className="py-3 px-2">
        <div>
          <div className="font-medium">{sector.name}</div>
          <div className="text-xs text-muted-foreground">{sector.description}</div>
        </div>
      </td>
      <td className="py-3 px-2 text-center">
        <Badge
          variant="secondary"
          className={
            sector.category === "craft"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
          }
        >
          {sector.category === "craft" ? (
            <Building2 className="h-3 w-3 mr-1" />
          ) : (
            <Factory className="h-3 w-3 mr-1" />
          )}
          {sector.category === "craft" ? "Handwerk" : "Industrie"}
        </Badge>
      </td>
      <td className="py-3 px-2 text-center">
        <span className="text-muted-foreground">{sector.baseMultiple.low}x</span>
      </td>
      <td className="py-3 px-2 text-center">
        <span className="font-bold text-accent">{sector.baseMultiple.median}x</span>
      </td>
      <td className="py-3 px-2 text-center">
        <span className="text-muted-foreground">{sector.baseMultiple.high}x</span>
      </td>
      <td className="py-3 px-2 text-center">
        <span className="text-sm">
          {sector.typicalEBITMargin.low}% - {sector.typicalEBITMargin.high}%
        </span>
      </td>
      <td className="py-3 px-2">
        <div className="flex flex-wrap gap-1">
          {sector.keyFactors.slice(0, 2).map((factor) => (
            <Badge key={factor} variant="outline" className="text-xs font-normal">
              {factor}
            </Badge>
          ))}
          {sector.keyFactors.length > 2 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="text-xs font-normal">
                    +{sector.keyFactors.length - 2}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{sector.keyFactors.slice(2).join(", ")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </td>
    </tr>
  );
}
