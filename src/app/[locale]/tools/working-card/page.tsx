"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
    AlertCircle,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Circle,
    ClipboardList,
    Download,
    Package,
    Pen,
    Phone,
    Plus,
    Printer,
    RotateCcw,
    Save,
    Search,
    Settings,
    ShoppingCart,
    Trash2,
    Upload,
    User,
    Wrench,
    X,
    Car,
    Hash,
    FileText,
} from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"

export interface FormData {
    orderType: {
        einbau: boolean
        nachruestung: boolean
        service: boolean
    }
    kunde: {
        firma: string
        name: string
        telefon: string
        kennzeichen: string
        fahrzeugtyp: string
        fahrgestellnummer: string
    }
    monteur: {
        name: string
        funktionenGeprueft: boolean
        seriennummern: string
    }
    hinweis: string
    obd: {
        eingang: string
        ausgang: string
        uhrzeit: string
    }
    tachoFehler: {
        ja: boolean
        nein: boolean
        code: string
    }
    ledEinbauort: string
    schadensmeldung: string
    vorschadenFotos: {
        fahrerseite?: string
        beifahrerseite?: string
        front?: string
        heck?: string
    }
    checklistGrundfunktionen: {
        zentralverriegelung: boolean
        sirene: boolean
        panikAlarm: boolean
        neigungssensor: boolean
    }
    checklistProFinder: {
        gpsOrtung: boolean
        geoFence: boolean
        bewegungsAlarm: boolean
        batterieueberwachung: boolean
    }
    checklistRueckfahrkamera: {
        bildqualitaet: boolean
        hilfslinien: boolean
        nachtsicht: boolean
    }
    unterschriftMonteur: string
    unterschriftKunde: string
    uebergabe: {
        grundfunktionBedienung: boolean
        batteriewechsel: boolean
        proFinderProgrammiert: boolean
        proFinderAlarme: boolean
        uhrBordcomputer: boolean
        einweisungErhalten: boolean
        panikAlarm: boolean
        offenemAlarmCheck: boolean
        proFinderBedienung: boolean
        radioeinstellung: boolean
        funktionKlappschluessel: boolean
        abschalteinrichtungMotorkontrollleuchte: boolean
        rueckfahrkamera: boolean
        sonstigerVermerk: string
        ort: string
        datum: string
        unterschriftKunde: string
    }
}

export interface MaterialItem {
    id: string
    gruppe: string
    artikel: string
    artNr: string
    menge: number
    verbaut: boolean
    notiz: string
}

const STORAGE_KEY = "thitronik-arbeitskarte-data-demo"

const todayIso = () => format(new Date(), "yyyy-MM-dd")

const initialFormData: FormData = {
    orderType: { einbau: false, nachruestung: false, service: false },
    kunde: { firma: "", name: "", telefon: "", kennzeichen: "", fahrzeugtyp: "", fahrgestellnummer: "" },
    monteur: { name: "", funktionenGeprueft: false, seriennummern: "" },
    hinweis: "",
    obd: { eingang: "", ausgang: "", uhrzeit: "" },
    tachoFehler: { ja: false, nein: false, code: "" },
    ledEinbauort: "",
    schadensmeldung: "",
    vorschadenFotos: { fahrerseite: undefined, beifahrerseite: undefined, front: undefined, heck: undefined },
    checklistGrundfunktionen: { zentralverriegelung: false, sirene: false, panikAlarm: false, neigungssensor: false },
    checklistProFinder: { gpsOrtung: false, geoFence: false, bewegungsAlarm: false, batterieueberwachung: false },
    checklistRueckfahrkamera: { bildqualitaet: false, hilfslinien: false, nachtsicht: false },
    unterschriftMonteur: "",
    unterschriftKunde: "",
    uebergabe: {
        grundfunktionBedienung: false,
        batteriewechsel: false,
        proFinderProgrammiert: false,
        proFinderAlarme: false,
        uhrBordcomputer: false,
        einweisungErhalten: false,
        panikAlarm: false,
        offenemAlarmCheck: false,
        proFinderBedienung: false,
        radioeinstellung: false,
        funktionKlappschluessel: false,
        abschalteinrichtungMotorkontrollleuchte: false,
        rueckfahrkamera: false,
        sonstigerVermerk: "",
        ort: "",
        datum: todayIso(),
        unterschriftKunde: "",
    },
}

