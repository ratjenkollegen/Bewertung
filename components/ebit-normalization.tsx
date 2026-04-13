"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Minus,
  Trash2,
  Info,
  Calculator,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/valuation-data";

// Hilfsfunktion zum Parsen von deutschen Zahlenformaten
function parseGermanNumber(value: string): number {
  const cleaned = value.replace(/\./g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

// Formatierung für Eingabefelder
function formatInputNumber(value: string): string {
  const numericValue = value.replace(/[^0-9-]/g, "");
  if (!numericValue || numericValue === "-") return numericValue;
  const num = parseInt(numericValue);
  return isNaN(num) ? "" : num.toLocaleString("de-DE");
}

// BBE Gehaltsstrukturuntersuchung 2025 (Daten aus 2024)
// Marktübliche GF-Gehälter nach Umsatzgröße
// Quelle: BBE media, anerkannt von Finanzverwaltung und Finanzgerichten
const bbeSalaryByRevenue = [
  { maxRevenue: 1000000, label: "bis 1 Mio. EUR", avgSalary: 149502, description: "Durchschnittliche Jahresgesamtbezüge lt. BBE 2025" },
  { maxRevenue: 2500000, label: "1 - 2,5 Mio. EUR", avgSalary: 168629, description: "Durchschnittliche Jahresgesamtbezüge lt. BBE 2025" },
  { maxRevenue: 5000000, label: "2,5 - 5 Mio. EUR", avgSalary: 193767, description: "Durchschnittliche Jahresgesamtbezüge lt. BBE 2025" },
  { maxRevenue: 10000000, label: "5 - 10 Mio. EUR", avgSalary: 195788, description: "Durchschnittliche Jahresgesamtbezüge lt. BBE 2025" },
  { maxRevenue: 25000000, label: "10 - 25 Mio. EUR", avgSalary: 226292, description: "Durchschnittliche Jahresgesamtbezüge lt. BBE 2025" },
  { maxRevenue: Infinity, label: "über 25 Mio. EUR", avgSalary: 242625, description: "Durchschnittliche Jahresgesamtbezüge lt. BBE 2025" },
];

// Branchenfaktoren für GF-Gehälter (relativ zum Durchschnitt)
// Quelle: BBE Gehälterstudie 2025
const industryFactors: Record<string, { factor: number; avgSalary: number }> = {
  industrie: { factor: 1.30, avgSalary: 246313 },
  grosshandel: { factor: 1.03, avgSalary: 195255 },
  dienstleistung: { factor: 0.94, avgSalary: 177797 },
  handwerk: { factor: 0.84, avgSalary: 158441 },
  einzelhandel: { factor: 0.80, avgSalary: 151301 },
};

// Funktion zur Ermittlung des marktüblichen Gehalts basierend auf Umsatz
function getMarketSalaryByRevenue(revenue: number): { salary: number; label: string; description: string } {
  const bracket = bbeSalaryByRevenue.find(b => revenue <= b.maxRevenue) || bbeSalaryByRevenue[bbeSalaryByRevenue.length - 1];
  return { salary: bracket.avgSalary, label: bracket.label, description: bracket.description };
}

// Unternehmerlohn für Einzelunternehmen/Personengesellschaften
// Orientierungswerte basierend auf Umsatzgröße (konservativere Ansätze als GF-Gehälter)
const entrepreneurSalaryByRevenue = [
  { maxRevenue: 500000, label: "bis 500 TEUR", salary: 48000, description: "Angemessener Unternehmerlohn" },
  { maxRevenue: 1000000, label: "500 TEUR - 1 Mio. EUR", salary: 60000, description: "Angemessener Unternehmerlohn" },
  { maxRevenue: 2500000, label: "1 - 2,5 Mio. EUR", salary: 80000, description: "Angemessener Unternehmerlohn" },
  { maxRevenue: 5000000, label: "2,5 - 5 Mio. EUR", salary: 100000, description: "Angemessener Unternehmerlohn" },
  { maxRevenue: 10000000, label: "5 - 10 Mio. EUR", salary: 120000, description: "Angemessener Unternehmerlohn" },
  { maxRevenue: Infinity, label: "über 10 Mio. EUR", salary: 150000, description: "Angemessener Unternehmerlohn" },
];

function getEntrepreneurSalaryByRevenue(revenue: number): { salary: number; label: string; description: string } {
  const bracket = entrepreneurSalaryByRevenue.find(b => revenue <= b.maxRevenue) || entrepreneurSalaryByRevenue[entrepreneurSalaryByRevenue.length - 1];
  return { salary: bracket.salary, label: bracket.label, description: bracket.description };
}

export type LegalForm = "" | "einzelunternehmen" | "personengesellschaft" | "gmbh" | "ug" | "ltd" | "ag" | "gmbh_co_kg";

export interface YearData {
  year: number;
  revenue: string;
  reportedEbit: string;
  additions: AdjustmentItem[];
  deductions: AdjustmentItem[];
  currentSalary: string;
  marketSalary: string;
}

export interface AdjustmentItem {
  id: string;
  category: string;
  description: string;
  amount: string;
}

export interface NormalizationResult {
  years: {
    year: number;
    revenue: number;
    reportedEbit: number;
    totalAdditions: number;
    totalDeductions: number;
    salaryAdjustment: number;
    normalizedEbit: number;
    currentSalary: number;
    marketSalary: number;
  }[];
  averageNormalizedEbit: number;
  averageRevenue: number;
  legalForm: string;
  legalFormLabel: string;
  averageMarketSalary: number;
}

// Vordefinierte Kategorien für Hinzurechnungen
const additionCategories = [
  { id: "restructuring", label: "Restrukturierungskosten, Abfindungen" },
  { id: "non_operating_expenses", label: "Betriebsfremde Aufwendungen" },
  { id: "extraordinary_maintenance", label: "Außerordentliche Instandhaltung" },
  { id: "legal_costs", label: "Prozesskosten" },
  { id: "writedowns", label: "Teilwertabschreibungen / Forderungsverluste" },
  { id: "loss_deduction", label: "Verlustabzug" },
  { id: "disposal_losses", label: "Einmalige Veräußerungsverluste" },
  { id: "prior_period_expenses", label: "Periodenfremde Aufwendungen" },
  { id: "goodwill_depreciation", label: "AfA auf Firmenwert" },
  { id: "corona_repayment", label: "Corona-Zuschuss-Rückzahlung" },
  { id: "investment_grants", label: "Investitionszuschüsse" },
  { id: "other_additions", label: "Sonstiges" },
];

// Vordefinierte Kategorien für Kürzungen
const deductionCategories = [
  { id: "disposal_gains", label: "Einmalige Veräußerungsgewinne" },
  { id: "provision_release", label: "Erträge aus Auflösung von Rückstellungen" },
  { id: "tax_free_reserves", label: "Auflösung steuerfreier Rücklagen" },
  { id: "tax_refunds", label: "Erträge aus Erstattung von Ertragsteuern" },
  { id: "receivables_income", label: "Erträge PWB/EWB Forderungen" },
  { id: "extraordinary_income", label: "Außerordentliche Erträge, sonstige Erträge" },
  { id: "corona_grants", label: "Corona-Zuschuss" },
  { id: "insurance_compensation", label: "Versicherungsentschädigung" },
  { id: "other_deductions", label: "Sonstiges" },
];

interface EbitNormalizationProps {
  onNormalizationComplete: (result: NormalizationResult) => void;
  initialYears?: YearData[];
}

export function EbitNormalization({ onNormalizationComplete }: EbitNormalizationProps) {
  const currentYear = new Date().getFullYear();
  
  const createEmptyYear = (year: number): YearData => ({
    year,
    revenue: "",
    reportedEbit: "",
    additions: [],
    deductions: [],
    currentSalary: "",
    marketSalary: "",
  });

  // Globale Rechtsform (gilt für alle Jahre) - initial leer für Placeholder
  const [legalForm, setLegalForm] = useState<LegalForm>("");

  const [years, setYears] = useState<YearData[]>([
    createEmptyYear(currentYear - 3),
    createEmptyYear(currentYear - 2),
    createEmptyYear(currentYear - 1),
  ]);

  const updateYear = (yearIndex: number, updates: Partial<YearData>) => {
    setYears((prev) =>
      prev.map((y, i) => (i === yearIndex ? { ...y, ...updates } : y))
    );
  };
  
  // Separate Funktion für Gehalt-Übernahme bei onBlur (wenn Feld verlassen wird)
  const propagateSalaryToOtherYears = (yearIndex: number, field: "currentSalary" | "marketSalary", value: string) => {
    if (yearIndex === 0 && value) {
      setYears((prev) => {
        const newYears = [...prev];
        // Nur übernehmen, wenn die Folgejahre noch leer sind
        if (!newYears[1][field]) {
          newYears[1] = { ...newYears[1], [field]: value };
        }
        if (!newYears[2][field]) {
          newYears[2] = { ...newYears[2], [field]: value };
        }
        return newYears;
      });
    }
  };

  const addAdjustmentItem = (yearIndex: number, type: "additions" | "deductions") => {
    const newItem: AdjustmentItem = {
      id: crypto.randomUUID(),
      category: "",
      description: "",
      amount: "",
    };
    setYears((prev) =>
      prev.map((y, i) =>
        i === yearIndex ? { ...y, [type]: [...y[type], newItem] } : y
      )
    );
  };

  const updateAdjustmentItem = (
    yearIndex: number,
    type: "additions" | "deductions",
    itemId: string,
    updates: Partial<AdjustmentItem>
  ) => {
    setYears((prev) =>
      prev.map((y, i) =>
        i === yearIndex
          ? {
              ...y,
              [type]: y[type].map((item) =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
            }
          : y
      )
    );
  };

  const removeAdjustmentItem = (
    yearIndex: number,
    type: "additions" | "deductions",
    itemId: string
  ) => {
    setYears((prev) =>
      prev.map((y, i) =>
        i === yearIndex
          ? { ...y, [type]: y[type].filter((item) => item.id !== itemId) }
          : y
      )
    );
  };

  const isCapitalCompany = (form: LegalForm) => {
    return ["gmbh", "ug", "ltd", "ag", "gmbh_co_kg"].includes(form);
  };

  const isPersonalCompany = (form: LegalForm) => {
    return ["einzelunternehmen", "personengesellschaft"].includes(form);
  };

  // Berechnung des normalisierten EBIT pro Jahr
  const calculateNormalizedEbit = (yearData: YearData) => {
    const reportedEbit = parseGermanNumber(yearData.reportedEbit);
    
    const totalAdditions = yearData.additions.reduce(
      (sum, item) => sum + parseGermanNumber(item.amount),
      0
    );
    
    const totalDeductions = yearData.deductions.reduce(
      (sum, item) => sum + parseGermanNumber(item.amount),
      0
    );

    let salaryAdjustment = 0;
    const marketSalary = parseGermanNumber(yearData.marketSalary);
    
    if (isPersonalCompany(legalForm)) {
      salaryAdjustment = -marketSalary;
    } else if (isCapitalCompany(legalForm)) {
      const currentSalary = parseGermanNumber(yearData.currentSalary);
      salaryAdjustment = currentSalary - marketSalary;
    }

    return {
      reportedEbit,
      totalAdditions,
      totalDeductions,
      salaryAdjustment,
      normalizedEbit: reportedEbit + totalAdditions - totalDeductions + salaryAdjustment,
    };
  };

  const yearResults = useMemo(() => {
    return years.map((yearData) => ({
      year: yearData.year,
      revenue: parseGermanNumber(yearData.revenue),
      currentSalary: parseGermanNumber(yearData.currentSalary),
      marketSalary: parseGermanNumber(yearData.marketSalary),
      ...calculateNormalizedEbit(yearData),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [years, legalForm]);

  const averageNormalizedEbit = useMemo(() => {
    const validYears = yearResults.filter((y) => y.reportedEbit !== 0);
    if (validYears.length === 0) return 0;
    return validYears.reduce((sum, y) => sum + y.normalizedEbit, 0) / validYears.length;
  }, [yearResults]);

  const averageRevenue = useMemo(() => {
    const revenueValues = years
      .map((y) => parseGermanNumber(y.revenue))
      .filter((v) => v > 0);
    if (revenueValues.length === 0) return 0;
    return revenueValues.reduce((sum, v) => sum + v, 0) / revenueValues.length;
  }, [years]);

  // Rechtsform-Label für die Anzeige
  const getLegalFormLabel = (form: LegalForm): string => {
    const labels: Record<LegalForm, string> = {
      "": "",
      "einzelunternehmen": "Einzelunternehmen",
      "personengesellschaft": "Personengesellschaft (OHG, KG, GbR)",
      "gmbh": "GmbH",
      "ug": "UG (haftungsbeschränkt)",
      "gmbh_co_kg": "GmbH & Co. KG",
      "ag": "AG",
      "ltd": "Ltd.",
    };
    return labels[form] || form;
  };

  // Durchschnittlicher marktüblicher Lohn/Gehalt
  const averageMarketSalary = useMemo(() => {
    const salaryValues = years
      .map((y) => parseGermanNumber(y.marketSalary))
      .filter((v) => v > 0);
    if (salaryValues.length === 0) return 0;
    return salaryValues.reduce((sum, v) => sum + v, 0) / salaryValues.length;
  }, [years]);

  const handleComplete = () => {
    onNormalizationComplete({
      years: yearResults,
      averageNormalizedEbit,
      averageRevenue,
      legalForm,
      legalFormLabel: getLegalFormLabel(legalForm),
      averageMarketSalary,
    });
  };

  // Validierung: Alle drei Jahre müssen Umsatz, EBIT und Unternehmervergütung haben
  const allYearsComplete = years.every((y) => {
    const hasRevenue = parseGermanNumber(y.revenue) > 0;
    const hasEbit = parseGermanNumber(y.reportedEbit) > 0;
    const ebitNotGreaterThanRevenue = parseGermanNumber(y.reportedEbit) <= parseGermanNumber(y.revenue);
    
    // Unternehmervergütung ist immer Pflicht
    let salaryValid = false;
    if (legalForm === "") {
      salaryValid = false; // Keine Rechtsform gewählt
    } else if (isCapitalCompany(legalForm)) {
      // Bei Kapitalgesellschaften: Sowohl aktuelles als auch marktübliches Gehalt erforderlich
      salaryValid = !!y.currentSalary && !!y.marketSalary;
    } else {
      // Bei Personengesellschaften/Einzelunternehmen: Unternehmerlohn erforderlich
      salaryValid = !!y.marketSalary;
    }
    
    return hasRevenue && hasEbit && ebitNotGreaterThanRevenue && salaryValid;
  });
  
  const hasLegalForm = legalForm !== "";
  
  const isComplete = allYearsComplete && hasLegalForm && averageRevenue > 0;
  
  // Fehlermeldungen für Button
  const getIncompleteMessage = () => {
    if (!hasLegalForm) return "Bitte Rechtsform auswählen";
    const missingYears = years.filter((y) => !parseGermanNumber(y.revenue) || !parseGermanNumber(y.reportedEbit));
    if (missingYears.length > 0) return "Bitte für alle 3 Jahre Umsatz und EBIT eingeben";
    const invalidEbit = years.filter((y) => parseGermanNumber(y.reportedEbit) > parseGermanNumber(y.revenue));
    if (invalidEbit.length > 0) return "EBIT darf nicht höher als Umsatz sein";
    
    // Unternehmervergütung prüfen
    if (isCapitalCompany(legalForm)) {
      const missingCurrentSalary = years.filter((y) => !y.currentSalary);
      if (missingCurrentSalary.length > 0) return "Bitte aktuelles GF-Gehalt für alle Jahre eingeben";
      const missingMarketSalary = years.filter((y) => !y.marketSalary);
      if (missingMarketSalary.length > 0) return "Bitte marktübliches GF-Gehalt für alle Jahre eingeben";
    } else {
      const missingEntrepreneurSalary = years.filter((y) => !y.marketSalary);
      if (missingEntrepreneurSalary.length > 0) return "Bitte Unternehmerlohn für alle Jahre eingeben";
    }
    
    return "Bitte alle Pflichtfelder ausfüllen";
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Übersichtskarte mit Rechtsform */}
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-accent" />
              EBIT-Bereinigung (3-Jahres-Durchschnitt)
            </CardTitle>
            <CardDescription>
              Bereinigen Sie das EBIT um nicht-operative und einmalige Positionen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Globale Rechtsform */}
            <div className={`flex items-center gap-4 p-4 rounded-lg bg-card border ${!legalForm ? "border-amber-400" : ""}`}>
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-sm font-medium">Rechtsform des Unternehmens <span className="text-red-500">*</span></Label>
                <p className="text-xs text-muted-foreground">
                  {!legalForm 
                    ? "Pflichtfeld - Bitte wählen Sie die Rechtsform aus"
                    : isCapitalCompany(legalForm) 
                      ? "GF-Gehalt wird auf Angemessenheit geprüft" 
                      : "Angemessener Unternehmerlohn wird abgezogen"}
                </p>
              </div>
              <Select value={legalForm} onValueChange={(v: LegalForm) => setLegalForm(v)}>
                <SelectTrigger className={`w-[280px] ${!legalForm ? "border-amber-400" : ""}`}>
                  <SelectValue placeholder="Geben Sie die Rechtsform ein" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="einzelunternehmen">Einzelunternehmen</SelectItem>
                  <SelectItem value="personengesellschaft">Personengesellschaft (OHG, KG, GbR)</SelectItem>
                  <SelectItem value="gmbh">GmbH</SelectItem>
                  <SelectItem value="ug">UG (haftungsbeschränkt)</SelectItem>
                  <SelectItem value="gmbh_co_kg">GmbH & Co. KG</SelectItem>
                  <SelectItem value="ag">AG</SelectItem>
                  <SelectItem value="ltd">Ltd.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ergebnis-Übersicht */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border bg-card p-4">
                <div className="text-sm text-muted-foreground">Durchschnittsumsatz</div>
                <div className="text-2xl font-bold">{formatCurrency(averageRevenue)}</div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-sm text-muted-foreground">Bereinigtes EBIT (Ø)</div>
                <div className="text-2xl font-bold text-accent">
                  {formatCurrency(averageNormalizedEbit)}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-sm text-muted-foreground">Bereinigte EBIT-Marge</div>
                <div className="text-2xl font-bold">
                  {averageRevenue > 0
                    ? formatNumber((averageNormalizedEbit / averageRevenue) * 100) + "%"
                    : "—"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3 Jahre nebeneinander */}
        <div className="grid gap-4 lg:grid-cols-3">
          {years.map((yearData, yearIndex) => (
            <Card key={yearData.year} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">{yearData.year}</CardTitle>
                  {yearResults[yearIndex].reportedEbit !== 0 && (
                    <Badge variant="secondary" className="font-mono text-xs">
                      {formatCurrency(yearResults[yearIndex].normalizedEbit)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {/* Umsatz und EBIT */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Umsatz <span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      placeholder="z.B. 2.500.000"
                      value={yearData.revenue}
                      className={!yearData.revenue ? "border-amber-400" : ""}
                      onChange={(e) => updateYear(yearIndex, { revenue: formatInputNumber(e.target.value) })}
                    />
                    {!yearData.revenue && (
                      <p className="text-xs text-amber-600">Pflichtfeld</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Label className="text-xs">Ausgewiesenes EBIT <span className="text-red-500">*</span></Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-medium mb-1">EBIT = Gewinn vor Zinsen und Ertragssteuern</p>
                          <p className="text-sm">Berechnung: Jahresüberschuss + Zinsaufwand + Ertragssteuern</p>
                          <p className="text-sm mt-1">Sie finden diese Werte in Ihrer Gewinn- und Verlustrechnung (GuV).</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      type="text"
                      placeholder="z.B. 200.000"
                      value={yearData.reportedEbit}
                      onChange={(e) => {
                        const newEbit = formatInputNumber(e.target.value);
                        updateYear(yearIndex, { reportedEbit: newEbit });
                      }}
                      className={
                        yearData.revenue && yearData.reportedEbit &&
                        parseGermanNumber(yearData.reportedEbit) > parseGermanNumber(yearData.revenue)
                          ? "border-red-500 focus-visible:ring-red-500"
                          : !yearData.reportedEbit
                            ? "border-amber-400"
                            : ""
                      }
                    />
                    {yearData.revenue && yearData.reportedEbit &&
                      parseGermanNumber(yearData.reportedEbit) > parseGermanNumber(yearData.revenue) && (
                      <p className="text-xs text-red-600 mt-1">
                        EBIT kann nicht höher als der Umsatz sein
                      </p>
                    )}
                    {!yearData.reportedEbit && (
                      <p className="text-xs text-amber-600">Pflichtfeld</p>
                    )}
                  </div>
                </div>

                {/* Hinzurechnungen */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Plus className="h-3 w-3 text-green-600" />
                      <Label className="text-xs text-green-700">Hinzurechnungen</Label>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => addAdjustmentItem(yearIndex, "additions")}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  {yearData.additions.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">Keine</p>
                  ) : (
                    <div className="space-y-1">
                      {yearData.additions.map((item) => (
                        <div key={item.id} className="space-y-1 p-2 rounded bg-green-50 border border-green-200">
                          <Select
                            value={item.category}
                            onValueChange={(value) =>
                              updateAdjustmentItem(yearIndex, "additions", item.id, { category: value })
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Kategorie wählen..." />
                            </SelectTrigger>
                            <SelectContent>
                              {additionCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id} className="text-xs">
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-1 items-center">
                            <Input
                              type="text"
                              placeholder="Betrag in EUR"
                              value={item.amount}
                              className="h-8 text-xs flex-1"
                              onChange={(e) =>
                                updateAdjustmentItem(yearIndex, "additions", item.id, {
                                  amount: formatInputNumber(e.target.value),
                                })
                              }
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:bg-red-100"
                              onClick={() => removeAdjustmentItem(yearIndex, "additions", item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Kürzungen */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Minus className="h-3 w-3 text-red-600" />
                      <Label className="text-xs text-red-700">Kürzungen</Label>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => addAdjustmentItem(yearIndex, "deductions")}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  {yearData.deductions.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">Keine</p>
                  ) : (
                    <div className="space-y-2">
                      {yearData.deductions.map((item) => (
                        <div key={item.id} className="space-y-1 p-2 rounded bg-red-50 border border-red-200">
                          <Select
                            value={item.category}
                            onValueChange={(value) =>
                              updateAdjustmentItem(yearIndex, "deductions", item.id, { category: value })
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Kategorie wählen..." />
                            </SelectTrigger>
                            <SelectContent>
                              {deductionCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id} className="text-xs">
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-1 items-center">
                            <Input
                              type="text"
                              placeholder="Betrag in EUR"
                              value={item.amount}
                              className="h-8 text-xs flex-1"
                              onChange={(e) =>
                                updateAdjustmentItem(yearIndex, "deductions", item.id, {
                                  amount: formatInputNumber(e.target.value),
                                })
                              }
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:bg-red-100"
                              onClick={() => removeAdjustmentItem(yearIndex, "deductions", item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Gehaltsanpassung */}
                <div className="space-y-2 p-2 rounded bg-secondary/30">
                  <div className="flex items-center gap-1">
                    <Info className="h-3 w-3 text-amber-600" />
                    <Label className="text-xs font-medium">
                      {isCapitalCompany(legalForm) ? "GF-Gehalt" : "Unternehmerlohn"}
                    </Label>
                  </div>
                  <div className="space-y-2">
                    {isCapitalCompany(legalForm) && (
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Aktuelles GF-Gehalt (lt. Lohnkonto) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          placeholder="z.B. 120.000"
                          value={yearData.currentSalary}
                          className={`h-8 text-xs ${
                            !yearData.currentSalary
                              ? "border-amber-400"
                              : ""
                          }`}
                          onChange={(e) =>
                            updateYear(yearIndex, { currentSalary: formatInputNumber(e.target.value) })
                          }
                          onBlur={(e) =>
                            propagateSalaryToOtherYears(yearIndex, "currentSalary", formatInputNumber(e.target.value))
                          }
                        />
                        {!yearData.currentSalary && (
                          <p className="text-xs text-amber-600">
                            Pflichtfeld
                          </p>
                        )}
                      </div>
                    )}
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        {isCapitalCompany(legalForm) ? "Marktübliches Gehalt" : "Angemessener Unternehmerlohn"} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="z.B. 80.000"
                        value={yearData.marketSalary}
                        className={`h-8 text-xs ${!yearData.marketSalary ? "border-amber-400" : ""}`}
                        onChange={(e) =>
                          updateYear(yearIndex, { marketSalary: formatInputNumber(e.target.value) })
                        }
                        onBlur={(e) =>
                          propagateSalaryToOtherYears(yearIndex, "marketSalary", formatInputNumber(e.target.value))
                        }
                      />
                      {!yearData.marketSalary && (
                        <p className="text-xs text-amber-600">Pflichtfeld</p>
                      )}
                      {/* BBE Empfehlung basierend auf Umsatz anzeigen */}
                      {yearData.revenue && parseGermanNumber(yearData.revenue) > 0 && (
                        <div className="text-xs text-muted-foreground mt-1 p-1.5 bg-blue-50 rounded border border-blue-200">
                          <div className="font-medium text-blue-700 mb-0.5">
                            {isCapitalCompany(legalForm) ? "BBE-Richtwert:" : "Richtwert:"}
                          </div>
                          <div className="text-blue-600">
                            {isCapitalCompany(legalForm) 
                              ? formatCurrency(getMarketSalaryByRevenue(parseGermanNumber(yearData.revenue)).salary)
                              : formatCurrency(getEntrepreneurSalaryByRevenue(parseGermanNumber(yearData.revenue)).salary)
                            }
                          </div>
                          <div className="text-blue-500 text-[10px]">
                            {isCapitalCompany(legalForm)
                              ? `(Umsatz ${getMarketSalaryByRevenue(parseGermanNumber(yearData.revenue)).label})`
                              : `(Umsatz ${getEntrepreneurSalaryByRevenue(parseGermanNumber(yearData.revenue)).label})`
                            }
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 text-[10px] px-1 mt-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                            onClick={() => {
                              const salary = isCapitalCompany(legalForm)
                                ? getMarketSalaryByRevenue(parseGermanNumber(yearData.revenue)).salary
                                : getEntrepreneurSalaryByRevenue(parseGermanNumber(yearData.revenue)).salary;
                              updateYear(yearIndex, { marketSalary: salary.toLocaleString("de-DE") });
                            }}
                          >
                            Übernehmen
                          </Button>
                        </div>
                      )}
                    </div>
                    {yearResults[yearIndex].salaryAdjustment !== 0 && (
                      <div className={`text-xs font-medium ${yearResults[yearIndex].salaryAdjustment > 0 ? "text-green-600" : "text-red-600"}`}>
                        {yearResults[yearIndex].salaryAdjustment > 0 ? "+" : ""}
                        {formatCurrency(yearResults[yearIndex].salaryAdjustment)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Zusammenfassung */}
                {yearResults[yearIndex].reportedEbit !== 0 && (
                  <div className="text-xs space-y-1 p-2 rounded bg-muted/50 border">
                    <div className="flex justify-between">
                      <span>EBIT lt. GuV:</span>
                      <span className="font-mono">{formatCurrency(yearResults[yearIndex].reportedEbit)}</span>
                    </div>
                    {yearResults[yearIndex].totalAdditions > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>+ Hinzurechn.:</span>
                        <span className="font-mono">+{formatCurrency(yearResults[yearIndex].totalAdditions)}</span>
                      </div>
                    )}
                    {yearResults[yearIndex].totalDeductions > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>- Kürzungen:</span>
                        <span className="font-mono">-{formatCurrency(yearResults[yearIndex].totalDeductions)}</span>
                      </div>
                    )}
                    {yearResults[yearIndex].salaryAdjustment !== 0 && (
                      <div className={`flex justify-between ${yearResults[yearIndex].salaryAdjustment > 0 ? "text-green-600" : "text-red-600"}`}>
                        <span>Gehalt:</span>
                        <span className="font-mono">
                          {yearResults[yearIndex].salaryAdjustment > 0 ? "+" : ""}
                          {formatCurrency(yearResults[yearIndex].salaryAdjustment)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-1 font-semibold">
                      <span>Bereinigt:</span>
                      <span className="font-mono text-accent">{formatCurrency(yearResults[yearIndex].normalizedEbit)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Abschluss-Button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleComplete}
            disabled={!isComplete}
            className="gap-2"
          >
            {isComplete ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Mit bereinigtem EBIT fortfahren
              </>
            ) : (
              getIncompleteMessage()
            )}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
