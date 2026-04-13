"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, User, Building2, Phone, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { ValuationResult } from "@/lib/valuation-data";
import { NormalizationResult } from "@/components/ebit-normalization";

interface ContactFormProps {
  valuationResult: ValuationResult;
  normalizationResult: NormalizationResult;
  selectedSector: string;
  onSuccess: () => void;
}

interface ContactData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  privacyAccepted: boolean;
}

// Email-Validierung - strenger mit Mindestlänge der Domain-Endung
function isValidEmail(email: string): boolean {
  // Prüft auf: text@domain.tld (tld mindestens 2 Zeichen)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  // Zusätzliche Prüfung: Domain muss existieren (mindestens Punkt und 2+ Zeichen danach)
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1];
  if (!domain.includes(".")) return false;
  const tld = domain.split(".").pop();
  if (!tld || tld.length < 2) return false;
  return true;
}

// Formatierung für Währung
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function ContactForm({ 
  valuationResult, 
  normalizationResult, 
  selectedSector,
  onSuccess 
}: ContactFormProps) {
  const [contactData, setContactData] = useState<ContactData>({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    privacyAccepted: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    if (!contactData.firstName.trim()) {
      setError("Bitte geben Sie Ihren Vornamen ein");
      return false;
    }
    if (!contactData.lastName.trim()) {
      setError("Bitte geben Sie Ihren Nachnamen ein");
      return false;
    }
    if (!contactData.companyName.trim()) {
      setError("Bitte geben Sie Ihren Unternehmensnamen ein");
      return false;
    }
    if (!contactData.email.trim()) {
      setError("Bitte geben Sie Ihre E-Mail-Adresse ein");
      return false;
    }
    if (!isValidEmail(contactData.email)) {
      setEmailError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      return false;
    }
    if (!contactData.phone.trim()) {
      setError("Bitte geben Sie Ihre Telefonnummer ein");
      return false;
    }
    if (!contactData.privacyAccepted) {
      setError("Bitte akzeptieren Sie die Datenschutzerklärung");
      return false;
    }
    return true;
  };

  const handleEmailBlur = () => {
    if (contactData.email && !isValidEmail(contactData.email)) {
      setEmailError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
    } else {
      setEmailError(null);
    }
  };

  // Ermittle ob Kapitalgesellschaft
  const isCapitalCompany = ["gmbh", "ug", "ltd", "ag", "gmbh_co_kg"].includes(normalizationResult.legalForm);
  
  // Label für Unternehmerlohn/GF-Gehalt
  const salaryLabel = isCapitalCompany ? "Angemessenes GF-Gehalt" : "Angemessener Unternehmerlohn";

  const generateValuationSummary = (): string => {
    return `
UNTERNEHMENSBEWERTUNG - ERGEBNIS
================================

KONTAKTDATEN:
- Name: ${contactData.firstName} ${contactData.lastName}
- Unternehmen: ${contactData.companyName}
- E-Mail: ${contactData.email}
- Telefon: ${contactData.phone}

BEWERTUNGSGRUNDLAGE:
- Branche: ${selectedSector}
- Rechtsform: ${normalizationResult.legalFormLabel}
- Durchschnittlicher Umsatz (3 Jahre): ${formatCurrency(normalizationResult.averageRevenue)}
- ${salaryLabel} (Durchschnitt): ${formatCurrency(normalizationResult.averageMarketSalary)}
- Bereinigtes EBIT (Durchschnitt): ${formatCurrency(normalizationResult.averageNormalizedEbit)}
- Bereinigte EBIT-Marge: ${formatNumber(valuationResult.ebitMargin)}%

EBIT-BEREINIGUNG PRO JAHR:
${normalizationResult.years.map(y => `- ${y.year}: Umsatz ${formatCurrency(y.revenue)}, ${salaryLabel} ${formatCurrency(y.marketSalary)}, Bereinigtes EBIT ${formatCurrency(y.normalizedEbit)}`).join('\n')}

BEWERTUNGSERGEBNIS:
- Basismultiple: ${formatNumber(valuationResult.baseMultiple)}x
- Angepasstes Multiple: ${formatNumber(valuationResult.adjustedMultiple)}x
- Multiple-Veränderung: ${formatNumber(((valuationResult.adjustedMultiple - valuationResult.baseMultiple) / valuationResult.baseMultiple) * 100)}%

UNTERNEHMENSWERT (Enterprise Value):
- Untergrenze: ${formatCurrency(valuationResult.enterpriseValue.low)}
- Mittelwert: ${formatCurrency(valuationResult.enterpriseValue.mid)}
- Obergrenze: ${formatCurrency(valuationResult.enterpriseValue.high)}

ANPASSUNGSFAKTOREN:
${valuationResult.adjustmentDetails.map(a => `- ${a.factorName}: ${a.impact >= 0 ? '+' : ''}${formatNumber(a.impact * 100)}%`).join('\n')}

================================
Diese Bewertung dient nur zu Informationszwecken und stellt keine Finanz- oder Rechtsberatung dar.
Für eine verbindliche Bewertung ziehen Sie bitte professionelle Berater hinzu.

Ratjen & Kollegen
www.ratjenkollegen.de
    `.trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const valuationSummary = generateValuationSummary();

      console.log("[v0] Sende E-Mail an Web3Forms...");
      
      // Sende an Web3Forms (an Ratjen & Kollegen)
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "029db604-e3ec-48c6-bdaa-e707cd1e42bd",
          subject: `Neue Unternehmensbewertung - ${contactData.companyName}`,
          from_name: `${contactData.firstName} ${contactData.lastName}`,
          replyto: contactData.email,
          message: valuationSummary,
          // Zusätzliche Felder für bessere Übersicht
          vorname: contactData.firstName,
          nachname: contactData.lastName,
          unternehmen: contactData.companyName,
          email_kunde: contactData.email,
          telefon: contactData.phone,
          branche: selectedSector,
          rechtsform: normalizationResult.legalFormLabel,
          unternehmenswert_min: formatCurrency(valuationResult.enterpriseValue.low),
          unternehmenswert_mitte: formatCurrency(valuationResult.enterpriseValue.mid),
          unternehmenswert_max: formatCurrency(valuationResult.enterpriseValue.high),
          bereinigtes_ebit: formatCurrency(normalizationResult.averageNormalizedEbit),
          unternehmerlohn_gf_gehalt: formatCurrency(normalizationResult.averageMarketSalary),
          multiple: formatNumber(valuationResult.adjustedMultiple),
        }),
      });
      
      // Zweite E-Mail an den Kunden senden (Autoresponse)
      // Hinweis: Web3Forms erlaubt im kostenlosen Plan kein CC, daher senden wir eine separate Bestätigung
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "029db604-e3ec-48c6-bdaa-e707cd1e42bd",
          subject: `Ihre Unternehmensbewertung - ${contactData.companyName}`,
          from_name: "Ratjen & Kollegen Management GmbH - Bewertungstool",
          replyto: "info@ratjenkollegen.de",
          email: contactData.email,
          message: `
Sehr geehrte(r) ${contactData.firstName} ${contactData.lastName},

vielen Dank für die Nutzung unseres Bewertungstools.

Anbei finden Sie Ihre Bewertungsergebnisse:

${valuationSummary}

Bei Fragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Ratjen & Kollegen Management GmbH
info@ratjenkollegen.de
www.ratjenkollegen.de

---
Diese E-Mail wurde automatisch generiert.
`,
        }),
      });

      const data = await response.json();
      console.log("[v0] Web3Forms Antwort:", JSON.stringify(data, null, 2));
      console.log("[v0] Response Status:", response.status);

      if (data.success) {
        console.log("[v0] SUCCESS - E-Mail sollte gesendet worden sein");
        setIsSubmitted(true);
        // onSuccess wird nicht mehr aufgerufen - Ergebnis nur per E-Mail
      } else {
        console.log("[v0] FEHLER - Web3Forms hat Fehler zurückgegeben:", data);
        setError("Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
      }
    } catch (err) {
      console.log("[v0] CATCH FEHLER:", err);
      setError("Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Erfolgsanzeige nach dem Absenden - NUR Bestätigung, keine berechnungsrelevanten Zahlen
  if (isSubmitted) {
    return (
      <Card className="border-green-500/50 bg-green-50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-green-700 text-2xl">
            Vielen Dank für Ihre Anfrage!
          </CardTitle>
          <CardDescription className="text-green-600 mt-2 text-base">
            Wir haben Ihre Bewertungsanfrage erfolgreich erhalten.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="p-6 bg-white rounded-lg border border-green-200">
            <p className="text-foreground font-medium mb-3 text-lg">
              Ihre detaillierte Unternehmensbewertung wird in Kürze an folgende E-Mail-Adresse gesendet:
            </p>
            <p className="text-accent font-bold text-xl">
              {contactData.email}
            </p>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-amber-800 text-sm">
              Bitte prüfen Sie auch Ihren Spam-Ordner, falls Sie die E-Mail nicht innerhalb weniger Minuten erhalten.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <p className="text-muted-foreground">
              Bei Fragen stehen wir Ihnen gerne zur Verfügung:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:info@ratjenkollegen.de" 
                className="text-accent hover:underline font-medium"
              >
                info@ratjenkollegen.de
              </a>
              <span className="hidden sm:inline text-muted-foreground">|</span>
              <a 
                href="https://www.ratjenkollegen.de" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-medium"
              >
                www.ratjenkollegen.de
              </a>
            </div>
          </div>

          <div className="pt-6">
            <Button asChild className="gap-2">
              <a 
                href="https://www.ratjenkollegen.de" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Mehr über Ratjen & Kollegen Management GmbH erfahren
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-accent/20">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Mail className="h-5 w-5 text-accent" />
          Ihre Bewertung ist fertig!
        </CardTitle>
        <CardDescription>
          Geben Sie Ihre Kontaktdaten ein, um das detaillierte Bewertungsergebnis zu erhalten.
          Die Auswertung wird Ihnen per E-Mail zugesendet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Vorname <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Max"
                  className="pl-10"
                  value={contactData.firstName}
                  onChange={(e) => setContactData({ ...contactData, firstName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Nachname <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Mustermann"
                  className="pl-10"
                  value={contactData.lastName}
                  onChange={(e) => setContactData({ ...contactData, lastName: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">
              Unternehmensname <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="companyName"
                type="text"
                placeholder="Mustermann GmbH"
                className="pl-10"
                value={contactData.companyName}
                onChange={(e) => setContactData({ ...contactData, companyName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              E-Mail-Adresse <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="max@mustermann.de"
                className={`pl-10 ${emailError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                value={contactData.email}
                onChange={(e) => {
                  const newEmail = e.target.value;
                  setContactData({ ...contactData, email: newEmail });
                  // Echtzeit-Validierung
                  if (newEmail && !isValidEmail(newEmail)) {
                    setEmailError("Bitte geben Sie eine gültige E-Mail-Adresse ein (z.B. name@firma.de)");
                  } else {
                    setEmailError(null);
                  }
                }}
                onBlur={handleEmailBlur}
              />
            </div>
            {emailError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {emailError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Telefonnummer <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+49 123 456789"
                className="pl-10"
                value={contactData.phone}
                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-4">
            <Checkbox
              id="privacy"
              checked={contactData.privacyAccepted}
              onCheckedChange={(checked) =>
                setContactData({ ...contactData, privacyAccepted: checked === true })
              }
            />
            <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
              Ich habe die{" "}
              <a
                href="https://www.ratjenkollegen.de/datenschutz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:no-underline"
              >
                Datenschutzerklärung
              </a>{" "}
              gelesen und erkläre mich mit der Verarbeitung meiner Daten einverstanden.{" "}
              <span className="text-red-500">*</span>
            </Label>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting || !!emailError || (contactData.email.length > 0 && !isValidEmail(contactData.email))}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Wird gesendet...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Bewertung anfordern
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Nach dem Absenden erhalten Sie Ihre persönliche Bewertungsauswertung per E-Mail.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