const initialMaterials: MaterialItem[] = [
    { id: "1", gruppe: "Alarmsystem", artikel: "WiPro III", artNr: "", menge: 1, verbaut: false, notiz: "" },
    { id: "2", gruppe: "Alarmsystem", artikel: "WiPro III safe.lock", artNr: "", menge: 1, verbaut: false, notiz: "" },
    { id: "3", gruppe: "Zubehör", artikel: "Funk-Handsender 868", artNr: "101064", menge: 1, verbaut: false, notiz: "" },
    { id: "4", gruppe: "Zubehör", artikel: "Umrüstplatine", artNr: "101052", menge: 1, verbaut: false, notiz: "" },
    { id: "5", gruppe: "Zubehör", artikel: "Transponder", artNr: "105355", menge: 1, verbaut: false, notiz: "" },
    { id: "6", gruppe: "Zubehör", artikel: "Zweitschlüssel", artNr: "101205", menge: 1, verbaut: false, notiz: "" },
    { id: "7", gruppe: "Zubehör", artikel: "Funk-Magnetkontakt 868, weiß", artNr: "100758", menge: 1, verbaut: false, notiz: "" },
    { id: "8", gruppe: "Zubehör", artikel: "Funk-Magnetkontakt 868, schwarz", artNr: "100757", menge: 1, verbaut: false, notiz: "" },
    { id: "9", gruppe: "Zubehör", artikel: "Montageadapter, weiß", artNr: "100729", menge: 1, verbaut: false, notiz: "" },
    { id: "10", gruppe: "Zubehör", artikel: "Montageadapter, schwarz", artNr: "100428", menge: 1, verbaut: false, notiz: "" },
    { id: "11", gruppe: "Zubehör", artikel: "Funk-Kabelschleife 868, weiß", artNr: "100761", menge: 1, verbaut: false, notiz: "" },
    { id: "12", gruppe: "Zubehör", artikel: "Funk-Kabelschleife 868, schwarz", artNr: "101068", menge: 1, verbaut: false, notiz: "" },
    { id: "13", gruppe: "Zubehör", artikel: "Funk-Kabelschleife XL, weiß", artNr: "100944", menge: 1, verbaut: false, notiz: "" },
    { id: "14", gruppe: "Zubehör", artikel: "Funk-Kabelschleife XL, schwarz", artNr: "101074", menge: 1, verbaut: false, notiz: "" },
    { id: "15", gruppe: "Zubehör", artikel: "Zusatzsirene", artNr: "100190", menge: 1, verbaut: false, notiz: "" },
    { id: "16", gruppe: "Zubehör", artikel: "Back-up Sirene", artNr: "100089", menge: 1, verbaut: false, notiz: "" },
    { id: "17", gruppe: "Zubehör", artikel: "Netzteil GBA-I 230 V", artNr: "100083", menge: 1, verbaut: false, notiz: "" },
    { id: "18", gruppe: "Zubehör", artikel: "Universalanschlusskabel 12/24 V", artNr: "100097", menge: 1, verbaut: false, notiz: "" },
    { id: "19", gruppe: "Zubehör", artikel: "BT-connect / Vernetzungsmodul", artNr: "101290", menge: 1, verbaut: false, notiz: "" },
    { id: "20", gruppe: "Zubehör", artikel: "NFC-Modul", artNr: "105299", menge: 1, verbaut: false, notiz: "" },
    { id: "21", gruppe: "Zubehör", artikel: "THITRONIK KeyCard", artNr: "105300", menge: 1, verbaut: false, notiz: "" },
    { id: "22", gruppe: "Zubehör", artikel: "THITRONIK KeyTag", artNr: "105301", menge: 1, verbaut: false, notiz: "" },
    { id: "23", gruppe: "Zubehör", artikel: "THITRONIK KeyStrap M schwarz", artNr: "105302", menge: 1, verbaut: false, notiz: "" },
    { id: "24", gruppe: "Zubehör", artikel: "THITRONIK KeyStrap M weiß", artNr: "105464", menge: 1, verbaut: false, notiz: "" },
    { id: "25", gruppe: "Zubehör", artikel: "THITRONIK KeyStrap M blau", artNr: "105466", menge: 1, verbaut: false, notiz: "" },
    { id: "26", gruppe: "Zubehör", artikel: "THITRONIK KeyStrap M rot", artNr: "105465", menge: 1, verbaut: false, notiz: "" },
    { id: "27", gruppe: "Zubehör", artikel: "THITRONIK KeyStrap L schwarz", artNr: "105467", menge: 1, verbaut: false, notiz: "" },
    { id: "28", gruppe: "Zubehör", artikel: "THITRONIK KeyStrap L weiß", artNr: "105468", menge: 1, verbaut: false, notiz: "" },
    { id: "29", gruppe: "Zubehör", artikel: "THITRONIK KeyStrap L blau", artNr: "105470", menge: 1, verbaut: false, notiz: "" },
    { id: "30", gruppe: "Zubehör", artikel: "THITRONIK KeyStrap L rot", artNr: "105469", menge: 1, verbaut: false, notiz: "" },
    { id: "31", gruppe: "Gaswarnsystem", artikel: "G.A.S.-pro III", artNr: "101286", menge: 1, verbaut: false, notiz: "" },
    { id: "32", gruppe: "Gaswarnsystem", artikel: "G.A.S.-pro III CO", artNr: "101287", menge: 1, verbaut: false, notiz: "" },
    { id: "33", gruppe: "Gaswarnsystem", artikel: "G.A.S.-pro", artNr: "100001", menge: 1, verbaut: false, notiz: "" },
    { id: "34", gruppe: "Gaswarnsystem", artikel: "GBA-I", artNr: "100061", menge: 1, verbaut: false, notiz: "" },
    { id: "35", gruppe: "Gaswarnsystem", artikel: "G.A.S.", artNr: "105700", menge: 1, verbaut: false, notiz: "" },
    { id: "36", gruppe: "Gaswarnsystem", artikel: "G.A.S.-plug 'all-in-one'", artNr: "100042", menge: 1, verbaut: false, notiz: "" },
    { id: "37", gruppe: "Gaswarnsystem", artikel: "G.A.S.-connect", artNr: "105750", menge: 1, verbaut: false, notiz: "" },
    { id: "38", gruppe: "Gaswarnsystem", artikel: "CO-Sensor (G.A.S.-pro & G.A.S.-pro III)", artNr: "100433", menge: 1, verbaut: false, notiz: "" },
    { id: "39", gruppe: "Gaswarnsystem", artikel: "Zusatzsensor (G.A.S.-pro & G.A.S.-pro III)", artNr: "101289", menge: 1, verbaut: false, notiz: "" },
    { id: "40", gruppe: "Rauchmelder", artikel: "T.S.A. Funk-Rauchmelder, weiß", artNr: "105753", menge: 1, verbaut: false, notiz: "" },
    { id: "41", gruppe: "Rauchmelder", artikel: "T.S.A. Funk-Rauchmelder, grau", artNr: "105754", menge: 1, verbaut: false, notiz: "" },
    { id: "42", gruppe: "Rauchmelder", artikel: "Montagewinkel T.S.A., weiß", artNr: "105755", menge: 1, verbaut: false, notiz: "" },
    { id: "43", gruppe: "Rauchmelder", artikel: "Montagewinkel T.S.A., grau", artNr: "105756", menge: 1, verbaut: false, notiz: "" },
    { id: "44", gruppe: "Fahrzeugortung", artikel: "Pro-finder", artNr: "100699", menge: 1, verbaut: false, notiz: "" },
    { id: "45", gruppe: "Fahrzeugortung Zubehör", artikel: "Abschalteinrichtung einpolig", artNr: "101283", menge: 1, verbaut: false, notiz: "" },
    { id: "46", gruppe: "Fahrzeugortung Zubehör", artikel: "Abschalteinrichtung mehrpolig", artNr: "105821", menge: 1, verbaut: false, notiz: "" },
    { id: "47", gruppe: "Fahrzeugortung Zubehör", artikel: "Externe GSM-Antenne", artNr: "100700", menge: 1, verbaut: false, notiz: "" },
    { id: "48", gruppe: "Fahrzeugortung Zubehör", artikel: "GPS-pro", artNr: "100686", menge: 1, verbaut: false, notiz: "" },
]

const groupColors: Record<string, { bg: string; text: string; ring: string }> = {
    Alarmsystem: { bg: "bg-[#1D3661]/5", text: "text-[#1D3661]", ring: "ring-[#1D3661]/10" },
    Zubehör: { bg: "bg-[#3BA9D3]/5", text: "text-[#3BA9D3]", ring: "ring-[#3BA9D3]/10" },
    Gaswarnsystem: { bg: "bg-[#AFCA05]/10", text: "text-[#7A8F04]", ring: "ring-[#AFCA05]/20" },
    Rauchmelder: { bg: "bg-orange-50", text: "text-orange-600", ring: "ring-orange-100" },
    Fahrzeugortung: { bg: "bg-purple-50", text: "text-purple-600", ring: "ring-purple-100" },
    "Fahrzeugortung Zubehör": { bg: "bg-purple-50/60", text: "text-purple-500", ring: "ring-purple-100" },
    Sonstiges: { bg: "bg-slate-50", text: "text-slate-600", ring: "ring-slate-200" },
}

function cn(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ")
}

function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(String(e.target?.result || ""))
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <section className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-5 md:p-6 space-y-4">
            <div className="space-y-1">
                <h2 className="text-lg md:text-xl font-bold text-black">{title}</h2>
                {subtitle ? <p className="text-sm text-black">{subtitle}</p> : null}
            </div>
            {children}
        </section>
    )
}

function FieldLabel({ children, required = false, icon: Icon }: { children: React.ReactNode; required?: boolean; icon?: React.ComponentType<any> }) {
    return (
        <label className="block space-y-2">
            <span className="flex items-center gap-2 text-sm font-bold text-black">
                {Icon ? <Icon className="h-4 w-4 text-slate-600" /> : null}
                {children}
                {required ? <span className="text-red-500">*</span> : null}
            </span>
        </label>
    )
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cn(
                "w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none transition text-black",
                "focus:border-[#3BA9D3] focus:ring-4 focus:ring-[#3BA9D3]/10",
                "placeholder:text-slate-500",
                props.className,
            )}
        />
    )
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={cn(
                "w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none transition resize-y min-h-[120px] text-black",
                "focus:border-[#3BA9D3] focus:ring-4 focus:ring-[#3BA9D3]/10",
                "placeholder:text-slate-500",
                props.className,
            )}
        />
    )
}

function CheckTile({ checked, onChange, label, description }: { checked: boolean; onChange: (checked: boolean) => void; label: string; description?: string }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={cn(
                "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition",
                checked ? "border-[#AFCA05] bg-[#AFCA05]/10 ring-2 ring-[#AFCA05]/20" : "border-slate-200 bg-white hover:border-slate-300",
            )}
        >
            <div className={cn("mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border", checked ? "border-[#AFCA05] bg-[#AFCA05] text-[#1D3661]" : "border-slate-300 bg-white")}>{checked ? <Check className="h-3.5 w-3.5" /> : null}</div>
            <div>
                <div className="font-bold text-black">{label}</div>
                {description ? <div className="text-sm text-black">{description}</div> : null}
            </div>
        </button>
    )
}

