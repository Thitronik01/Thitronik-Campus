"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

const registerSchema = z.object({
    name: z.string().min(2, "Mindestens 2 Zeichen"),
    company: z.string().min(2, "Firma eingeben"),
    dealerId: z.string().min(3, "Händler-ID eingeben (z.B. TH-DE-0001)"),
    email: z.string().email("Gültige E-Mail eingeben"),
    password: z.string().min(6, "Mindestens 6 Zeichen"),
    confirmPassword: z.string(),
    region: z.string().min(1, "Region wählen"),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const REGIONS = [
    "Deutschland Nord", "Deutschland Süd", "Deutschland West", "Deutschland Ost",
    "Österreich", "Schweiz",
];

export default function RegisterPage() {
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState("");
    const router = useRouter();
    const { register: authRegister, isLoading } = useAuthStore();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        setServerError("");
        const result = await authRegister({
            email: data.email,
            password: data.password,
            name: data.name,
            company: data.company,
            dealerId: data.dealerId,
            region: data.region,
        });
        if (result.success) {
            setSuccess(true);
            setTimeout(() => router.push("/profile"), 2000);
        } else {
            setServerError(result.error || "Registrierung fehlgeschlagen.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D3661] via-[#1a2e52] to-[#0f1e36] p-4">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#3BA9D3]/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#CE132D] rounded-br-2xl rounded-tl-md flex items-center justify-center text-white font-extrabold shadow-lg">T</div>
                        <span className="text-xl font-extrabold text-white">THITRONIK <span className="text-[#3BA9D3] text-sm">Campus 2.0</span></span>
                    </div>
                    <p className="text-white/40 text-sm">Partner-Registrierung</p>
                </div>

                {success ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl text-center">
                            <CardContent className="py-12">
                                <div className="text-6xl mb-4">✅</div>
                                <h2 className="text-xl font-bold text-white mb-2">Registrierung erfolgreich!</h2>
                                <p className="text-white/40 text-sm">Sie werden zum Campus weitergeleitet…</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                        <CardContent className="pt-6 pb-6 px-6">
                            <h2 className="text-lg font-bold text-white text-center mb-1">Partner-Account erstellen</h2>
                            <p className="text-white/40 text-xs text-center mb-5">Ihr THITRONIK Ansprechpartner hat Ihnen eine Händler-ID mitgeteilt.</p>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Name</Label>
                                        <Input {...register("name")} placeholder="Max Mustermann"
                                            className="bg-white/10 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#3BA9D3] text-sm" />
                                        {errors.name && <p className="text-[10px] text-[#CE132D]">{errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Firma</Label>
                                        <Input {...register("company")} placeholder="Autohaus GmbH"
                                            className="bg-white/10 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#3BA9D3] text-sm" />
                                        {errors.company && <p className="text-[10px] text-[#CE132D]">{errors.company.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Händler-ID</Label>
                                        <Input {...register("dealerId")} placeholder="TH-DE-0001"
                                            className="bg-white/10 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#3BA9D3] text-sm font-mono" />
                                        {errors.dealerId && <p className="text-[10px] text-[#CE132D]">{errors.dealerId.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Region</Label>
                                        <select {...register("region")}
                                            className="w-full rounded-md bg-white/10 border border-white/10 text-white text-sm px-3 py-2 focus:ring-2 focus:ring-[#3BA9D3] focus:outline-none">
                                            <option value="" className="bg-[#1D3661]">Wählen…</option>
                                            {REGIONS.map(r => <option key={r} value={r} className="bg-[#1D3661]">{r}</option>)}
                                        </select>
                                        {errors.region && <p className="text-[10px] text-[#CE132D]">{errors.region.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-white/70 text-[10px] font-bold uppercase tracking-wider">E-Mail</Label>
                                    <Input {...register("email")} type="email" placeholder="max@autohaus.de"
                                        className="bg-white/10 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#3BA9D3] text-sm" />
                                    {errors.email && <p className="text-[10px] text-[#CE132D]">{errors.email.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Passwort</Label>
                                        <Input {...register("password")} type="password" placeholder="••••••"
                                            className="bg-white/10 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#3BA9D3] text-sm" />
                                        {errors.password && <p className="text-[10px] text-[#CE132D]">{errors.password.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Bestätigen</Label>
                                        <Input {...register("confirmPassword")} type="password" placeholder="••••••"
                                            className="bg-white/10 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#3BA9D3] text-sm" />
                                        {errors.confirmPassword && <p className="text-[10px] text-[#CE132D]">{errors.confirmPassword.message}</p>}
                                    </div>
                                </div>

                                {serverError && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="text-xs text-[#CE132D] bg-[#CE132D]/10 rounded-lg px-3 py-2">{serverError}</motion.p>
                                )}

                                <Button type="submit" className="w-full bg-[#1D3661] hover:bg-[#294a7a] text-white font-bold py-4" disabled={isLoading}>
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Wird erstellt…
                                        </span>
                                    ) : "Account erstellen"}
                                </Button>
                            </form>

                            <p className="text-center text-white/30 text-xs mt-4">
                                Bereits registriert? <Link href="/login" className="text-[#3BA9D3] hover:underline font-bold">Anmelden</Link>
                            </p>
                        </CardContent>
                    </Card>
                )}
            </motion.div>
        </div>
    );
}
