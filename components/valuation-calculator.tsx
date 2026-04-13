"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  sectorBenchmarks,
  adjustmentFactors,
  calculateValuation,
  formatCurrency,
  formatNumber,
  type ValuationResult,
} from "@/lib/valuation-data";
import { EbitNormalization, type NormalizationResult } from "@/components/ebit-normalization";
import { ContactForm } from "@/components/contact-form";
import {
  Calculator,
  TrendingUp,
  Building2,
  Factory,
  Info,
  ChevronRight,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

export function ValuationCalculator() {
  const [activeTab, setActiveTab] = useState("sector");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [normalizationResult, setNormalizationResult] = useState<NormalizationResult | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [autoFocusLegalForm, setAutoFocusLegalForm] = useState(false);
  
  const sectorSelectRef = useRef<HTMLButtonElement>(null);
  const firstFactorRef = useRef<HTMLButtonElement>(null);
  
  // Ref um immer die aktuelle setActiveTab-Funktion zu haben
  const setActiveTabRef = useRef(setActiveTab);
  setActiveTabRef.current = setActiveTab;

  // Fokus auf Branchenauswahl setzen, wenn über Anker navigiert wird
  useEffect(() => {
    const goToSectorTab = () => {
      setActiveTabRef.current("sector");
      setActiveTab("sector");
      setContactSubmitted(false);
      setResult(null);
      setTimeout(() => {
        sectorSelectRef.current?.focus();
        sectorSelectRef.current?.click();
      }, 200);
    };

    const handleHashChange = () => {
      if (window.location.hash === "#calculator") {
        goToSectorTab();
      }
    };
    
    // Click Handler für alle Links mit href="#calculator"
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href="#calculator"]');
      if (link) {
        goToSectorTab();
      }
    };
    
    // Initial check
    if (window.location.hash === "#calculator") {
      goToSectorTab();
    }
    
    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("click", handleLinkClick, true); // capture phase
    
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, []);

  const craftSectors = sectorBenchmarks.filter((s) => s.category === "craft");
  const manufacturingSectors = sectorBenchmarks.filter((s) => s.category === "manufacturing");

  const selectedSectorData = useMemo(
    () => sectorBenchmarks.find((s) => s.id === selectedSector),
    [selectedSector]
  );

  const handleAdjustmentChange = (factorId: string, value: number) => {
    setAdjustments((prev) => ({
      ...prev,
      [factorId]: value,
    }));
  };

  const handleNormalizationComplete = (result: NormalizationResult) => {
    setNormalizationResult(result);
    setContactSubmitted(false); // Reset bei neuer EBIT-Bereinigung
    setResult(null);
    setAutoFocusLegalForm(false); // Reset
    setActiveTab("adjustments");
    
    // Fokus auf ersten Faktor nach Tab-Wechsel
    setTimeout(() => {
      firstFactorRef.current?.focus();
      firstFactorRef.current?.click();
      firstFactorRef.current?.classList.add("input-highlight");
    }, 150);
  };

  const handleSectorSelect = (sectorId: string) => {
    setSelectedSector(sectorId);
    setContactSubmitted(false); // Reset bei neuer Branchenauswahl
    setResult(null);
    setAutoFocusLegalForm(true); // Trigger Auto-Focus auf Rechtsform
    setActiveTab("normalization");
  };

  const calculateAndShowResult = () => {
    if (!normalizationResult || !selectedSector) return;

    const calculationResult = calculateValuation({
      revenue: normalizationResult.averageRevenue,
      ebit: normalizationResult.averageNormalizedEbit,
      sectorId: selectedSector,
      adjustments,
    });

    setContactSubmitted(false); // Reset bei neuer Berechnung
    setResult(calculationResult);
    setActiveTab("result");
  };

  const isInputComplete = normalizationResult && selectedSector;

  const groupedFactors = useMemo(() => {
    const groups: Record<string, typeof adjustmentFactors> = {};
    adjustmentFactors.forEach((factor) => {
      if (!groups[factor.category]) {
        groups[factor.category] = [];
      }
      groups[factor.category].push(factor);
    });
    return groups;
  }, []);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="sector" className="flex items-center gap-2">
              <Factory className="h-4 w-4" />
              <span className="hidden sm:inline">Branche</span>
            </TabsTrigger>
            <TabsTrigger 
              value="normalization" 
              className="flex items-center gap-2"
              disabled={!selectedSector}
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline">EBIT-Bereinigung</span>
            </TabsTrigger>
            <TabsTrigger 
              value="adjustments" 
              className="flex items-center gap-2"
              disabled={!normalizationResult || !selectedSector}
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Faktoren</span>
            </TabsTrigger>
            <TabsTrigger value="result" className="flex items-center gap-2" disabled={!result}>
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Ergebnis</span>
            </TabsTrigger>
            <TabsTrigger value="methodology" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Methodik</span>
            </TabsTrigger>
          </TabsList>

          {/* BRANCHENAUSWAHL TAB - jetzt zuerst */}
          <TabsContent value="sector" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5 text-accent" />
                  Branche auswählen
                </CardTitle>
                <CardDescription>
                  Wählen Sie die Haupttätigkeit des Unternehmens. Dies bestimmt den Basis-Multiple für die Bewertung.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Branchenauswahl <span className="text-red-500">*</span></Label>
                  <Select
                    value={selectedSector}
                    onValueChange={(value) => {
                      handleSectorSelect(value);
                      setResult(null);
                    }}
                  >
                    <SelectTrigger 
                      ref={sectorSelectRef}
                      className={!selectedSector ? "border-amber-400" : ""}
                    >
                      <SelectValue placeholder="Welcher Branche gehört Ihr Unternehmen an?" />
                    </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                          <Building2 className="inline h-4 w-4 mr-1" />
                          Handwerksbetriebe
                        </div>
                        {craftSectors.map((sector) => (
                          <SelectItem key={sector.id} value={sector.id}>
                            {sector.name}
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground mt-2">
                          <Factory className="inline h-4 w-4 mr-1" />
                          Produzierende Industrie
                        </div>
                        {manufacturingSectors.map((sector) => (
                          <SelectItem key={sector.id} value={sector.id}>
                            {sector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!selectedSector && (
                      <p className="text-xs text-amber-600">Pflichtfeld - Bitte wählen Sie eine Branche aus</p>
                    )}
                  </div>

                  {selectedSectorData && (
                    <div className="space-y-3 rounded-lg bg-secondary p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Branchen-Benchmark</span>
                        <Badge variant="secondary" className="bg-accent text-accent-foreground">
                          {selectedSectorData.category === "craft" ? "Handwerk" : "Industrie"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {selectedSectorData.description}
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded bg-background p-2">
                          <div className="text-xs text-muted-foreground">Niedrig</div>
                          <div className="font-semibold">{selectedSectorData.baseMultiple.low}x</div>
                        </div>
                        <div className="rounded bg-accent/10 p-2 ring-1 ring-accent">
                          <div className="text-xs text-accent">Median</div>
                          <div className="font-bold text-accent">
                            {selectedSectorData.baseMultiple.median}x
                          </div>
                        </div>
                        <div className="rounded bg-background p-2">
                          <div className="text-xs text-muted-foreground">Hoch</div>
                          <div className="font-semibold">{selectedSectorData.baseMultiple.high}x</div>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="text-xs text-muted-foreground mb-1">
                          Branchentypische EBIT-Marge: {selectedSectorData.typicalEBITMargin.low}% - {selectedSectorData.typicalEBITMargin.high}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Schlüsselfaktoren:</span>{" "}
                          {selectedSectorData.keyFactors.join(", ")}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedSector && (
                    <Button
                      className="w-full mt-4"
                      onClick={() => setActiveTab("normalization")}
                    >
                      Weiter zur EBIT-Bereinigung
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
          </TabsContent>

          {/* EBIT-BEREINIGUNG TAB */}
          <TabsContent value="normalization" className="space-y-6">
            <EbitNormalization 
              onNormalizationComplete={handleNormalizationComplete}
              autoFocusLegalForm={autoFocusLegalForm}
            />
          </TabsContent>

          {/* ANPASSUNGSFAKTOREN TAB */}
          <TabsContent value="adjustments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  Multiple-Anpassungsfaktoren
                </CardTitle>
                <CardDescription>
                  Bewerten Sie unternehmensspezifische Faktoren, die den Wert beeinflussen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {(() => {
                    let globalIndex = 0;
                    return Object.entries(groupedFactors).map(([category, factors]) => (
                    <div key={category} className="space-y-4">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        {category}
                      </h3>
                      <div className="grid gap-4 lg:grid-cols-2">
                        {factors.map((factor) => {
                          const isFirst = globalIndex === 0;
                          globalIndex++;
                          return (
                          <div
                            key={factor.id}
                            className="rounded-lg border p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">{factor.name}</Label>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-sm">
                                    Gewichtung: {Math.round(factor.weight * 100)}%
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Select
                              value={
                                adjustments[factor.id]?.toString() ||
                                factor.options[1]?.value.toString()
                              }
                              onValueChange={(value) => {
                                handleAdjustmentChange(factor.id, parseFloat(value));
                                // Entferne Highlight nach Auswahl
                                if (isFirst) {
                                  firstFactorRef.current?.classList.remove("input-highlight");
                                }
                              }}
                            >
                              <SelectTrigger 
                                ref={isFirst ? firstFactorRef : undefined}
                                className="w-full"
                                onFocus={(e) => e.currentTarget.classList.add("input-highlight")}
                                onBlur={(e) => e.currentTarget.classList.remove("input-highlight")}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {factor.options.map((option, idx) => (
                                  <SelectItem
                                    key={idx}
                                    value={option.value.toString()}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`text-xs font-medium ${
                                          option.value > 0
                                            ? "text-green-600"
                                            : option.value < 0
                                            ? "text-red-600"
                                            : "text-muted-foreground"
                                        }`}
                                      >
                                        {option.value > 0
                                          ? `+${(option.value * 100).toFixed(0)}%`
                                          : option.value < 0
                                          ? `${(option.value * 100).toFixed(0)}%`
                                          : "±0%"}
                                      </span>
                                      <span>{option.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {adjustments[factor.id] !== undefined && (
                              <p className="text-xs text-muted-foreground">
                                {
                                  factor.options.find(
                                    (o) => o.value === adjustments[factor.id]
                                  )?.description
                                }
                              </p>
                            )}
                          </div>
                        )})}
                      </div>
                    </div>
                  ));
                  })()}
                </div>

                <div className="mt-8 pt-6 border-t">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Gesamtanpassung: </span>
                      {(() => {
                        const total = Object.values(adjustments).reduce(
                          (sum, val) => sum + val,
                          0
                        );
                        return (
                          <span
                            className={
                              total > 0
                                ? "text-green-600 font-semibold"
                                : total < 0
                                ? "text-red-600 font-semibold"
                                : ""
                            }
                          >
                            {total > 0 ? "+" : ""}
                            {(total * 100).toFixed(1)}%
                          </span>
                        );
                      })()}
                    </div>
                    <Button
                      size="lg"
                      onClick={calculateAndShowResult}
                      disabled={!isInputComplete}
                      className="w-full sm:w-auto"
                    >
                      <Calculator className="h-5 w-5 mr-2" />
                      Bewertung berechnen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ERGEBNIS TAB */}
          <TabsContent value="result" className="space-y-6">
            {result && normalizationResult && !contactSubmitted && (
              <ContactForm
                valuationResult={result}
                normalizationResult={normalizationResult}
                selectedSector={selectedSectorData?.name || selectedSector}
                onSuccess={() => setContactSubmitted(true)}
              />
            )}
            
            {result && normalizationResult && contactSubmitted && (
              <>
                {/* Hauptergebnis */}
                <Card className="border-accent bg-gradient-to-br from-accent/5 to-accent/10">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="text-sm text-muted-foreground uppercase tracking-wide">
                        Geschätzter Unternehmenswert
                      </div>
                      <div className="text-5xl font-bold text-accent">
                        {formatCurrency(result.enterpriseValue.mid)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Bandbreite: {formatCurrency(result.enterpriseValue.low)} -{" "}
                        {formatCurrency(result.enterpriseValue.high)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Basierend auf bereinigtem EBIT von {formatCurrency(normalizationResult.averageNormalizedEbit)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Details Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Multiple Details */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">EBIT-Multiple</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Basis-Multiple</span>
                          <span className="font-semibold">{result.baseMultiple.toFixed(2)}x</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Anpassung</span>
                          <span
                            className={
                              result.adjustedMultiple > result.baseMultiple
                                ? "text-green-600 font-semibold"
                                : result.adjustedMultiple < result.baseMultiple
                                ? "text-red-600 font-semibold"
                                : "font-semibold"
                            }
                          >
                            {result.adjustedMultiple > result.baseMultiple ? "+" : ""}
                            {(
                              ((result.adjustedMultiple - result.baseMultiple) /
                                result.baseMultiple) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t">
                          <span className="font-medium">Finales Multiple</span>
                          <span className="font-bold text-accent">
                            {result.adjustedMultiple.toFixed(2)}x
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Kennzahlen */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Kennzahlen</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">EBIT-Marge</span>
                          <span className="font-semibold">{formatNumber(result.ebitMargin)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Branchentypisch</span>
                          <span className="text-muted-foreground">
                            {selectedSectorData?.typicalEBITMargin.low}% -{" "}
                            {selectedSectorData?.typicalEBITMargin.high}%
                          </span>
                        </div>
                        <div className="pt-2 border-t">
                          {result.ebitMargin <
                          (selectedSectorData?.typicalEBITMargin.low || 0) ? (
                            <div className="flex items-center gap-2 text-amber-600 text-xs">
                              <AlertTriangle className="h-4 w-4" />
                              Marge unter Branchenschnitt
                            </div>
                          ) : result.ebitMargin >
                            (selectedSectorData?.typicalEBITMargin.high || 100) ? (
                            <div className="flex items-center gap-2 text-green-600 text-xs">
                              <CheckCircle2 className="h-4 w-4" />
                              Überdurchschnittliche Marge
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-muted-foreground text-xs">
                              <CheckCircle2 className="h-4 w-4" />
                              Im Branchenbereich
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Multiple-Veränderung */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Multiple-Veränderung</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border-t pt-4">
                        <div className="text-sm font-medium mb-2">Multiple-Veränderung</div>
                        <div className="text-3xl font-bold">
                          {result.adjustedMultiple > result.baseMultiple ? "+" : ""}
                          {formatNumber(
                            ((result.adjustedMultiple - result.baseMultiple) / result.baseMultiple) *
                              100
                          )}
                          %
                        </div>
                        <div className="text-xs text-muted-foreground">ggü. Basismultiple</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Anpassungsdetails */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Anpassungsdetails</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.adjustmentDetails.map((detail) => (
                        <div
                          key={detail.factorId}
                          className="flex justify-between items-center py-2 border-b last:border-0"
                        >
                          <span className="text-sm">{detail.factorName}</span>
                          <span
                            className={`font-mono text-sm ${
                              detail.impact > 0
                                ? "text-green-600"
                                : detail.impact < 0
                                ? "text-red-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {detail.impact > 0 ? "+" : ""}
                            {(detail.impact * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* EBIT-Bereinigung Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">EBIT-Bereinigung (3-Jahres-Übersicht)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium">Jahr</th>
                            <th className="text-right py-2 font-medium">Ausgewiesen</th>
                            <th className="text-right py-2 font-medium text-green-600">+ Hinzu</th>
                            <th className="text-right py-2 font-medium text-red-600">- Kürzungen</th>
                            <th className="text-right py-2 font-medium text-amber-600">± Gehalt</th>
                            <th className="text-right py-2 font-medium text-accent">= Bereinigt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {normalizationResult.years.map((year) => (
                            <tr key={year.year} className="border-b last:border-0">
                              <td className="py-2 font-medium">{year.year}</td>
                              <td className="text-right py-2 font-mono">{formatCurrency(year.reportedEbit)}</td>
                              <td className="text-right py-2 font-mono text-green-600">
                                {year.totalAdditions > 0 ? `+${formatCurrency(year.totalAdditions)}` : "—"}
                              </td>
                              <td className="text-right py-2 font-mono text-red-600">
                                {year.totalDeductions > 0 ? `-${formatCurrency(year.totalDeductions)}` : "—"}
                              </td>
                              <td className="text-right py-2 font-mono text-amber-600">
                                {year.salaryAdjustment !== 0 
                                  ? `${year.salaryAdjustment > 0 ? "+" : ""}${formatCurrency(year.salaryAdjustment)}`
                                  : "—"}
                              </td>
                              <td className="text-right py-2 font-mono font-medium text-accent">
                                {formatCurrency(year.normalizedEbit)}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-accent/10 font-medium">
                            <td className="py-2">Durchschnitt</td>
                            <td className="text-right py-2" colSpan={4}></td>
                            <td className="text-right py-2 font-mono text-accent">
                              {formatCurrency(normalizationResult.averageNormalizedEbit)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium mb-1">Wichtiger Hinweis</p>
                        <p>
                          Diese Bewertung dient als erste Orientierung und ersetzt keine
                          professionelle Unternehmensbewertung. Der tatsächliche Transaktionspreis
                          kann aufgrund von Verhandlungen, Marktbedingungen, Synergieeffekten und
                          anderen Faktoren erheblich abweichen. Konsultieren Sie einen M&A-Berater
                          oder Wirtschaftsprüfer für eine fundierte Bewertung.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* METHODIK TAB */}
          <TabsContent value="methodology" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Methodik der EBIT-Multiple-Bewertung</CardTitle>
                <CardDescription>
                  Verstehen Sie die Grundlagen unseres Bewertungsansatzes
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <div className="space-y-8">
                  <section>
                    <h3 className="text-lg font-semibold mb-3">1. EBIT-Bereinigung (Normalisierung)</h3>
                    <p className="text-muted-foreground mb-4">
                      Das ausgewiesene EBIT aus dem Jahresabschluss muss bereinigt werden, um die
                      nachhaltige Ertragskraft des Unternehmens darzustellen. Wir betrachten die letzten
                      drei Geschäftsjahre und nehmen folgende Anpassungen vor:
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4 bg-green-50/50">
                        <h4 className="font-medium text-green-700 mb-2">Hinzurechnungen (erhöhen EBIT)</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>Einmalige Aufwendungen (Restrukturierung, Abfindungen)</li>
                          <li>Betriebsfremder Aufwand (private Nutzung, nicht-betriebsnotwendig)</li>
                          <li>Außerordentliche Instandhaltung</li>
                          <li>Überhöhte GF-Gehälter (Differenz zum Marktniveau)</li>
                        </ul>
                      </div>
                      <div className="rounded-lg border p-4 bg-red-50/50">
                        <h4 className="font-medium text-red-700 mb-2">Kürzungen (verringern EBIT)</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>Einmalige Erträge (Anlagenverkauf, Rückstellungsauflösung)</li>
                          <li>Betriebsfremde Erträge (nicht-betriebsnotwendiges Vermögen)</li>
                          <li>Periodenfremde Erträge</li>
                          <li>Nicht nachhaltige Zuschüsse</li>
                          <li>Kalkulatorischer Unternehmerlohn (bei Personengesellschaften)</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">2. Multiple-Bestimmung</h3>
                    <p className="text-muted-foreground mb-4">
                      Der EBIT-Multiple wird basierend auf Branchenbenchmarks und unternehmensspezifischen
                      Anpassungsfaktoren ermittelt:
                    </p>
                    <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                      Unternehmenswert = Bereinigtes EBIT (Ø 3 Jahre) × Angepasstes Multiple
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <li>
                        <strong>Basis-Multiple:</strong> Branchenspezifischer Median-Multiple basierend
                        auf vergleichbaren Transaktionen
                      </li>
                      <li>
                        <strong>Anpassungen:</strong> Individuelle Faktoren wie Wachstum, Risikoprofil,
                        Inhaberabhängigkeit etc. modifizieren das Multiple um typischerweise ±15-25%
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">3. Typische Multiple-Bandbreiten</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium mb-2">Handwerksbetriebe</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>Elektro / SHK: 3,5x - 6,0x EBIT</li>
                          <li>Tischlerei / Metallbau: 2,5x - 5,0x EBIT</li>
                          <li>Maler / Dachdecker: 2,0x - 4,5x EBIT</li>
                        </ul>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium mb-2">Produzierende Industrie</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>Präzisionsfertigung / CNC: 4,0x - 7,0x EBIT</li>
                          <li>Werkzeug- und Formenbau: 4,5x - 7,5x EBIT</li>
                          <li>Sondermaschinenbau: 5,0x - 8,5x EBIT</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">4. Vom Unternehmenswert zum Eigenkapitalwert</h3>
                    <p className="text-muted-foreground mb-4">
                      Der berechnete Wert entspricht dem Enterprise Value (Gesamtunternehmenswert). Für den
                      Eigenkapitalwert (Equity Value) sind weitere Anpassungen nötig:
                    </p>
                    <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                      Eigenkapitalwert = Unternehmenswert - Nettofinanzverbindlichkeiten + Überschüssige Liquidität
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">5. Einschränkungen</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>
                        <AlertTriangle className="inline h-4 w-4 text-amber-500 mr-1" />
                        Dieses Tool liefert eine indikative Bewertung, keine gutachterliche Stellungnahme
                      </li>
                      <li>
                        <AlertTriangle className="inline h-4 w-4 text-amber-500 mr-1" />
                        Branchenspezifische Besonderheiten und regionale Faktoren werden nur teilweise berücksichtigt
                      </li>
                      <li>
                        <AlertTriangle className="inline h-4 w-4 text-amber-500 mr-1" />
                        Der tatsächliche Transaktionspreis hängt von Verhandlungen und Marktbedingungen ab
                      </li>
                      <li>
                        <AlertTriangle className="inline h-4 w-4 text-amber-500 mr-1" />
                        Für rechtlich verbindliche Bewertungen ist ein Sachverständigengutachten erforderlich
                      </li>
                    </ul>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
