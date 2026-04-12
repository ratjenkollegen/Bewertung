// EBIT-Multiple Benchmarks für Handwerk und produzierende Industrie
// Basierend auf Markttransaktionsdaten und Branchenanalysen

export interface SectorBenchmark {
  id: string;
  name: string;
  category: "craft" | "manufacturing";
  baseMultiple: {
    low: number;
    median: number;
    high: number;
  };
  description: string;
  keyFactors: string[];
  typicalEBITMargin: {
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

export const sectorBenchmarks: SectorBenchmark[] = [
  // Handwerksbetriebe
  {
    id: "electrical",
    name: "Elektroinstallation",
    category: "craft",
    baseMultiple: { low: 3.5, median: 4.5, high: 6.0 },
    description: "Elektroinstallateure, Industrieelektriker, Smart-Home-Installationen",
    keyFactors: ["Wiederkehrende Wartungsverträge", "Spezialisierungsgrad", "Kundendiversifikation"],
    typicalEBITMargin: { low: 5, median: 8, high: 12 },
  },
  {
    id: "hvac",
    name: "Sanitär, Heizung, Klima (SHK)",
    category: "craft",
    baseMultiple: { low: 3.5, median: 5.0, high: 7.0 },
    description: "Heizungsinstallation, Klimaanlagen, Sanitärdienstleistungen",
    keyFactors: ["Wartungsvertragsbasis", "Wärmepumpen-Expertise", "Energieeffizienz-Fokus"],
    typicalEBITMargin: { low: 6, median: 9, high: 14 },
  },
  {
    id: "carpentry",
    name: "Tischlerei / Schreinerei",
    category: "craft",
    baseMultiple: { low: 2.5, median: 3.5, high: 5.0 },
    description: "Möbelbau nach Maß, Innenausbau, Fensterfertigung",
    keyFactors: ["CNC-Automatisierungsgrad", "Designfähigkeiten", "Premium-Positionierung"],
    typicalEBITMargin: { low: 4, median: 7, high: 11 },
  },
  {
    id: "metalwork",
    name: "Metallbau / Schlosserei",
    category: "craft",
    baseMultiple: { low: 3.0, median: 4.0, high: 5.5 },
    description: "Stahlkonstruktionen, Metallverarbeitung, Schweißarbeiten",
    keyFactors: ["Zertifizierungen (EN 1090)", "Projektkomplexität", "Industrie vs. Bau"],
    typicalEBITMargin: { low: 5, median: 8, high: 12 },
  },
  {
    id: "roofing",
    name: "Dachdeckerei",
    category: "craft",
    baseMultiple: { low: 2.5, median: 3.5, high: 5.0 },
    description: "Dachinstallation, Reparatur und Solaranlagen-Integration",
    keyFactors: ["Solarinstallations-Fähigkeit", "Versicherungsaufträge", "Regionale Reputation"],
    typicalEBITMargin: { low: 4, median: 7, high: 10 },
  },
  {
    id: "painting",
    name: "Maler- und Lackierbetrieb",
    category: "craft",
    baseMultiple: { low: 2.0, median: 3.0, high: 4.5 },
    description: "Innen- und Außenmalerei, Industriebeschichtungen",
    keyFactors: ["Gewerbe- vs. Privatkunden-Mix", "Spezialbeschichtungen", "Mitarbeiterbindung"],
    typicalEBITMargin: { low: 3, median: 6, high: 9 },
  },
  {
    id: "masonry",
    name: "Maurerei / Hochbau",
    category: "craft",
    baseMultiple: { low: 2.5, median: 3.5, high: 5.0 },
    description: "Mauerarbeiten, Betonarbeiten, allgemeiner Hochbau",
    keyFactors: ["Maschinenpark-Eigentum", "Projektgröße", "Subunternehmer-Netzwerk"],
    typicalEBITMargin: { low: 4, median: 7, high: 11 },
  },
  {
    id: "automotive",
    name: "Kfz-Werkstatt / Kfz-Handel",
    category: "craft",
    baseMultiple: { low: 2.5, median: 3.5, high: 5.0 },
    description: "Autoreparatur, Wartung, Diagnose, Fahrzeughandel (Neu- und Gebrauchtwagen)",
    keyFactors: ["Markenbindung", "E-Fahrzeug-Service", "Kundenstamm-Loyalität", "Handelsmargen"],
    typicalEBITMargin: { low: 4, median: 7, high: 10 },
  },
  // Produzierende Industrie / Maschinenbau
  {
    id: "precision",
    name: "Präzisionsfertigung / Feinmechanik",
    category: "manufacturing",
    baseMultiple: { low: 4.0, median: 5.5, high: 7.5 },
    description: "Hochpräzisionsteile, Medizintechnik-Komponenten, Luftfahrtteile",
    keyFactors: ["Zertifizierungen (ISO 13485, AS9100)", "Kundenkonzentration", "Technologieniveau"],
    typicalEBITMargin: { low: 8, median: 12, high: 18 },
  },
  {
    id: "cnc",
    name: "CNC-Zerspanung",
    category: "manufacturing",
    baseMultiple: { low: 3.5, median: 5.0, high: 7.0 },
    description: "CNC-Drehen, Fräsen, komplexe Teileproduktion",
    keyFactors: ["5-Achs-Fähigkeiten", "Automatisierungsgrad", "Branchenfokus"],
    typicalEBITMargin: { low: 7, median: 11, high: 16 },
  },
  {
    id: "toolmaking",
    name: "Werkzeugbau / Formenbau",
    category: "manufacturing",
    baseMultiple: { low: 4.0, median: 5.5, high: 8.0 },
    description: "Spritzgusswerkzeuge, Stanzwerkzeuge, Sonderwerkzeuge",
    keyFactors: ["IP-Eigentum", "Kundenbeziehungen", "Engineering-Fähigkeiten"],
    typicalEBITMargin: { low: 8, median: 13, high: 20 },
  },
  {
    id: "sheetmetal",
    name: "Blechbearbeitung",
    category: "manufacturing",
    baseMultiple: { low: 3.0, median: 4.5, high: 6.5 },
    description: "Laserschneiden, Biegen, Blechfertigung",
    keyFactors: ["Maschinenpark-Modernität", "Automatisierung", "Mehrwertdienste"],
    typicalEBITMargin: { low: 6, median: 10, high: 15 },
  },
  {
    id: "machinery",
    name: "Sondermaschinenbau",
    category: "manufacturing",
    baseMultiple: { low: 4.5, median: 6.0, high: 9.0 },
    description: "Sondermaschinen, Automatisierungssysteme, Produktionsanlagen",
    keyFactors: ["Engineering-Tiefe", "Serviceumsatz", "IP/Patente"],
    typicalEBITMargin: { low: 8, median: 12, high: 18 },
  },
  {
    id: "general_machinery",
    name: "Maschinenbau",
    category: "manufacturing",
    baseMultiple: { low: 4.0, median: 5.5, high: 8.0 },
    description: "Allgemeiner Maschinenbau, Serienmaschinen, Standardmaschinen",
    keyFactors: ["Produktportfolio", "Servicegeschäft", "Marktposition"],
    typicalEBITMargin: { low: 7, median: 11, high: 16 },
  },
  {
    id: "manufacturing_tech",
    name: "Fertigungstechnik",
    category: "manufacturing",
    baseMultiple: { low: 3.5, median: 5.0, high: 7.5 },
    description: "Fertigungsverfahren, Produktionstechnik, Fertigungsanlagen",
    keyFactors: ["Technologie-Know-how", "Automatisierungsgrad", "Kundenstamm"],
    typicalEBITMargin: { low: 6, median: 10, high: 15 },
  },
  {
    id: "assembly",
    name: "Montage / Lohnfertigung",
    category: "manufacturing",
    baseMultiple: { low: 2.5, median: 4.0, high: 5.5 },
    description: "Produktmontage, Baugruppenfertigung, Auftragsfertigung",
    keyFactors: ["Kundenkonzentration", "Vertragsbedingungen", "Qualitätszertifizierungen"],
    typicalEBITMargin: { low: 5, median: 8, high: 12 },
  },
  {
    id: "plastics",
    name: "Kunststoffverarbeitung",
    category: "manufacturing",
    baseMultiple: { low: 3.5, median: 5.0, high: 7.0 },
    description: "Spritzguss, Extrusion, Thermoformen",
    keyFactors: ["Eigener Werkzeugbau", "Technische Kunststoffe", "Nachhaltigkeitsinitiativen"],
    typicalEBITMargin: { low: 7, median: 11, high: 16 },
  },
  {
    id: "electronics",
    name: "Elektronikfertigung / EMS",
    category: "manufacturing",
    baseMultiple: { low: 4.0, median: 5.5, high: 8.0 },
    description: "Leiterplattenbestückung, elektronische Systeme, EMS-Dienstleistungen",
    keyFactors: ["Entwicklungsdienstleistungen", "Testfähigkeiten", "Branchenfokus (Automotive, Medizin)"],
    typicalEBITMargin: { low: 6, median: 10, high: 15 },
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
    id: "ebit_stability",
    name: "EBIT-Marge Stabilität",
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
  ebit: number;
  sectorId: string;
  adjustments: Record<string, number>;
}

export interface ValuationResult {
  baseMultiple: number;
  adjustedMultiple: number;
  enterpriseValue: {
    low: number;
    mid: number;
    high: number;
  };
  ebitMargin: number;
  adjustmentDetails: {
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

  const ebitMargin = (input.ebit / input.revenue) * 100;

  // Start mit Basismultiple
  let baseMultiple = sector.baseMultiple.median;

  // Auswirkungen der Anpassungsfaktoren berechnen
  // KEINE automatische Margenanpassung - die EBIT-Marge fließt bereits ins bereinigte EBIT ein
  const adjustmentDetails: { factorName: string; impact: number }[] = [];
  let totalAdjustment = 0;

  Object.entries(input.adjustments).forEach(([factorId, selectedValue]) => {
    const factor = adjustmentFactors.find((f) => f.id === factorId);
    if (factor) {
      const impact = selectedValue;
      totalAdjustment += impact;
      adjustmentDetails.push({
        factorName: factor.name,
        impact: impact,
      });
    }
  });

  // Angepasstes Multiple berechnen, aber innerhalb der Branchengrenzen halten
  let adjustedMultiple = baseMultiple * (1 + totalAdjustment);
  
  // Multiple darf Branchengrenzen nicht über-/unterschreiten
  adjustedMultiple = Math.max(sector.baseMultiple.low, adjustedMultiple);
  adjustedMultiple = Math.min(sector.baseMultiple.high, adjustedMultiple);

  // Spanne berechnen (±15% vom angepassten Wert, aber auch innerhalb der Grenzen)
  const enterpriseValue = {
    low: input.ebit * Math.max(sector.baseMultiple.low, adjustedMultiple * 0.85),
    mid: input.ebit * adjustedMultiple,
    high: input.ebit * Math.min(sector.baseMultiple.high, adjustedMultiple * 1.15),
  };

  // Unternehmensposition vs. Sektor bestimmen
  let companyPosition = "Durchschnittlich";
  if (adjustedMultiple > sector.baseMultiple.median * 1.15) {
    companyPosition = "Überdurchschnittlich";
  } else if (adjustedMultiple > sector.baseMultiple.high * 0.9) {
    companyPosition = "Premium";
  } else if (adjustedMultiple < sector.baseMultiple.median * 0.85) {
    companyPosition = "Unterdurchschnittlich";
  } else if (adjustedMultiple < sector.baseMultiple.low * 1.1) {
    companyPosition = "Discount";
  }

  return {
    baseMultiple,
    adjustedMultiple,
    enterpriseValue,
    ebitMargin,
    adjustmentDetails,
    benchmarkComparison: {
      sectorMedian: sector.baseMultiple.median,
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
