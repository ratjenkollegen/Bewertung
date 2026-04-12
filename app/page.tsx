import { ValuationCalculator } from "@/components/valuation-calculator";
import { BenchmarkTable } from "@/components/benchmark-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  BarChart3,
  Building2,
  Factory,
  ChevronRight,
  Shield,
  Target,
  TrendingUp,
  BookOpen,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Calculator className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">EBIT-Bewertung</h1>
              <p className="text-xs text-muted-foreground">KMU-Unternehmensbewertungsmodell</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Rechner
            </a>
            <a href="#benchmarks" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Benchmarks
            </a>
            <a href="#methodology" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Methodik
            </a>
          </nav>
          <Badge variant="secondary" className="hidden sm:flex">
            v1.0
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Professionelles Bewertungstool der Ratjen & Kollegen Management GmbH
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Unternehmensbewertung für Handwerk & Industrie
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed text-pretty max-w-2xl mx-auto">
              Berechnen Sie den Unternehmenswert mit branchenspezifischen EBIT-Multiples.
              Entwickelt für Handwerksbetriebe, Maschinenbau und produzierende KMU.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <a href="#calculator">
                  <Calculator className="h-4 w-4" />
                  Bewertung starten
                </a>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href="#benchmarks">
                  <BarChart3 className="h-4 w-4" />
                  Benchmarks ansehen
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Building2 className="h-6 w-6" />}
              title="Handwerk"
              description="8 spezialisierte Sektoren inkl. Elektro, SHK, Tischlerei und Metallbau"
            />
            <FeatureCard
              icon={<Factory className="h-6 w-6" />}
              title="Industrie"
              description="8 Fertigungssegmente von CNC-Zerspanung bis Sondermaschinenbau"
            />
            <FeatureCard
              icon={<Target className="h-6 w-6" />}
              title="9 Anpassungsfaktoren"
              description="Feinabstimmung der Multiples nach Wachstum, Risiko, Betrieb und Strategie"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="DACH-Fokus"
              description="Benchmarks kalibriert für KMU-Transaktionen im deutschsprachigen Raum"
            />
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4">Interaktives Tool</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                EBIT-Multiple Bewertungsrechner
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
                Geben Sie Ihre Finanzdaten ein, wählen Sie Ihre Branche und passen Sie
                unternehmensspezifische Faktoren an, um eine indikative Unternehmenswert-Spanne zu erhalten.
              </p>
            </div>
            <ValuationCalculator />
          </div>
        </div>
      </section>

      {/* Benchmarks Section */}
      <section id="benchmarks" className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4">Referenzdaten</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Branchen-Benchmark-Multiples
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
                Erkunden Sie EBIT-Multiple-Spannen über 16 Branchen. Die Daten spiegeln typische
                KMU-Transaktionsmultiples im deutschsprachigen Raum wider.
              </p>
            </div>
            <BenchmarkTable />
          </div>
        </div>
      </section>

      {/* Methodology Overview */}
      <section id="methodology" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Die Methode verstehen</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                So funktioniert die EBIT-Multiple-Bewertung
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <MethodStep
                number="01"
                title="EBIT normalisieren"
                description="Betriebsergebnis um Inhabergehalt, Einmaleffekte und nahestehende Geschäfte bereinigen, um die wahre Ertragskraft zu ermitteln."
              />
              <MethodStep
                number="02"
                title="Multiple wählen"
                description="Passenden Branchen-Benchmark auswählen und nach unternehmensspezifischen Risiko- und Wertfaktoren anpassen."
              />
              <MethodStep
                number="03"
                title="Wert berechnen"
                description="Normalisiertes EBIT mit angepasstem Multiple multiplizieren für den Enterprise Value. Nettoverschuldung abziehen für Eigenkapitalwert."
              />
            </div>

            <div className="mt-12 p-6 rounded-xl bg-secondary/50 border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                Zentrale Werttreiber in Handwerk & Industrie
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Wertsteigernde Faktoren</h4>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                      Wiederkehrende Service-/Wartungsverträge
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                      Professionelles Management-Team
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                      Moderne Ausstattung & Digitalisierung
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                      Diversifizierter Kundenstamm
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                      Qualifizierte Belegschaft mit geringer Fluktuation
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Wertmindernde Faktoren</h4>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-red-500 rotate-180" />
                      Hohe Inhaberabhängigkeit
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-red-500 rotate-180" />
                      Kundenkonzentrationsrisiko
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-red-500 rotate-180" />
                      Veraltete Maschinen mit Investitionsbedarf
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-red-500 rotate-180" />
                      Rückläufige Umsätze oder Margen
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-red-500 rotate-180" />
                      Nachfolgeprobleme
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex-shrink-0">
              <img 
                src="https://www.ratjenkollegen.de/media/images/chatgpt_image.png" 
                alt="Ratjen & Kollegen Management GmbH Logo" 
                className="h-24 w-auto"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-balance">
                Bereit, Ihr Unternehmen zu bewerten?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl text-pretty">
                Nutzen Sie unseren umfassenden Rechner für eine indikative Bewertung basierend auf
                Branchen-Benchmarks und unternehmensspezifischen Faktoren.
              </p>
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <a href="#calculator">
                  Kostenlose Bewertung starten
                  <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                  <Calculator className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-medium">EBIT-Bewertungsmodell</span>
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Nur zu Informationszwecken. Keine Finanz- oder Rechtsberatung. Ziehen Sie für echte
                Transaktionen professionelle Berater hinzu.
              </p>
              <div className="text-sm text-muted-foreground">
                Copyright {new Date().getFullYear()} Ratjen & Kollegen Management GmbH
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4 border-t">
              <a 
                href="https://www.ratjenkollegen.de/datenschutz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Datenschutz
              </a>
              <span className="hidden md:inline text-muted-foreground">|</span>
              <a 
                href="https://www.ratjenkollegen.de/impressum" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Impressum
              </a>
              <span className="hidden md:inline text-muted-foreground">|</span>
              <a 
                href="https://www.ratjenkollegen.de" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                www.ratjenkollegen.de
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-card border hover:shadow-md transition-shadow">
      <div className="h-12 w-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function MethodStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="text-5xl font-bold text-accent/20 mb-2">{number}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
