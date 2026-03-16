"use client"

import React, { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { PremiumBackground } from "@/components/layout/premium-background"
import { Button } from "@/components/ui/button"
import {
    Save,
    Trash2,
    Printer,
    ChevronLeft,
    Users,
    FileText,
    ExternalLink,
    Mail,
    Globe,
    Phone,
    MapPin,
    Hash
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "thitronik_kundenstammblatt_2026"

export default function CustomerSheetPage() {
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
            try {
                setFormData(JSON.parse(raw))
            } catch (e) {
                console.error(e)
            }
        }
        setIsLoaded(true)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        setFormData(prev => ({ ...prev, [name]: val }))
    }

    const saveFormData = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
        alert("Die Eingaben wurden in diesem Browser gespeichert.")
    }

    const resetFormAll = () => {
        if (confirm("Möchten Sie wirklich alle Eingaben löschen?")) {
            setFormData({})
            localStorage.removeItem(STORAGE_KEY)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    if (!isLoaded) return null

    return (
        <PremiumBackground>
            <div className="container mx-auto py-8 px-4 print:p-0">
                {/* Toolbar */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
                    <div className="flex items-center gap-4">
                        <Link href="/tools">
                            <Button variant="ghost" className="text-white hover:text-brand-lime gap-2">
                                <ChevronLeft className="h-4 w-4" />
                                Zurück
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-lime ring-1 ring-white/20">
                            <div className="h-2 w-2 rounded-full bg-brand-lime animate-pulse" />
                            Digitalformular
                        </div>
                        <span className="text-sm text-white/60">Elektronisches Kundenstammblatt</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            onClick={saveFormData}
                            className="bg-white/10 text-white hover:bg-white/20 gap-2 rounded-full px-6 font-bold ring-1 ring-white/20"
                        >
                            <Save className="h-4 w-4" />
                            Speichern
                        </Button>
                        <Button
                            onClick={resetFormAll}
                            variant="destructive"
                            className="gap-2 rounded-full px-6 font-bold"
                        >
                            <Trash2 className="h-4 w-4" />
                            Reset
                        </Button>
                        <Button
                            onClick={handlePrint}
                            className="bg-brand-lime text-brand-navy hover:bg-brand-lime/90 gap-2 rounded-full px-6 font-bold"
                        >
                            <Printer className="h-4 w-4" />
                            Drucken / PDF
                        </Button>
                    </div>
                </div>

                {/* The Sheet */}
                <main className="mx-auto w-full max-w-[1080px] overflow-hidden rounded-2xl bg-[#fdfefe] shadow-2xl ring-1 ring-black/5 print:rounded-none print:shadow-none print:ring-0">
                    <div className="relative z-10 p-8 md:p-16 lg:p-20">
                        {/* Blue corner triangle trick */}
                        <div className="absolute top-0 left-0 z-0 h-0 w-0 border-t-[140px] border-r-[400px] border-t-[#0b3b6f] border-r-transparent print:border-t-[#0b3b6f]" />

                        <div className="relative z-10">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#0b3b6f] leading-none mb-6">
                                Kundenstammblatt
                            </h1>
                            <p className="text-xl md:text-2xl text-[#123d70] mb-12">
                                Bitte ausfüllen und per E-Mail an <span className="font-bold underline decoration-brand-lime underline-offset-4">kontakt@thitronik.de</span> senden.
                            </p>

                            <form className="space-y-6">
                                {/* Section 1: Basic Info */}
                                <section className="space-y-4">
                                    <FormRow label="Firmenbezeichnung gem. HR Eintrag:" name="firma" value={formData.firma} onChange={handleChange} icon={<Users className="h-4 w-4 text-[#0b3b6f]" />} />
                                    <FormRow label="Inhaber/Geschäftsführer:" name="inhaber" value={formData.inhaber} onChange={handleChange} />
                                    <FormRow label="Straße und Hausnummer:" name="strasse" value={formData.strasse} onChange={handleChange} icon={<MapPin className="h-4 w-4 text-[#0b3b6f]" />} />
                                    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8">
                                        <FormRow label="PLZ:" name="plz" value={formData.plz} onChange={handleChange} />
                                        <FormRow label="Ort:" name="ort" value={formData.ort} onChange={handleChange} />
                                    </div>
                                    <FormRow label="Land:" name="land" value={formData.land} onChange={handleChange} />
                                    <FormRow label="Werkstatt-/Lieferanschrift:" name="werkstatt" value={formData.werkstatt} onChange={handleChange} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                        <FormRow label="Telefon:" name="telefon" value={formData.telefon} onChange={handleChange} icon={<Phone className="h-4 w-4 text-[#0b3b6f]" />} />
                                        <FormRow label="E-Mail:" name="email" value={formData.email} onChange={handleChange} icon={<Mail className="h-4 w-4 text-[#0b3b6f]" />} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                        <FormRow label="Website:" name="website" value={formData.website} onChange={handleChange} icon={<Globe className="h-4 w-4 text-[#0b3b6f]" />} />
                                        <FormRow label="USt.-ID/Steuernummer:" name="ustid" value={formData.ustid} onChange={handleChange} icon={<Hash className="h-4 w-4 text-[#0b3b6f]" />} />
                                    </div>
                                </section>

                                {/* Section 2: Dealers */}
                                <section className="pt-8 grid grid-cols-1 md:grid-cols-[245px_1fr] gap-4">
                                    <label className="text-lg text-[#123d70] font-medium leading-tight">
                                        Über welchen Großhändler beziehen Sie Ihre Ware:
                                    </label>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <DealerColumn items={["Movera", "Frankana Freiko"]} formData={formData} onChange={handleChange} />
                                        <DealerColumn items={["Camping Profi", "Reimo"]} formData={formData} onChange={handleChange} />
                                        <DealerColumn items={["Fritz Berger", "ACR"]} formData={formData} onChange={handleChange} />
                                        <DealerColumn items={["andere"]} formData={formData} onChange={handleChange} />
                                    </div>
                                </section>

                                {/* Section 3: Consents */}
                                <section className="pt-12 space-y-6">
                                    <ConsentItem
                                        name="agb"
                                        checked={formData.agb}
                                        onChange={handleChange}
                                        label={
                                            <span>
                                                Hiermit bestätige ich, die AGB der Thitronik GmbH gelesen und akzeptiert zu haben.{" "}
                                                <a href="https://www.thitronik.de/agb" target="_blank" rel="noreferrer" className="text-[#174d87] underline hover:text-[#0b3b6f]">
                                                    www.thitronik.de/agb
                                                </a>
                                            </span>
                                        }
                                    />
                                    <ConsentItem
                                        name="newsletter"
                                        checked={formData.newsletter}
                                        onChange={handleChange}
                                        label="Ich möchte über technische Neuheiten und Schulungen von Thitronik informiert werden und melde mich hiermit für den Newsletter an. Dieser wird an die von mir oben angegebene E-Mailadresse verschickt."
                                    />
                                </section>

                                {/* Section 4: Signature 1 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                    <FormRow label="Ort und Datum:" name="ortdatum1" value={formData.ortdatum1} onChange={handleChange} isUnderlineOnly />
                                    <FormRow label="Unterschrift und Firmenstempel:" name="unterschrift1" value={formData.unterschrift1} onChange={handleChange} isUnderlineOnly />
                                </div>

                                {/* Section 5: Electronic Invoicing */}
                                <section className="pt-16">
                                    <h2 className="text-2xl font-bold text-[#0b3b6f] mb-4">
                                        Einverständniserklärung zum elektronischen Rechnungsversand
                                    </h2>
                                    <p className="text-lg text-[#123d70] mb-8 leading-relaxed max-w-4xl">
                                        Wir sind mit dem Erhalt von elektronischen Rechnungen einverstanden. Bitte übermitteln Sie die Rechnungen als E-Mail mit angefügter PDF Datei
                                    </p>

                                    <div className="space-y-6">
                                        <FormRow label="an folgende E-Mail Adresse:" name="rechnungs_email" value={formData.rechnungs_email} onChange={handleChange} icon={<Mail className="h-4 w-4 text-[#0b3b6f]" />} />
                                        <div className="flex flex-col gap-2">
                                            <label className="text-lg text-[#123d70]">Bemerkung:</label>
                                            <textarea
                                                name="bemerkung"
                                                value={formData.bemerkung || ""}
                                                onChange={handleChange}
                                                className="w-full min-h-[100px] border-b-2 border-dotted border-[#bfd0e6] bg-slate-50 focus:bg-[#eaf2fb] focus:border-[#174d87] transition-all outline-none p-4 text-black rounded-xl"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                            <FormRow label="Ort und Datum:" name="ortdatum2" value={formData.ortdatum2} onChange={handleChange} isUnderlineOnly />
                                            <FormRow label="Unterschrift und Firmenstempel:" name="unterschrift2" value={formData.unterschrift2} onChange={handleChange} isUnderlineOnly />
                                        </div>
                                    </div>
                                </section>
                            </form>
                        </div>
                    </div>
                </main>
            </div>

            <style jsx global>{`
                @media print {
                    .PremiumBackground {
                        background: white !important;
                    }
                    body {
                        background: white !important;
                    }
                }
            `}</style>
        </PremiumBackground>
    )
}

function FormRow({ label, name, value, onChange, icon, isUnderlineOnly = false }: any) {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-[245px_1fr] items-center gap-2 md:gap-4", !isUnderlineOnly && "mb-2")}>
            <label className="text-[17px] text-[#123d70] whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-2">
                {icon}
                {label}
            </label>
            <input
                type="text"
                name={name}
                value={value || ""}
                onChange={onChange}
                className={cn(
                    "w-full px-4 py-2 text-[17px] text-black outline-none transition-all border-b-2 border-dotted border-[#bfd0e6]",
                    !isUnderlineOnly ? "bg-slate-50 hover:bg-[#f3f7fc] focus:bg-[#eaf2fb] focus:border-[#174d87] rounded-lg" : "bg-transparent focus:border-[#174d87]"
                )}
            />
        </div>
    )
}

function DealerColumn({ items, formData, onChange }: any) {
    return (
        <div className="flex flex-col gap-3">
            {items.map((item: string) => (
                <label key={item} className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                        <input
                            type="checkbox"
                            name={`dealer_${item.toLowerCase().replace(/\s/g, "_")}`}
                            checked={!!formData[`dealer_${item.toLowerCase().replace(/\s/g, "_")}`]}
                            onChange={onChange}
                            className="peer h-5 w-5 appearance-none border-2 border-[#123d70]/40 rounded-sm bg-white checked:bg-[#0b3b6f] checked:border-[#0b3b6f] transition-all cursor-pointer"
                        />
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <span className="text-[17px] text-[#123d70] group-hover:text-[#0b3b6f] transition-colors leading-tight">
                        {item === "ACR" ? <>ACR Brändli und<br />Vögeli AG</> : item}
                    </span>
                </label>
            ))}
        </div>
    )
}

function ConsentItem({ name, checked, label, onChange }: any) {
    return (
        <label className="flex items-start gap-4 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-1">
                <input
                    type="checkbox"
                    name={name}
                    checked={!!checked}
                    onChange={onChange}
                    className="peer h-5 w-5 appearance-none border-2 border-[#123d70]/40 rounded-sm bg-white checked:bg-[#0b3b6f] checked:border-[#0b3b6f] transition-all cursor-pointer"
                />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
            <span className="text-[17px] text-[#123d70] leading-relaxed">
                {label}
            </span>
        </label>
    )
}