function TogglePill({ active, onClick, label, icon: Icon }: { active: boolean; onClick: () => void; label: string; icon: React.ComponentType<any> }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold transition min-h-[56px]",
                active ? "bg-[#AFCA05] text-[#1D3661] shadow-lg shadow-[#AFCA05]/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            )}
        >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
            {active ? <Check className="h-4 w-4" /> : null}
        </button>
    )
}

function StatusIcon({ status }: { status: "complete" | "partial" | "empty" }) {
    if (status === "complete") return <CheckCircle2 className="h-4 w-4" />
    if (status === "partial") return <AlertCircle className="h-4 w-4" />
    return <Circle className="h-4 w-4" />
}

function SignatureCanvas({ onSave, onClose, title }: { onSave: (value: string) => void; onClose: () => void; title: string }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const drawing = useRef(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.scale(dpr, dpr)
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, rect.width, rect.height)
        ctx.strokeStyle = "#0f172a"
        ctx.lineWidth = 2.5
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
    }, [])

    const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const ctx = canvasRef.current?.getContext("2d")
        if (!ctx) return
        const pos = getPos(e)
        drawing.current = true
        ctx.beginPath()
        ctx.moveTo(pos.x, pos.y)
    }

    const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!drawing.current) return
        const ctx = canvasRef.current?.getContext("2d")
        if (!ctx) return
        const pos = getPos(e)
        ctx.lineTo(pos.x, pos.y)
        ctx.stroke()
    }

    const end = () => {
        drawing.current = false
    }

    const clear = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.restore()
        const rect = canvas.getBoundingClientRect()
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, rect.width, rect.height)
    }

    const save = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        onSave(canvas.toDataURL("image/png"))
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-slate-200">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-black">{title}</h3>
                        <p className="text-sm text-black">Bitte direkt im Feld unterschreiben.</p>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
                </div>
                <canvas
                    ref={canvasRef}
                    className="h-72 w-full rounded-2xl border-2 border-dashed border-[#3BA9D3] bg-white touch-none"
                    onPointerDown={start}
                    onPointerMove={move}
                    onPointerUp={end}
                    onPointerLeave={end}
                />
                <div className="mt-4 flex flex-wrap gap-3">
                    <button onClick={clear} className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Leeren</button>
                    <button onClick={save} className="rounded-2xl bg-[#1D3661] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#163055]">Übernehmen</button>
                </div>
            </div>
        </div>
    )
}
function SignatureBox({ title, value, onCreate, onClear }: { title: string; value?: string; onCreate: () => void; onClear: () => void }) {
    return (
        <div className="space-y-3 rounded-3xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
                <h4 className="font-bold text-black">{title}</h4>
                {value ? (
                    <button onClick={onClear} className="rounded-xl p-2 text-red-500 hover:bg-red-50"><X className="h-4 w-4" /></button>
                ) : null}
            </div>
            {value ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <img src={value} alt={title} className="h-32 w-full object-contain bg-white" />
                </div>
            ) : (
                <button
                    onClick={onCreate}
                    className="flex h-32 w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#3BA9D3] text-[#3BA9D3] transition hover:bg-[#3BA9D3]/5"
                >
                    <Pen className="h-5 w-5" />
                    <span className="font-medium">Digital unterschreiben</span>
                </button>
            )}
        </div>
    )
}

function PhotoUpload({ label, value, onChange }: { label: string; value?: string; onChange: (value?: string) => void }) {
    const inputRef = useRef<HTMLInputElement | null>(null)

    const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = await readFileAsDataUrl(file)
        onChange(url)
        e.target.value = ""
    }

    return (
        <div className="space-y-3 rounded-3xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h4 className="font-bold text-black">{label}</h4>
                    <p className="text-sm text-black">Foto als Vorschaden-Dokumentation</p>
                </div>
                {value ? <button onClick={() => onChange(undefined)} className="rounded-xl p-2 text-red-500 hover:bg-red-50"><X className="h-4 w-4" /></button> : null}
            </div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
            {value ? (
                <img src={value} alt={label} className="h-44 w-full rounded-2xl object-cover ring-1 ring-slate-200" />
            ) : (
                <button
                    onClick={() => inputRef.current?.click()}
                    className="flex h-44 w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-600 hover:border-[#3BA9D3] hover:text-[#3BA9D3]"
                >
                    Foto hochladen
                </button>
            )}
            {value ? (
                <button onClick={() => inputRef.current?.click()} className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Foto ersetzen</button>
            ) : null}
        </div>
    )
}

function SketchCanvas({ label, value, onChange }: { label: string; value?: string; onChange: (value: string) => void }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const drawing = useRef(false)

    useEffect(() => {
        const canvas = canvasRef.current
        const wrapper = wrapperRef.current
        if (!canvas || !wrapper) return
        const dpr = window.devicePixelRatio || 1
        const rect = wrapper.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = 220 * dpr
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `220px`
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.scale(dpr, dpr)
        ctx.fillStyle = "#f8fafc"
        ctx.fillRect(0, 0, rect.width, 220)
        ctx.strokeStyle = "#3BA9D3"
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        if (value) {
            const img = new Image()
            img.onload = () => ctx.drawImage(img, 0, 0, rect.width, 220)
            img.src = value
        } else {
            ctx.fillStyle = "#94a3b8"
            ctx.font = "14px sans-serif"
            ctx.fillText(`${label} – Skizze / Markierung`, 16, 28)
            ctx.strokeStyle = "#cbd5e1"
            ctx.setLineDash([5, 5])
            ctx.strokeRect(16, 42, rect.width - 32, 150)
            ctx.setLineDash([])
            ctx.beginPath()
            ctx.moveTo(rect.width / 2, 42)
            ctx.lineTo(rect.width / 2, 192)
            ctx.moveTo(16, 117)
            ctx.lineTo(rect.width - 16, 117)
            ctx.stroke()
            ctx.fillStyle = "#64748b"
            ctx.fillText("Freihand markieren", 24, 64)
        }
    }, [label, value])

    const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const ctx = canvasRef.current?.getContext("2d")
        if (!ctx) return
        const pos = point(e)
        drawing.current = true
        ctx.setLineDash([])
        ctx.strokeStyle = "#ef4444"
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.moveTo(pos.x, pos.y)
    }

    const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!drawing.current) return
        const ctx = canvasRef.current?.getContext("2d")
        if (!ctx) return
        const pos = point(e)
        ctx.lineTo(pos.x, pos.y)
        ctx.stroke()
    }

    const end = () => {
        drawing.current = false
        if (canvasRef.current) onChange(canvasRef.current.toDataURL("image/png"))
    }

    const clear = () => onChange("")

    return (
        <div className="rounded-3xl border border-slate-200 p-3">
            <div ref={wrapperRef} className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-slate-800">{label}</h4>
                    <button onClick={clear} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">Leeren</button>
                </div>
                <canvas
                    ref={canvasRef}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 touch-none"
                    onPointerDown={start}
                    onPointerMove={move}
                    onPointerUp={end}
                    onPointerLeave={end}
                />
            </div>
        </div>
    )
}

