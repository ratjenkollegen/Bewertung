// EBITDA-Multiple Benchmarks für KMU nach Branchen und Größenklasse (Umsatz)
// Die Spannen (von/bis) stammen aus Markttransaktionsdaten; als Basis-Multiple dient der Median der Spanne.

export type SizeClassId = "micro" | "small" | "mid";

export interface SizeClass {
  id: SizeClassId;
  label: string;
  revenueRange: string;
}

export const sizeClasses: SizeClass[] = [
  { id: "micro", label: "Micro-Cap", revenueRange: "< 5 Mio. € Umsatz" },
  { id: "small", label: "Small-Cap", revenueRange: "5–50 Mio. € Umsatz" },
  { id: "mid", label: "Mid-Cap", revenueRange: "> 50 Mio. € Umsatz" },
];

export interface MultipleRange {
  low: number;
  median: number;
  high: number;
}

export interface SectorBenchmark {
  id: string;
  name: string;
  category: "industry" | "services";
  multiples: Record<SizeClassId, MultipleRange>;
  description: string;
  keyFactors: string[];
  typicalEBITDAMargin: {
    low: number;
    median: number;
    high: number;
  };
}

export interface AdjustmentFactor {
  id: string;
  name: string;
  category: string;
  weight: number;
  options: {
    value: number;
    label: string;
    description: string;
  }[];
}

const range = (low: number, high: number): MultipleRange => ({
  low,
  high,
  median: Math.round(((low + high) / 2) * 100) / 100,
});

const tiers = (
  micro: [number, number],
  small: [number, number],
  mid: [number, number]
): Record<SizeClassId, MultipleRange> => ({
  micro: range(...micro),
  small: range(...small),
  mid: range(...mid),
});

export function getSizeClass(revenue: number): SizeClass {
  if (revenue < 5_000_000) return sizeClasses[0];
  if (revenue <= 50_000_000) return sizeClasses[1];
  return sizeClasses[2];
}

export const sectorBenchmarks: SectorBenchmark[] = [
  // Industrie, Produktion & Bau
  {
    id: "machinery",
    name: "Maschinen- und Anlagenbau",
    category: "industry",
    multiples: tiers([3.6, 5.1], [4.6, 6.0], [5.6, 7.3]),
    description: "Allgemeiner Maschinenbau, Sondermaschinen, Anlagen- und Automatisierungstechnik",
    keyFactors: ["Servicegeschäft / Ersatzteile", "Engineering-Tiefe", "IP / Patente"],
    typicalEBITDAMargin: { low: 9, median: 13, high: 18 },
  },
  {
    id: "automotive",
    name: "Fahrzeugbau & Automotive",
    category: "industry",
    multiples: tiers([2.7, 4.5], [3.9, 5.1], [4.7, 6.1]),
    description: "Fahrzeug- und Karosseriebau, Automobilzulieferer, Komponentenfertigung",
    keyFactors: ["Abhängigkeit von OEMs", "E-Mobilitäts-Fähigkeit", "Preisdruck / Vertragsbedingungen"],
    typicalEBITDAMargin: { low: 6, median: 9, high: 13 },
  },
  {
    id: "electrical",
    name: "Elektrotechnik & Elektronik",
    category: "industry",
    multiples: tiers([4.2, 6.0], [5.7, 7.6], [6.8, 8.5]),
    description: "Elektrotechnische Komponenten, Elektronikfertigung (EMS), Steuerungs- und Messtechnik",
    keyFactors: ["Entwicklungskompetenz", "Branchenfokus (Industrie, Medizin)", "Lieferkettenstabilität"],
    typicalEBITDAMargin: { low: 9, median: 13, high: 18 },
  },
  {
    id: "metalworking",
    name: "Metallverarbeitung & Fertigungstechnik",
    category: "industry",
    multiples: tiers([3.4, 4.2], [4.1, 5.5], [5.0, 7.2]),
    description: "CNC-Zerspanung, Blechbearbeitung, Werkzeug- und Formenbau, Lohnfertigung",
    keyFactors: ["Maschinenpark-Modernität", "Automatisierungsgrad", "Kundenkonzentration"],
    typicalEBITDAMargin: { low: 9, median: 13, high: 18 },
  },
  {
    id: "chemicals",
    name: "Chemie, Kunststoffe & Verpackung",
    category: "industry",
    multiples: tiers([3.6, 4.6], [5.4, 6.5], [6.5, 8.1]),
    description: "Spezialchemie, Kunststoffverarbeitung (Spritzguss, Extrusion), Verpackungsherstellung",
    keyFactors: ["Rohstoffpreis-Abhängigkeit", "Technische Spezialisierung", "Nachhaltigkeit / Recycling"],
    typicalEBITDAMargin: { low: 9, median: 14, high: 19 },
  },
  {
    id: "medtech",
    name: "Medizintechnik & Life Sciences",
    category: "industry",
    multiples: tiers([5.9, 7.6], [7.1, 9.0], [8.2, 10.0]),
    description: "Medizinprodukte, Diagnostik, Labortechnik, Pharma-Zulieferer",
    keyFactors: ["Zulassungen (MDR, ISO 13485)", "Produktportfolio / IP", "Regulatorische Eintrittsbarrieren"],
    typicalEBITDAMargin: { low: 13, median: 19, high: 26 },
  },
  {
    id: "construction",
    name: "Bauhaupt- & Baunebengewerbe (Handwerk)",
    category: "industry",
    multiples: tiers([3.7, 5.0], [4.4, 5.8], [5.0, 6.8]),
    description: "Hoch- und Tiefbau, Ausbaugewerke, SHK, Elektroinstallation, Handwerksbetriebe",
    keyFactors: ["Auftragsbestand", "Fachkräfteverfügbarkeit", "Meisterqualifikation / Nachfolge"],
    typicalEBITDAMargin: { low: 6, median: 10, high: 14 },
  },
  {
    id: "food",
    name: "Nahrungs- & Genussmittel",
    category: "industry",
    multiples: tiers([4.4, 5.7], [5.5, 6.6], [6.8, 8.0]),
    description: "Lebensmittelherstellung, Getränke, Bäckereien, Feinkost und Genussmittel",
    keyFactors: ["Markenstärke", "Listungen im Handel", "Rohstoffkosten"],
    typicalEBITDAMargin: { low: 6, median: 10, high: 15 },
  },
  {
    id: "consumer_goods",
    name: "Konsumgüter (Non-Food)",
    category: "industry",
    multiples: tiers([2.5, 4.0], [3.6, 5.6], [4.8, 6.3]),
    description: "Haushaltswaren, Möbel, Textilien, Sport- und Freizeitartikel",
    keyFactors: ["Markenbekanntheit", "Vertriebskanäle", "Abhängigkeit von Trends"],
    typicalEBITDAMargin: { low: 6, median: 10, high: 15 },
  },
  // Dienstleistungen, Technologie & Handel
  {
    id: "software",
    name: "Software & Digitale Plattformen",
    category: "services",
    multiples: tiers([5.6, 7.6], [7.2, 9.0], [8.3, 10.6]),
    description: "Standardsoftware, SaaS, digitale Plattformen und Marktplätze",
    keyFactors: ["Wiederkehrende Umsätze (ARR)", "Kundenbindung / Churn", "Skalierbarkeit"],
    typicalEBITDAMargin: { low: 12, median: 20, high: 30 },
  },
  {
    id: "it_services",
    name: "IT-Services & Systemhäuser",
    category: "services",
    multiples: tiers([5.2, 6.7], [6.3, 8.5], [7.1, 9.6]),
    description: "IT-Dienstleister, Systemintegration, Managed Services, IT-Beratung",
    keyFactors: ["Anteil Managed Services", "Fachkräftebindung", "Herstellerpartnerschaften"],
    typicalEBITDAMargin: { low: 8, median: 12, high: 17 },
  },
  {
    id: "media",
    name: "Medien, Marketing & Agenturen",
    category: "services",
    multiples: tiers([3.2, 5.0], [4.4, 6.3], [6.0, 7.5]),
    description: "Werbe- und Digitalagenturen, Verlage, Medienproduktion, Marketingdienstleister",
    keyFactors: ["Abhängigkeit von Schlüsselpersonen", "Retainer-Anteil", "Kundendiversifikation"],
    typicalEBITDAMargin: { low: 7, median: 12, high: 17 },
  },
  {
    id: "telecom",
    name: "Telekommunikation & Infrastruktur",
    category: "services",
    multiples: tiers([4.2, 6.1], [5.7, 7.2], [6.3, 7.7]),
    description: "Netzbetreiber, Glasfaser- und Netzausbau, Rechenzentren, TK-Dienstleister",
    keyFactors: ["Langfristige Verträge", "Eigene Infrastruktur", "Investitionsbedarf"],
    typicalEBITDAMargin: { low: 14, median: 20, high: 28 },
  },
  {
    id: "healthcare",
    name: "Gesundheitswesen: Pflege & Dienstleister",
    category: "services",
    multiples: tiers([4.0, 5.9], [6.0, 8.1], [8.6, 10.1]),
    description: "Ambulante und stationäre Pflege, Therapiepraxen, medizinische Dienstleister",
    keyFactors: ["Fachkräfteverfügbarkeit", "Auslastung / Belegung", "Regulatorische Rahmenbedingungen"],
    typicalEBITDAMargin: { low: 8, median: 12, high: 17 },
  },
  {
    id: "business_services",
    name: "Unternehmensnahe Dienstleistungen (B2B)",
    category: "services",
    multiples: tiers([3.8, 5.7], [5.0, 7.2], [6.4, 8.0]),
    description: "Personaldienstleistungen, Beratung, Outsourcing- und Servicedienstleister",
    keyFactors: ["Rahmenverträge", "Kundendiversifikation", "Personalintensität"],
    typicalEBITDAMargin: { low: 7, median: 11, high: 16 },
  },
  {
    id: "real_estate_services",
    name: "Immobilien-Dienstl. & Facility Mgmt.",
    category: "services",
    multiples: tiers([4.1, 5.0], [5.0, 6.9], [6.5, 8.1]),
    description: "Hausverwaltung, Immobilienmakler, Gebäudereinigung, technisches Facility Management",
    keyFactors: ["Verwaltungsbestand / Verträge", "Kundenbindung", "Personalintensität"],
    typicalEBITDAMargin: { low: 7, median: 12, high: 18 },
  },
  {
    id: "financial_services",
    name: "Finanzdienstleistungen & Vers.-Makler",
    category: "services",
    multiples: tiers([4.7, 5.9], [6.0, 7.2], [8.4, 10.0]),
    description: "Versicherungsmakler, Finanzberatung, Vermögensverwaltung, Finanzvermittler",
    keyFactors: ["Bestandsprovisionen", "Kundenstruktur / Altersstruktur", "Regulatorik / Zulassungen"],
    typicalEBITDAMargin: { low: 15, median: 22, high: 30 },
  },
  {
    id: "ecommerce",
    name: "Handel: E-Commerce & Versand",
    category: "services",
    multiples: tiers([4.3, 6.9], [5.4, 7.4], [7.3, 9.3]),
    description: "Onlineshops, Marktplatzhändler, Versandhandel, D2C-Marken",
    keyFactors: ["Eigene Marke / Sortiment", "Kundenakquisitionskosten", "Plattformabhängigkeit"],
    typicalEBITDAMargin: { low: 5, median: 9, high: 14 },
  },
  {
    id: "retail_wholesale",
    name: "Handel: Groß- & Einzelhandel (Stationär)",
    category: "services",
    multiples: tiers([3.4, 4.5], [4.4, 5.4], [5.2, 6.7]),
    description: "Großhandel, Fachhandel, stationärer Einzelhandel",
    keyFactors: ["Standortqualität", "Lieferantenkonditionen", "Lagerumschlag"],
    typicalEBITDAMargin: { low: 3, median: 6, high: 10 },
  },
  {
    id: "logistics",
    name: "Transport, Logistik & Spedition",
    category: "services",
    multiples: tiers([3.7, 5.0], [4.5, 5.7], [5.6, 7.2]),
    description: "Spedition, Kontraktlogistik, Lagerhaltung, Transportunternehmen",
    keyFactors: ["Fuhrpark / Assets", "Kundenverträge", "Fahrermangel"],
    typicalEBITDAMargin: { low: 5, median: 8, high: 12 },
  },
];