function Header({ orderType, onOrderTypeChange }: { orderType: FormData["orderType"]; onOrderTypeChange: (type: keyof FormData["orderType"]) => void }) {
    const currentDate = format(new Date(), "dd. MMMM yyyy", { locale: de })
    const currentTime = format(new Date(), "HH:mm", { locale: de }) + " Uhr"
    return (
        <SectionCard title="Arbeitskarte Digital v3.0" subtitle="THITRONIK – Demo-Nachbau des gelieferten Formular-Workflows">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <div className="text-sm font-bold text-black">Datum</div>
                    <div className="text-base font-bold text-black">{currentDate}</div>
                    <div className="text-sm text-black">{currentTime}</div>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <TogglePill active={orderType.einbau} onClick={() => onOrderTypeChange("einbau")} label="Einbau" icon={ClipboardList} />
                    <TogglePill active={orderType.nachruestung} onClick={() => onOrderTypeChange("nachruestung")} label="Nachrüstung" icon={Wrench} />
                    <TogglePill active={orderType.service} onClick={() => onOrderTypeChange("service")} label="Service" icon={Settings} />
                </div>
            </div>
        </SectionCard>
    )
}

function getPageStatus(pageId: number, formData: FormData, materials: MaterialItem[]): "complete" | "partial" | "empty" {
    switch (pageId) {
        case 1: {
            const hasCustomer = formData.kunde.name || formData.kunde.firma
            const hasMonteur = formData.monteur.name
            const hasOrderType = formData.orderType.einbau || formData.orderType.nachruestung || formData.orderType.service
            if (hasCustomer && hasMonteur && hasOrderType) return "complete"
            if (hasCustomer || hasMonteur || hasOrderType) return "partial"
            return "empty"
        }
        case 2: {
            const hasPhotos = Object.values(formData.vorschadenFotos || {}).some(Boolean)
            const hasChecks = Object.values(formData.checklistGrundfunktionen || {}).some(Boolean)
            if (hasPhotos && hasChecks) return "complete"
            if (hasPhotos || hasChecks) return "partial"
            return "empty"
        }
        case 3: {
            const verbautCount = materials.filter((m) => m.verbaut).length
            return verbautCount > 0 ? "complete" : "empty"
        }
        case 4: {
            const hasUebergabe = formData.uebergabe.unterschriftKunde
            const hasAnyCheck = Object.entries(formData.uebergabe)
                .filter(([, value]) => typeof value === "boolean")
                .some(([, value]) => value === true)
            if (hasUebergabe) return "complete"
            if (hasAnyCheck || formData.uebergabe.ort) return "partial"
            return "empty"
        }
        default:
            return "empty"
    }
}