// Anpassungsfaktoren für die Multiple-Bewertung
// Die Gesamtanpassung sollte typischerweise im Bereich von ±10-15% liegen
// Werte sind Schätzungen - in der Praxis individuell zu ermitteln
export const adjustmentFactors: AdjustmentFactor[] = [
  {
    id: "revenue_growth",
    name: "Umsatzwachstum",
    category: "Finanzielle Performance",
    weight: 0.15,
    options: [
      { value: -0.03, label: "Rückläufig (>5% p.a.)", description: "Umsatz sinkt mehr als 5% jährlich" },
      { value: -0.01, label: "Stagnierend (±2%)", description: "Umsatz weitgehend stabil" },
      { value: 0.01, label: "Moderates Wachstum (3-8%)", description: "Gesundes organisches Wachstum" },
      { value: 0.02, label: "Starkes Wachstum (>10%)", description: "Überdurchschnittliches Wachstum" },
    ],
  },
  {
    id: "ebitda_stability",
    name: "EBITDA-Marge Stabilität",
    category: "Finanzielle Performance",
    weight: 0.12,
    options: [
      { value: -0.02, label: "Stark schwankend", description: "Große Schwankungen von Jahr zu Jahr" },
      { value: -0.01, label: "Moderat schwankend", description: "Gewisse Variation, aber beherrschbar" },
      { value: 0.01, label: "Stabil", description: "Konstante Margen über 3+ Jahre" },
      { value: 0.02, label: "Stabil & steigend", description: "Konstant mit Aufwärtstrend" },
    ],
  },
  {
    id: "customer_concentration",
    name: "Kundenkonzentration",
    category: "Geschäftsrisiko",
    weight: 0.12,
    options: [
      { value: -0.04, label: "Sehr hoch (>50% Top-Kunde)", description: "Starke Abhängigkeit von einem Kunden" },
      { value: -0.02, label: "Hoch (>30% Top 3)", description: "Erhebliches Konzentrationsrisiko" },
      { value: 0.0, label: "Moderat (15-30% Top 3)", description: "Angemessene Diversifikation" },
      { value: 0.01, label: "Niedrig (<15% Top 3)", description: "Gut diversifizierter Kundenstamm" },
    ],
  },
  {
    id: "owner_dependency",
    name: "Inhaberabhängigkeit",
    category: "Geschäftsrisiko",
    weight: 0.15,
    options: [
      { value: -0.05, label: "Kritisch", description: "Betrieb kann ohne Inhaber nicht funktionieren" },
      { value: -0.02, label: "Hoch", description: "Inhaber pflegt Schlüsselbeziehungen/-prozesse" },
      { value: 0.0, label: "Moderat", description: "Zweite Führungsebene vorhanden" },
      { value: 0.02, label: "Niedrig", description: "Professionelles Management, Inhaber ersetzbar" },
    ],
  },
  {
    id: "workforce",
    name: "Mitarbeiterqualität & -bindung",
    category: "Operativ",
    weight: 0.10,
    options: [
      { value: -0.02, label: "Kritische Probleme", description: "Hohe Fluktuation, Fachkräftemangel, überalterte Belegschaft" },
      { value: -0.01, label: "Einige Herausforderungen", description: "Moderate Fluktuation, einige Qualifikationslücken" },
      { value: 0.01, label: "Solide", description: "Stabile Belegschaft, ausreichende Qualifikationen" },
      { value: 0.02, label: "Ausgezeichnet", description: "Geringe Fluktuation, hohe Qualifikation, Ausbildungsbetrieb" },
    ],
  },
  {
    id: "equipment",
    name: "Anlagen- / Maschinenqualität",
    category: "Operativ",
    weight: 0.10,
    options: [
      { value: -0.03, label: "Veraltet", description: "Hoher Investitionsbedarf, Wettbewerbsnachteil" },
      { value: -0.01, label: "Ausreichend", description: "Funktionsfähig, aber Modernisierung nötig" },
      { value: 0.01, label: "Gut", description: "Moderne Ausstattung, gut gewartet" },
      { value: 0.02, label: "Ausgezeichnet", description: "State-of-the-Art, Wettbewerbsvorteil" },
    ],
  },
  {
    id: "market_position",
    name: "Marktposition & Reputation",
    category: "Strategisch",
    weight: 0.10,
    options: [
      { value: -0.02, label: "Schwach", description: "Keine Differenzierung, Preiswettbewerb" },
      { value: 0.0, label: "Durchschnittlich", description: "Vergleichbar mit Wettbewerbern" },
      { value: 0.01, label: "Starke Regionalmarke", description: "Bekannte Marke in der Region" },
      { value: 0.02, label: "Marktführer", description: "Premium-Positionierung, starke Marke" },
    ],
  },
  {
    id: "digitalization",
    name: "Digitalisierungsgrad",
    category: "Strategisch",
    weight: 0.08,
    options: [
      { value: -0.02, label: "Minimal", description: "Papierbasiert, kein ERP, manuelle Prozesse" },
      { value: 0.0, label: "Grundlegend", description: "Basissoftware, teilweise digitalisiert" },
      { value: 0.01, label: "Gut", description: "ERP-System, digitale Workflows" },
      { value: 0.02, label: "Fortgeschritten", description: "Industrie 4.0, Automatisierung, datengetrieben" },
    ],
  },
  {
    id: "recurring_revenue",
    name: "Wiederkehrende Umsätze / Verträge",
    category: "Strategisch",
    weight: 0.08,
    options: [
      { value: -0.01, label: "Keine", description: "Alles projektbasiert, keine Wiederkehr" },
      { value: 0.0, label: "Gering (<10%)", description: "Einige Serviceverträge" },
      { value: 0.01, label: "Moderat (10-30%)", description: "Solide Service-/Wartungsbasis" },
      { value: 0.02, label: "Hoch (>30%)", description: "Starker wiederkehrender Umsatzstrom" },
    ],
  },
];

export interface CompanyInput {
  revenue: number;
  ebitda: number;
  sectorId: string;
  adjustments: Record<string, number>;
}

export interface ValuationResult {
  baseMultiple: number;
  adjustedMultiple: number;
  multipleRange: MultipleRange;
  sizeClass: SizeClass;
  enterpriseValue: {
    low: number;
    mid: number;
    high: number;
  };
  ebitdaMargin: number;
  adjustmentDetails: {
    factorId: string;
    factorName: string;
    impact: number;
  }[];
  benchmarkComparison: {
    sectorMedian: number;
    companyPosition: string;
  };
}

export function calculateValuation(input: CompanyInput): ValuationResult {
  const sector = sectorBenchmarks.find((s) => s.id === input.sectorId);
  if (!sector) throw new Error("Ungültiger Sektor");

  const sizeClass = getSizeClass(input.revenue);
  const multipleRange = sector.multiples[sizeClass.id];
  const ebitdaMargin = (input.ebitda / input.revenue) * 100;

  const baseMultiple = multipleRange.median;

  const adjustmentDetails: ValuationResult["adjustmentDetails"] = [];
  let totalAdjustment = 0;

  Object.entries(input.adjustments).forEach(([factorId, selectedValue]) => {
    const factor = adjustmentFactors.find((f) => f.id === factorId);
    if (factor) {
      totalAdjustment += selectedValue;
      adjustmentDetails.push({ factorId, factorName: factor.name, impact: selectedValue });
    }
  });

  // Angepasstes Multiple bleibt innerhalb der Spanne der Größenklasse
  const adjustedMultiple = Math.min(
    multipleRange.high,
    Math.max(multipleRange.low, baseMultiple * (1 + totalAdjustment))
  );

  const enterpriseValue = {
    low: input.ebitda * Math.max(multipleRange.low, adjustedMultiple * 0.85),
    mid: input.ebitda * adjustedMultiple,
    high: input.ebitda * Math.min(multipleRange.high, adjustedMultiple * 1.15),
  };

  let companyPosition = "Durchschnittlich";
  if (adjustedMultiple > multipleRange.high * 0.95) {
    companyPosition = "Premium";
  } else if (adjustedMultiple > baseMultiple * 1.05) {
    companyPosition = "Überdurchschnittlich";
  } else if (adjustedMultiple < multipleRange.low * 1.05) {
    companyPosition = "Discount";
  } else if (adjustedMultiple < baseMultiple * 0.95) {
    companyPosition = "Unterdurchschnittlich";
  }

  return {
    baseMultiple,
    adjustedMultiple,
    multipleRange,
    sizeClass,
    enterpriseValue,
    ebitdaMargin,
    adjustmentDetails,
    benchmarkComparison: {
      sectorMedian: baseMultiple,
      companyPosition,
    },
  };
}

export function formatCurrency(value: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