function NavigationTabs({ activePage, setActivePage, formData, materials }: { activePage: number; setActivePage: (page: number) => void; formData: FormData; materials: MaterialItem[] }) {
    const tabs = [
        { id: 1, label: "Auftrag", shortLabel: "1" },
        { id: 2, label: "Sichtkontrolle", shortLabel: "2" },
        { id: 3, label: "Material", shortLabel: "3" },
        { id: 4, label: "Übergabe", shortLabel: "4" },
    ]

    return (
        <nav className="sticky top-0 z-20 mb-6 rounded-3xl bg-[#1D3661] p-3 shadow-xl shadow-[#1D3661]/10">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {tabs.map((tab) => {
                    const status = getPageStatus(tab.id, formData, materials)
                    const isActive = activePage === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActivePage(tab.id)}
                            className={cn(
                                "relative flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                                isActive ? "bg-[#AFCA05] text-[#1D3661] shadow-lg shadow-[#AFCA05]/20" : "bg-white/10 text-white hover:bg-white/15",
                            )}
                        >
                            <span className="flex items-center gap-2">
                                <StatusIcon status={status} />
                                <span>{tab.label}</span>
                            </span>
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">{tab.shortLabel}</span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}

function ProgressIndicator({ formData, materials }: { formData: FormData; materials: MaterialItem[] }) {
    const pageStatuses = [1, 2, 3, 4].map((pageId) => getPageStatus(pageId, formData, materials))
    const score = pageStatuses.reduce((sum, status) => sum + (status === "complete" ? 25 : status === "partial" ? 12.5 : 0), 0)

    return (
        <div className="mb-6 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                    <div className="text-sm font-bold text-black">Fortschritt</div>
                    <div className="text-sm text-black">Automatische Auswertung anhand der vier Formularseiten</div>
                </div>
                <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-bold text-black">{Math.round(score)}%</div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#3BA9D3] transition-all" style={{ width: `${score}%` }} />
            </div>
        </div>
    )
}

function ActionButtons({
    onPrint,
    onReset,
    onSave,
    hasUnsavedChanges,
    formData,
    materials,
    onImport,
}: {
    onPrint: () => void
    onReset: () => void
    onSave: () => void
    hasUnsavedChanges: boolean
    formData: FormData
    materials: MaterialItem[]
    onImport: (data: { formData: FormData; materials: MaterialItem[] }) => void
}) {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [saveSuccess, setSaveSuccess] = useState(false)

    const generateFilename = () => {
        const kennzeichen = formData.kunde.kennzeichen?.trim().replace(/\s+/g, "-").toUpperCase() || "OHNE-KZ"
        const datum = format(new Date(), "yyyy-MM-dd")
        const kunde = formData.kunde.name?.trim().replace(/\s+/g, "-").substring(0, 15) || "Kunde"
        return `Arbeitskarte_${kennzeichen}_${datum}_${kunde}.json`
    }

    const handleSave = () => {
        onSave()
        setSaveSuccess(true)
        window.setTimeout(() => setSaveSuccess(false), 1800)
    }

    const handleExport = () => {
        const exportData = {
            version: "3.0-demo",
            exportedAt: new Date().toISOString(),
            kennzeichen: formData.kunde.kennzeichen,
            formData,
            materials: materials.filter((m) => m.verbaut),
        }
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = generateFilename()
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const content = String(e.target?.result || "")
                const data = JSON.parse(content)
                if (data.formData) {
                    onImport({ formData: data.formData, materials: data.materials || [] })
                    alert(`Datei \"${file.name}\" erfolgreich geladen.`)
                } else {
                    alert("Ungültiges Dateiformat.")
                }
            } catch (error) {
                console.error("Import error:", error)
                alert("Fehler beim Laden der Datei.")
            }
        }
        reader.readAsText(file)
        event.target.value = ""
    }

    const Button = ({ children, onClick, primary = false }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) => (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition min-h-[48px]",
                primary ? "bg-[#1D3661] text-white hover:bg-[#163055]" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            )}
        >
            {children}
        </button>
    )

    return (
        <div className="mb-6 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                    <div className="text-sm font-bold text-black">Aktionen</div>
                    <div className="text-sm text-black">JSON-Import/Export, lokales Speichern, Reset und Druckansicht</div>
                </div>
                {hasUnsavedChanges && !saveSuccess ? (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">Nicht gespeichert</span>
                ) : null}
            </div>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                <Button onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /> Laden</Button>
                <Button onClick={handleExport}><Download className="h-4 w-4" /> Export</Button>
                <Button onClick={handleSave} primary>{saveSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}{saveSuccess ? "Gespeichert" : "Speichern"}</Button>
                <Button onClick={onReset}><RotateCcw className="h-4 w-4" /> Neu</Button>
                <Button onClick={onPrint}><Printer className="h-4 w-4" /> Drucken</Button>
            </div>
        </div>
    )
}

function PageOne({
    formData,
    updateFormData,
    sketches,
    setSketches,
}: {
    formData: FormData
    updateFormData: (updates: Partial<FormData>) => void
    sketches: Record<string, string>
    setSketches: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) {
    const updateSketch = (key: string, value: string) => setSketches((prev) => ({ ...prev, [key]: value }))

    return (
        <div className="space-y-6">
            <Header
                orderType={formData.orderType}
                onOrderTypeChange={(type) => updateFormData({ orderType: { ...formData.orderType, [type]: !formData.orderType[type] } })}
            />

            <div className="grid gap-6 xl:grid-cols-2">
                <SectionCard title="Kundendaten" subtitle="Basisdaten des Fahrzeugs und des Auftraggebers">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <FieldLabel icon={FileText}>Firma</FieldLabel>
                            <TextInput value={formData.kunde.firma} onChange={(e) => updateFormData({ kunde: { ...formData.kunde, firma: e.target.value } })} placeholder="Firmenname" />
                        </div>
                        <div>
                            <FieldLabel required icon={User}>Name</FieldLabel>
                            <TextInput value={formData.kunde.name} onChange={(e) => updateFormData({ kunde: { ...formData.kunde, name: e.target.value } })} placeholder="Kundenname" />
                        </div>
                        <div>
                            <FieldLabel icon={Phone}>Telefon</FieldLabel>
                            <TextInput value={formData.kunde.telefon} onChange={(e) => updateFormData({ kunde: { ...formData.kunde, telefon: e.target.value } })} placeholder="+49 ..." />
                        </div>
                        <div>
                            <FieldLabel icon={Car}>Kennzeichen</FieldLabel>
                            <TextInput value={formData.kunde.kennzeichen} onChange={(e) => updateFormData({ kunde: { ...formData.kunde, kennzeichen: e.target.value.toUpperCase() } })} placeholder="XX-XX 1234" className="uppercase font-mono" />
                        </div>
                        <div>
                            <FieldLabel icon={Car}>Fahrzeugtyp</FieldLabel>
                            <TextInput value={formData.kunde.fahrzeugtyp} onChange={(e) => updateFormData({ kunde: { ...formData.kunde, fahrzeugtyp: e.target.value } })} placeholder="z. B. Fiat Ducato" />
                        </div>
                        <div>
                            <FieldLabel icon={Hash}>Fahrgestellnummer</FieldLabel>
                            <TextInput value={formData.kunde.fahrgestellnummer} onChange={(e) => updateFormData({ kunde: { ...formData.kunde, fahrgestellnummer: e.target.value.toUpperCase() } })} placeholder="VIN" className="uppercase font-mono text-xs" />
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title="Monteur" subtitle="Bearbeitung, Prüfstatus und Seriennummern">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <FieldLabel required icon={User}>Name</FieldLabel>
                            <TextInput value={formData.monteur.name} onChange={(e) => updateFormData({ monteur: { ...formData.monteur, name: e.target.value } })} placeholder="Monteur Name" />
                        </div>
                        <div>
                            <FieldLabel icon={Hash}>Seriennummern</FieldLabel>
                            <TextInput value={formData.monteur.seriennummern} onChange={(e) => updateFormData({ monteur: { ...formData.monteur, seriennummern: e.target.value } })} placeholder="SN-XXXXX" className="font-mono" />
                        </div>
                    </div>
                    <CheckTile checked={formData.monteur.funktionenGeprueft} onChange={(checked) => updateFormData({ monteur: { ...formData.monteur, funktionenGeprueft: checked } })} label="Alle Funktionen geprüft" description="Statusmarkierung für die Montage- und Funktionskontrolle" />
                </SectionCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <SectionCard title="OBD & Tacho" subtitle="Eingangs- und Ausgangswerte inklusive Tacho-Fehlerstatus">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <FieldLabel>Eingang</FieldLabel>
                            <TextInput value={formData.obd.eingang} onChange={(e) => updateFormData({ obd: { ...formData.obd, eingang: e.target.value } })} />
                        </div>
                        <div>
                            <FieldLabel>Ausgang</FieldLabel>
                            <TextInput value={formData.obd.ausgang} onChange={(e) => updateFormData({ obd: { ...formData.obd, ausgang: e.target.value } })} />
                        </div>
                        <div>
                            <FieldLabel>Uhrzeit</FieldLabel>
                            <TextInput value={formData.obd.uhrzeit} onChange={(e) => updateFormData({ obd: { ...formData.obd, uhrzeit: e.target.value } })} placeholder="08:45" />
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-[1fr_1fr_2fr]">
                        <CheckTile checked={formData.tachoFehler.ja} onChange={(checked) => updateFormData({ tachoFehler: { ...formData.tachoFehler, ja: checked, nein: checked ? false : formData.tachoFehler.nein } })} label="Tacho-Fehler: Ja" />
                        <CheckTile checked={formData.tachoFehler.nein} onChange={(checked) => updateFormData({ tachoFehler: { ...formData.tachoFehler, nein: checked, ja: checked ? false : formData.tachoFehler.ja } })} label="Tacho-Fehler: Nein" />
                        <div>
                            <FieldLabel>Fehlercode</FieldLabel>
                            <TextInput value={formData.tachoFehler.code} onChange={(e) => updateFormData({ tachoFehler: { ...formData.tachoFehler, code: e.target.value } })} className="font-mono" placeholder="Optionaler Fehlercode" />
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title="Hinweise / Bemerkungen" subtitle="Freitextfeld für Zusatzinfos, Auffälligkeiten und Einbauhinweise">
                    <TextArea value={formData.hinweis} onChange={(e) => updateFormData({ hinweis: e.target.value })} placeholder="Hinweise und Bemerkungen hier eingeben ..." rows={5} />
                    <div>
                        <FieldLabel>LED Einbauort</FieldLabel>
                        <TextInput value={formData.ledEinbauort} onChange={(e) => updateFormData({ ledEinbauort: e.target.value })} placeholder="Position der LED angeben ..." />
                    </div>
                </SectionCard>
            </div>

            <SectionCard title="Fahrzeug-Visualisierung" subtitle="Interaktive Skizzenflächen als begehbarer Ersatz für die fehlenden Fahrzeuggrafiken">
                <div className="grid gap-4 md:grid-cols-2">
                    <SketchCanvas label="Fahrerseite" value={sketches.fahrerseite} onChange={(value) => updateSketch("fahrerseite", value)} />
                    <SketchCanvas label="Beifahrerseite" value={sketches.beifahrerseite} onChange={(value) => updateSketch("beifahrerseite", value)} />
                    <SketchCanvas label="Dach" value={sketches.dach} onChange={(value) => updateSketch("dach", value)} />
                    <SketchCanvas label="Heck" value={sketches.heck} onChange={(value) => updateSketch("heck", value)} />
                </div>
            </SectionCard>
        </div>
    )
}

function PageTwo({ formData, updateFormData }: { formData: FormData; updateFormData: (updates: Partial<FormData>) => void }) {
    const [signatureModal, setSignatureModal] = useState<"monteur" | "kunde" | null>(null)

    const updateFoto = (fotoKey: keyof FormData["vorschadenFotos"], value?: string) => {
        updateFormData({ vorschadenFotos: { ...formData.vorschadenFotos, [fotoKey]: value } })
    }

    const clearSignature = (type: "monteur" | "kunde") => {
        if (type === "monteur") updateFormData({ unterschriftMonteur: "" })
        else updateFormData({ unterschriftKunde: "" })
    }

    return (
        <div className="space-y-6">
            <SectionCard title="Sichtkontrolle – Seite 2 von 4" subtitle="Fotos, Schadensbeschreibung, Prüf-Checklisten und Unterschriften">
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                    <PhotoUpload label="Fahrerseite" value={formData.vorschadenFotos.fahrerseite} onChange={(url) => updateFoto("fahrerseite", url)} />
                    <PhotoUpload label="Beifahrerseite" value={formData.vorschadenFotos.beifahrerseite} onChange={(url) => updateFoto("beifahrerseite", url)} />
                    <PhotoUpload label="Front" value={formData.vorschadenFotos.front} onChange={(url) => updateFoto("front", url)} />
                    <PhotoUpload label="Heck" value={formData.vorschadenFotos.heck} onChange={(url) => updateFoto("heck", url)} />
                </div>
            </SectionCard>

            <SectionCard title="Schadensmeldung / Beschreibung" subtitle="Freitext zur Vorschadenbeschreibung">
                <TextArea value={formData.schadensmeldung} onChange={(e) => updateFormData({ schadensmeldung: e.target.value })} placeholder="Vorschäden beschreiben ..." rows={5} />
            </SectionCard>

            <div className="grid gap-6 xl:grid-cols-3">
                <SectionCard title="Grundfunktionen">
                    <div className="space-y-3">
                        <CheckTile checked={formData.checklistGrundfunktionen.zentralverriegelung} onChange={(checked) => updateFormData({ checklistGrundfunktionen: { ...formData.checklistGrundfunktionen, zentralverriegelung: checked } })} label="Zentralverriegelung" />
                        <CheckTile checked={formData.checklistGrundfunktionen.sirene} onChange={(checked) => updateFormData({ checklistGrundfunktionen: { ...formData.checklistGrundfunktionen, sirene: checked } })} label="Sirene" />
                        <CheckTile checked={formData.checklistGrundfunktionen.panikAlarm} onChange={(checked) => updateFormData({ checklistGrundfunktionen: { ...formData.checklistGrundfunktionen, panikAlarm: checked } })} label="Panik-Alarm" />
                        <CheckTile checked={formData.checklistGrundfunktionen.neigungssensor} onChange={(checked) => updateFormData({ checklistGrundfunktionen: { ...formData.checklistGrundfunktionen, neigungssensor: checked } })} label="Neigungssensor" />
                    </div>
                </SectionCard>

                <SectionCard title="Pro-finder Alarme">
                    <div className="space-y-3">
                        <CheckTile checked={formData.checklistProFinder.gpsOrtung} onChange={(checked) => updateFormData({ checklistProFinder: { ...formData.checklistProFinder, gpsOrtung: checked } })} label="GPS-Ortung" />
                        <CheckTile checked={formData.checklistProFinder.geoFence} onChange={(checked) => updateFormData({ checklistProFinder: { ...formData.checklistProFinder, geoFence: checked } })} label="Geo-Fence" />
                        <CheckTile checked={formData.checklistProFinder.bewegungsAlarm} onChange={(checked) => updateFormData({ checklistProFinder: { ...formData.checklistProFinder, bewegungsAlarm: checked } })} label="Bewegungsalarm" />
                        <CheckTile checked={formData.checklistProFinder.batterieueberwachung} onChange={(checked) => updateFormData({ checklistProFinder: { ...formData.checklistProFinder, batterieueberwachung: checked } })} label="Batterieüberwachung" />
                    </div>
                </SectionCard>

                <SectionCard title="Rückfahrkamera">
                    <div className="space-y-3">
                        <CheckTile checked={formData.checklistRueckfahrkamera.bildqualitaet} onChange={(checked) => updateFormData({ checklistRueckfahrkamera: { ...formData.checklistRueckfahrkamera, bildqualitaet: checked } })} label="Bildqualität OK" />
                        <CheckTile checked={formData.checklistRueckfahrkamera.hilfslinien} onChange={(checked) => updateFormData({ checklistRueckfahrkamera: { ...formData.checklistRueckfahrkamera, hilfslinien: checked } })} label="Hilfslinien" />
                        <CheckTile checked={formData.checklistRueckfahrkamera.nachtsicht} onChange={(checked) => updateFormData({ checklistRueckfahrkamera: { ...formData.checklistRueckfahrkamera, nachtsicht: checked } })} label="Nachtsicht" />
                    </div>
                </SectionCard>
            </div>

            <SectionCard title="Unterschriften" subtitle="Sichtkontrolle durch Monteur und Kunde bestätigen lassen">
                <div className="grid gap-4 md:grid-cols-2">
                    <SignatureBox title="Unterschrift Monteur" value={formData.unterschriftMonteur} onCreate={() => setSignatureModal("monteur")} onClear={() => clearSignature("monteur")} />
                    <SignatureBox title="Unterschrift Kunde" value={formData.unterschriftKunde} onCreate={() => setSignatureModal("kunde")} onClear={() => clearSignature("kunde")} />
                </div>
            </SectionCard>

            {signatureModal === "monteur" ? <SignatureCanvas title="Unterschrift Monteur" onClose={() => setSignatureModal(null)} onSave={(sig) => updateFormData({ unterschriftMonteur: sig })} /> : null}
            {signatureModal === "kunde" ? <SignatureCanvas title="Unterschrift Kunde" onClose={() => setSignatureModal(null)} onSave={(sig) => updateFormData({ unterschriftKunde: sig })} /> : null}
        </div>
    )
}

function PageThree({ materials, setMaterials }: { materials: MaterialItem[]; setMaterials: React.Dispatch<React.SetStateAction<MaterialItem[]>> }) {
    const [newItem, setNewItem] = useState<Partial<MaterialItem>>({ gruppe: "Sonstiges", artikel: "", artNr: "", menge: 1, notiz: "" })
    const [searchQuery, setSearchQuery] = useState("")
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

    const toggleGroup = (gruppe: string) => setCollapsedGroups((prev) => ({ ...prev, [gruppe]: !prev[gruppe] }))
    const deleteMaterial = (id: string) => setMaterials((prev) => prev.filter((m) => m.id !== id))
    const updateMaterial = (id: string, updates: Partial<MaterialItem>) => setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))

    const addMaterial = () => {
        if (!newItem.artikel?.trim()) return
        setMaterials((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                gruppe: newItem.gruppe || "Sonstiges",
                artikel: newItem.artikel || "",
                artNr: newItem.artNr || "",
                menge: newItem.menge || 1,
                verbaut: false,
                notiz: newItem.notiz || "",
            },
        ])
        setNewItem({ gruppe: "Sonstiges", artikel: "", artNr: "", menge: 1, notiz: "" })
    }

    const groupOrder = ["Alarmsystem", "Zubehör", "Gaswarnsystem", "Rauchmelder", "Fahrzeugortung", "Fahrzeugortung Zubehör", "Sonstiges"]

    const filteredMaterials = useMemo(
        () =>
            materials.filter(
                (m) =>
                    m.artikel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    m.artNr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    m.gruppe.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        [materials, searchQuery],
    )

    const groupedMaterials = useMemo(
        () =>
            filteredMaterials.reduce((acc, item) => {
                if (!acc[item.gruppe]) acc[item.gruppe] = []
                acc[item.gruppe].push(item)
                return acc
            }, {} as Record<string, MaterialItem[]>),
        [filteredMaterials],
    )

    const sortedGroups = groupOrder.filter((g) => groupedMaterials[g])
    const extraGroups = Object.keys(groupedMaterials).filter((g) => !groupOrder.includes(g))
    const groups = [...sortedGroups, ...extraGroups]
    const verbautCount = materials.filter((m) => m.verbaut).length

    return (
        <div className="space-y-6">
            <SectionCard title="Materialliste – Seite 3 von 4" subtitle="Suche, Materialgruppen, Mengen, Verbaut-Status und freie Ergänzungen">
                <div className="grid gap-4 lg:grid-cols-[2fr_auto_auto]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <TextInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Material suchen ..." className="pl-11" />
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"><Package className="h-4 w-4" /> {materials.length} Gesamt</div>
                    <div className="flex items-center gap-2 rounded-2xl bg-[#AFCA05]/10 px-4 py-3 text-sm font-semibold text-[#7A8F04]"><ShoppingCart className="h-4 w-4" /> {verbautCount} Verbaut</div>
                </div>
            </SectionCard>

            <SectionCard title="Neues Material hinzufügen">
                <div className="grid gap-4 xl:grid-cols-[1.2fr_2fr_1.2fr_.8fr_1.5fr_auto]">
                    <select value={newItem.gruppe} onChange={(e) => setNewItem({ ...newItem, gruppe: e.target.value })} className="rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3BA9D3] focus:ring-4 focus:ring-[#3BA9D3]/10">
                        {groupOrder.map((g) => (
                            <option key={g}>{g}</option>
                        ))}
                    </select>
                    <TextInput placeholder="Artikel" value={newItem.artikel} onChange={(e) => setNewItem({ ...newItem, artikel: e.target.value })} />
                    <TextInput placeholder="Art.-Nr." value={newItem.artNr} onChange={(e) => setNewItem({ ...newItem, artNr: e.target.value })} className="font-mono" />
                    <TextInput type="number" min={1} placeholder="Menge" value={String(newItem.menge ?? 1)} onChange={(e) => setNewItem({ ...newItem, menge: parseInt(e.target.value) || 1 })} />
                    <TextInput placeholder="Notiz" value={newItem.notiz} onChange={(e) => setNewItem({ ...newItem, notiz: e.target.value })} />
                    <button onClick={addMaterial} className="rounded-2xl bg-[#1D3661] px-4 py-3 text-sm font-semibold text-white hover:bg-[#163055]"><span className="inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Hinzufügen</span></button>
                </div>
            </SectionCard>

            {groups.map((gruppe) => {
                const colors = groupColors[gruppe] || groupColors.Sonstiges
                const isCollapsed = collapsedGroups[gruppe]
                const groupItems = groupedMaterials[gruppe]
                const groupVerbaut = groupItems.filter((m) => m.verbaut).length

                return (
                    <div key={gruppe} className={cn("overflow-hidden rounded-3xl bg-white shadow-sm ring-1", colors.ring)}>
                        <button onClick={() => toggleGroup(gruppe)} className={cn("flex w-full items-center justify-between gap-4 px-5 py-4", colors.bg)}>
                            <div className="text-left">
                                <div className={cn("font-semibold", colors.text)}>{gruppe}</div>
                                <div className="text-sm text-black">{groupItems.length} Artikel · {groupVerbaut} verbaut</div>
                            </div>
                            {isCollapsed ? <ChevronDown className="h-5 w-5 text-slate-500" /> : <ChevronUp className="h-5 w-5 text-slate-500" />}
                        </button>
                        {!isCollapsed ? (
                            <div className="divide-y divide-slate-100">
                                {groupItems.map((item) => (
                                    <div key={item.id} className="grid gap-3 p-4 xl:grid-cols-[2fr_1fr_.7fr_.8fr_2fr_auto] xl:items-center">
                                        <div>
                                            <div className="font-bold text-black">{item.artikel}</div>
                                            <div className="text-xs text-black">ID: {item.id}</div>
                                        </div>
                                        <div className="text-sm font-mono text-black">{item.artNr || "—"}</div>
                                        <TextInput type="number" min={1} value={String(item.menge)} onChange={(e) => updateMaterial(item.id, { menge: parseInt(e.target.value) || 1 })} className="text-center" />
                                        <button
                                            type="button"
                                            onClick={() => updateMaterial(item.id, { verbaut: !item.verbaut })}
                                            className={cn(
                                                "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                                                item.verbaut ? "bg-[#AFCA05]/10 text-[#7A8F04] ring-1 ring-[#AFCA05]/20" : "bg-slate-100 text-black font-bold hover:bg-slate-200",
                                            )}
                                        >
                                            {item.verbaut ? "Verbaut" : "Offen"}
                                        </button>
                                        <TextInput value={item.notiz} onChange={(e) => updateMaterial(item.id, { notiz: e.target.value })} placeholder="Notiz ..." />
                                        <button onClick={() => deleteMaterial(item.id)} className="rounded-2xl p-3 text-slate-500 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                )
            })}

            {filteredMaterials.length === 0 ? (
                <SectionCard title={searchQuery ? "Keine Materialien gefunden" : "Noch keine Materialien hinzugefügt"} subtitle="Passe die Suche an oder füge manuell einen Artikel hinzu." >
                    <div className="text-sm text-black">Die Materialliste reagiert live auf Suchbegriff, Menge, Verbaut-Status und Notizen.</div>
                </SectionCard>
            ) : null}
        </div>
    )
}

function PageFour({ formData, updateFormData }: { formData: FormData; updateFormData: (updates: Partial<FormData>) => void }) {
    const [signatureModal, setSignatureModal] = useState<"monteur" | "kunde" | "uebergabeKunde" | null>(null)

    const updateUebergabe = (key: keyof FormData["uebergabe"], value: boolean | string) => {
        updateFormData({ uebergabe: { ...formData.uebergabe, [key]: value } })
    }

    const clearSignature = (type: "monteur" | "kunde" | "uebergabeKunde") => {
        if (type === "monteur") updateFormData({ unterschriftMonteur: "" })
        else if (type === "kunde") updateFormData({ unterschriftKunde: "" })
        else updateUebergabe("unterschriftKunde", "")
    }

    const checklistItems = [
        { key: "grundfunktionBedienung", label: "Grundfunktion Bedienung" },
        { key: "batteriewechsel", label: "Batteriewechsel" },
        { key: "proFinderProgrammiert", label: "Pro-Finder programmiert" },
        { key: "proFinderAlarme", label: "Pro-Finder Alarme" },
        { key: "uhrBordcomputer", label: "Uhr/Bordcomputer" },
        { key: "einweisungErhalten", label: "Einweisung erhalten" },
        { key: "panikAlarm", label: "Panikalarm" },
        { key: "offenemAlarmCheck", label: "Offenem Alarm-Check" },
        { key: "proFinderBedienung", label: "Pro-Finder Bedienung" },
        { key: "radioeinstellung", label: "Radioeinstellung" },
        { key: "funktionKlappschluessel", label: "Funktion Klappschlüssel nach Umrüstung" },
        { key: "abschalteinrichtungMotorkontrollleuchte", label: "Abschalteinrichtung Motorkontrollleuchte" },
        { key: "rueckfahrkamera", label: "Rückfahrkamera" },
    ] as const

    const checkedCount = checklistItems.filter((item) => Boolean(formData.uebergabe[item.key])).length

    return (
        <div className="space-y-6">
            <SectionCard title="Übergabeprotokoll – Seite 4 von 4" subtitle="Einweisung, Übergabe-Checkliste, Ort/Datum und Abschluss-Unterschriften">
                <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-black">Übergabe-Checkliste</h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-800">{checkedCount} / {checklistItems.length} erledigt</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {checklistItems.map((item) => (
                        <CheckTile
                            key={item.key}
                            checked={Boolean(formData.uebergabe[item.key])}
                            onChange={(checked) => updateUebergabe(item.key, checked)}
                            label={item.label}
                        />
                    ))}
                </div>
            </SectionCard>

            <div className="grid gap-6 xl:grid-cols-2">
                <SectionCard title="Sonstiger Vermerk">
                    <TextArea value={formData.uebergabe.sonstigerVermerk} onChange={(e) => updateUebergabe("sonstigerVermerk", e.target.value)} placeholder="Sonstige Anmerkungen ..." rows={6} />
                </SectionCard>

                <SectionCard title="Ort und Datum">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <FieldLabel>Ort</FieldLabel>
                            <TextInput value={formData.uebergabe.ort} onChange={(e) => updateUebergabe("ort", e.target.value)} placeholder="Ort eingeben ..." />
                        </div>
                        <div>
                            <FieldLabel>Datum</FieldLabel>
                            <TextInput type="date" value={formData.uebergabe.datum} onChange={(e) => updateUebergabe("datum", e.target.value)} />
                        </div>
                    </div>
                </SectionCard>
            </div>

            <SectionCard title="Abschluss-Unterschriften" subtitle="Ich habe den abgeschnittenen Abschnitt aus deinem Codeschnipsel sinnvoll vervollständigt.">
                <div className="grid gap-4 lg:grid-cols-3">
                    <SignatureBox title="Monteur" value={formData.unterschriftMonteur} onCreate={() => setSignatureModal("monteur")} onClear={() => clearSignature("monteur")} />
                    <SignatureBox title="Kunde (Sichtkontrolle)" value={formData.unterschriftKunde} onCreate={() => setSignatureModal("kunde")} onClear={() => clearSignature("kunde")} />
                    <SignatureBox title="Kunde (Übergabe)" value={formData.uebergabe.unterschriftKunde} onCreate={() => setSignatureModal("uebergabeKunde")} onClear={() => clearSignature("uebergabeKunde")} />
                </div>
            </SectionCard>

            {signatureModal === "monteur" ? <SignatureCanvas title="Unterschrift Monteur" onClose={() => setSignatureModal(null)} onSave={(sig) => updateFormData({ unterschriftMonteur: sig })} /> : null}
            {signatureModal === "kunde" ? <SignatureCanvas title="Unterschrift Kunde" onClose={() => setSignatureModal(null)} onSave={(sig) => updateFormData({ unterschriftKunde: sig })} /> : null}
            {signatureModal === "uebergabeKunde" ? <SignatureCanvas title="Unterschrift Kunde (Übergabe)" onClose={() => setSignatureModal(null)} onSave={(sig) => updateUebergabe("unterschriftKunde", sig)} /> : null}
        </div>
    )
}

export default function ThitronikArbeitskarteDemo() {
    const [activePage, setActivePage] = useState(1)
    const [formData, setFormData] = useState<FormData>(initialFormData)
    const [materials, setMaterials] = useState<MaterialItem[]>(initialMaterials)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [sketches, setSketches] = useState<Record<string, string>>({
        fahrerseite: "",
        beifahrerseite: "",
        dach: "",
        heck: "",
    })

    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY)
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData)
                if (parsed.formData) setFormData((prev: FormData) => ({ ...prev, ...parsed.formData }))
                if (parsed.materials) setMaterials(parsed.materials)
                if (parsed.sketches) setSketches(parsed.sketches)
            } catch (e) {
                console.error("Failed to load saved data:", e)
            }
        }
        setIsLoaded(true)
    }, [])

    const saveData = useCallback(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, materials, sketches }))
        setHasUnsavedChanges(false)
    }, [formData, materials, sketches])

    useEffect(() => {
        if (!isLoaded || !hasUnsavedChanges) return
        const timer = window.setTimeout(() => saveData(), 30000)
        return () => window.clearTimeout(timer)
    }, [hasUnsavedChanges, isLoaded, saveData])

    const updateFormData = (updates: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }))
        setHasUnsavedChanges(true)
    }

    const handleMaterialsChange: React.Dispatch<React.SetStateAction<MaterialItem[]>> = (action) => {
        setMaterials(action)
        setHasUnsavedChanges(true)
    }

    useEffect(() => {
        if (!isLoaded) return
        setHasUnsavedChanges(true)
    }, [sketches])

    const handleImport = (data: { formData: FormData; materials: MaterialItem[] }) => {
        setFormData((prev) => ({
            ...prev,
            ...initialFormData,
            ...data.formData,
            orderType: { ...initialFormData.orderType, ...data.formData.orderType },
            kunde: { ...initialFormData.kunde, ...data.formData.kunde },
            monteur: { ...initialFormData.monteur, ...data.formData.monteur },
            obd: { ...initialFormData.obd, ...data.formData.obd },
            tachoFehler: { ...initialFormData.tachoFehler, ...data.formData.tachoFehler },
            vorschadenFotos: { ...initialFormData.vorschadenFotos, ...data.formData.vorschadenFotos },
            checklistGrundfunktionen: { ...initialFormData.checklistGrundfunktionen, ...data.formData.checklistGrundfunktionen },
            checklistProFinder: { ...initialFormData.checklistProFinder, ...data.formData.checklistProFinder },
            checklistRueckfahrkamera: { ...initialFormData.checklistRueckfahrkamera, ...data.formData.checklistRueckfahrkamera },
            uebergabe: { ...initialFormData.uebergabe, ...data.formData.uebergabe },
        }))
        if (data.materials && data.materials.length > 0) {
            setMaterials((prev) => {
                const importedMap = new Map(data.materials.map((m) => [m.id, m]))
                return prev.map((m) => {
                    const imported = importedMap.get(m.id)
                    if (imported) return { ...m, verbaut: imported.verbaut, menge: imported.menge, notiz: imported.notiz }
                    return m
                })
            })
        }
        setHasUnsavedChanges(true)
    }

    const handleReset = () => {
        if (window.confirm("Möchten Sie wirklich alle Daten zurücksetzen?")) {
            setFormData({ ...initialFormData, uebergabe: { ...initialFormData.uebergabe, datum: todayIso() } })
            setMaterials(initialMaterials)
            setSketches({ fahrerseite: "", beifahrerseite: "", dach: "", heck: "" })
            localStorage.removeItem(STORAGE_KEY)
            setHasUnsavedChanges(false)
            setActivePage(1)
        }
    }

    const handlePrint = () => {
        const requiredFields = [
            { value: formData.kunde.name, label: "Kundenname" },
            { value: formData.monteur.name, label: "Monteur" },
        ]
        const missingFields = requiredFields.filter((f) => !f.value.trim())
        if (missingFields.length > 0) {
            const proceed = window.confirm(`Folgende Pflichtfelder sind noch leer:\n${missingFields.map((f) => "• " + f.label).join("\n")}\n\nTrotzdem drucken?`)
            if (!proceed) return
        }
        saveData()
        window.print()
    }

    if (!isLoaded) {
        return <div className="p-8 text-sm font-bold text-black">Lade Daten ...</div>
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <style>{`
        @media print {
          button { box-shadow: none !important; }
          nav, .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
                <div className="mb-6 rounded-3xl bg-gradient-to-r from-[#1D3661] to-[#25467d] p-6 text-white shadow-xl shadow-[#1D3661]/15">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">Begehbare React-Demo</div>
                            <h1 className="text-2xl font-bold md:text-3xl">THITRONIK Arbeitskarte Digital</h1>
                            <p className="mt-2 max-w-3xl text-sm text-white/80">
                                Nachbau deines Codes als interaktive Ein-Datei-Demo mit Tabs, Materialverwaltung, Fotos, Signaturen, Export/Import und lokaler Speicherung.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/90">
                            Stand: {format(new Date(), "dd.MM.yyyy HH:mm")}
                        </div>
                    </div>
                </div>

                <NavigationTabs activePage={activePage} setActivePage={setActivePage} formData={formData} materials={materials} />
                <ProgressIndicator formData={formData} materials={materials} />
                <ActionButtons onPrint={handlePrint} onReset={handleReset} onSave={saveData} hasUnsavedChanges={hasUnsavedChanges} formData={formData} materials={materials} onImport={handleImport} />

                {activePage === 1 ? <PageOne formData={formData} updateFormData={updateFormData} sketches={sketches} setSketches={setSketches} /> : null}
                {activePage === 2 ? <PageTwo formData={formData} updateFormData={updateFormData} /> : null}
                {activePage === 3 ? <PageThree materials={materials} setMaterials={handleMaterialsChange} /> : null}
                {activePage === 4 ? <PageFour formData={formData} updateFormData={updateFormData} /> : null}
            </div>
        </div>
    )
}
