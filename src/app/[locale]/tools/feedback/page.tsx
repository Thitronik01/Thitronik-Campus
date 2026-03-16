"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PremiumBackground } from "@/components/layout/premium-background";
import { RoleGuard } from "@/components/auth/role-guard";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Printer, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function FeedbackPage() {
    const formRef = useRef<HTMLFormElement>(null);

    const handlePrint = () => {
        window.print();
    };

    const handleReset = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    return (
        <RoleGuard requiredRole="user">
            <PremiumBackground>
                <div className="container mx-auto py-8 px-4 pb-20">
                    {/* Toolbar */}
                    <div className="max-w-[1080px] mx-auto mb-6 flex flex-wrap justify-between items-center gap-4 no-print">
                        <div className="flex items-center gap-4">
                            <Link href="/tools">
                                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
                                    <ArrowLeft className="w-4 h-4" /> Zurück zu Tools
                                </Button>
                            </Link>
                            <span className="text-xs text-white/50 tracking-wider uppercase hidden sm:inline">THITRONIK Feedbackbogen · Digital</span>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={handleReset} variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
                                <RotateCcw className="w-4 h-4" /> Zurücksetzen
                            </Button>
                            <Button onClick={handlePrint} className="bg-brand-lime text-brand-navy hover:bg-brand-lime/90 font-bold gap-2">
                                <Printer className="w-4 h-4" /> Drucken / PDF
                            </Button>
                        </div>
                    </div>

                    {/* Feedback Form (The "Sheet") */}
                    <form ref={formRef} className="feedback-sheet bg-[#fdfefe] rounded-lg shadow-2xl mx-auto overflow-hidden relative border border-black/5 max-w-[1080px] min-h-[1400px]">
                        {/* Custom styles specifically for this "paper" form to match user's source exactly */}
                        <style jsx>{`
                            .feedback-sheet {
                                --th-blue: #0b3b6f;
                                --th-red: #d51f2d;
                                --th-line: #bfd0e6;
                                --th-text: black;
                                color: var(--th-text);
                                font-family: Arial, Helvetica, sans-serif;
                            }
                            .feedback-sheet::before {
                                content: "";
                                position: absolute;
                                inset: 0;
                                background:
                                    linear-gradient(120deg, rgba(11, 59, 111, 0.04) 0 1px, transparent 1px) 0 0 / 240px 180px,
                                    linear-gradient(30deg, rgba(11, 59, 111, 0.04) 0 1px, transparent 1px) 0 0 / 240px 180px;
                                pointer-events: none;
                                z-index: 0;
                            }
                            .feedback-sheet::after {
                                content: "";
                                position: absolute;
                                right: -120px;
                                top: 180px;
                                width: 500px;
                                height: 500px;
                                border-radius: 50%;
                                border: 2px solid rgba(11, 59, 111, 0.06);
                                box-shadow:
                                    0 0 0 36px rgba(11, 59, 111, 0.03),
                                    0 0 0 82px rgba(11, 59, 111, 0.022),
                                    0 0 0 130px rgba(11, 59, 111, 0.016);
                                pointer-events: none;
                                z-index: 0;
                            }
                            .header-shape {
                                position: absolute;
                                inset: 0 0 auto 0;
                                height: 265px;
                                z-index: 0;
                                pointer-events: none;
                            }
                            .content {
                                position: relative;
                                z-index: 1;
                                padding: 104px 96px 56px;
                            }
                            .title-block {
                                text-align: center;
                                margin-bottom: 40px;
                            }
                            .title-block h1 {
                                margin: 0 0 4px;
                                font-size: 29px;
                                line-height: 1.18;
                                color: var(--th-red);
                                font-weight: 800;
                            }
                            .title-block p {
                                margin: 0;
                                font-size: 24px;
                                line-height: 1.2;
                                color: var(--th-red);
                                font-weight: 800;
                            }
                            .stars {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                gap: 28px;
                                margin: 26px 0 34px;
                            }
                            .stars input {
                                position: absolute;
                                opacity: 0;
                                pointer-events: none;
                            }
                            .star-label {
                                cursor: pointer;
                                display: inline-flex;
                                transition: transform 0.15s ease;
                            }
                            .star-label:hover { transform: translateY(-2px); }
                            .star-label svg {
                                width: 74px;
                                height: 74px;
                                display: block;
                            }
                            .star-label path {
                                fill: transparent;
                                stroke: var(--th-red);
                                stroke-width: 6;
                                transition: fill 0.16s ease;
                            }
                            /* Star Rating Logic */
                            .stars input:checked ~ label path {
                                fill: transparent !important;
                            }
                            .stars input:checked + label path,
                            .stars input:checked + label ~ label path {
                                /* This is tricky in CSS alone with reversed DOM or specific hacks, 
                                   but user's code used a specific selector chain which I'll emulate. */
                            }
                            /* User's specific star logic from HTML */
                            #star1:checked ~ label[for="star1"] path,
                            #star2:checked ~ label[for="star1"] path,
                            #star2:checked ~ label[for="star2"] path,
                            #star3:checked ~ label[for="star1"] path,
                            #star3:checked ~ label[for="star2"] path,
                            #star3:checked ~ label[for="star3"] path,
                            #star4:checked ~ label[for="star1"] path,
                            #star4:checked ~ label[for="star2"] path,
                            #star4:checked ~ label[for="star3"] path,
                            #star4:checked ~ label[for="star4"] path,
                            #star5:checked ~ label[for="star1"] path,
                            #star5:checked ~ label[for="star2"] path,
                            #star5:checked ~ label[for="star3"] path,
                            #star5:checked ~ label[for="star4"] path,
                            #star5:checked ~ label[for="star5"] path {
                                fill: rgba(213, 31, 45, 0.14) !important;
                            }

                            .divider {
                                height: 1px;
                                background: var(--th-line);
                                margin: 24px 0 32px;
                                border: 0;
                            }
                            section h2, .section h2 {
                                margin: 0 0 18px;
                                font-size: 27px;
                                line-height: 1.2;
                                color: black !important;
                                font-weight: bold;
                            }
                            .checkbox-row {
                                display: grid;
                                grid-template-columns: repeat(3, 1fr);
                                gap: 28px;
                            }
                            .check-item {
                                display: inline-flex;
                                align-items: center;
                                gap: 18px;
                                font-size: 22px;
                                color: black !important;
                                cursor: pointer;
                            }
                            .check-item input {
                                position: absolute;
                                opacity: 0;
                            }
                            .check-box {
                                width: 38px;
                                height: 38px;
                                border: 4px solid var(--th-blue);
                                background: white;
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                transition: all 0.16s ease;
                                flex: 0 0 auto;
                            }
                            .check-box::after {
                                content: "";
                                width: 14px;
                                height: 8px;
                                border-left: 3px solid white;
                                border-bottom: 3px solid white;
                                transform: rotate(-45deg);
                                opacity: 0;
                                margin-top: -2px;
                            }
                            .check-item input:checked + .check-box {
                                background: var(--th-blue);
                            }
                            .check-item input:checked + .check-box::after {
                                opacity: 1;
                            }
                            .lined-field {
                                width: 100%;
                                border: 0;
                                outline: none;
                                resize: none;
                                background:
                                    repeating-linear-gradient(
                                        to bottom,
                                        transparent 0,
                                        transparent 33px,
                                        var(--th-line) 33px,
                                        var(--th-line) 35px
                                    );
                                color: black !important;
                                font-family: inherit;
                                font-size: 18px;
                                line-height: 35px;
                                padding: 0;
                                min-height: 105px;
                            }
                            @media print {
                                .no-print { display: none !important; }
                                .feedback-sheet {
                                    box-shadow: none !important;
                                    border: none !important;
                                    max-width: 100% !important;
                                }
                                body { background: white !important; }
                            }
                            @media (max-width: 768px) {
                                .content { padding: 40px 20px; }
                                .checkbox-row { grid-template-columns: 1fr; }
                                .stars { gap: 10px; }
                                .star-label svg { width: 44px; height: 44px; }
                            }
                        `}</style>

                        {/* Blue header triangle */}
                        <svg className="header-shape" viewBox="0 0 1080 265" preserveAspectRatio="none">
                            <path d="M0 0H1080L0 258Z" fill="#0b3b6f"></path>
                        </svg>

                        <div className="content">
                            <div className="title-block">
                                <h1>Wie zufrieden sind Sie mit der Veranstaltung?</h1>
                                <p>Bitte entsprechend die Sterne ausmalen 🙂</p>
                            </div>

                            <div className="stars">
                                <input type="radio" name="rating" id="star1" value="1" />
                                <input type="radio" name="rating" id="star2" value="2" />
                                <input type="radio" name="rating" id="star3" value="3" />
                                <input type="radio" name="rating" id="star4" value="4" />
                                <input type="radio" name="rating" id="star5" value="5" />

                                <label className="star-label" htmlFor="star1">
                                    <svg viewBox="0 0 100 100"><path d="M50 8 62 36 92 39 69 58 75 90 50 73 25 90 31 58 8 39 38 36Z"></path></svg>
                                </label>
                                <label className="star-label" htmlFor="star2">
                                    <svg viewBox="0 0 100 100"><path d="M50 8 62 36 92 39 69 58 75 90 50 73 25 90 31 58 8 39 38 36Z"></path></svg>
                                </label>
                                <label className="star-label" htmlFor="star3">
                                    <svg viewBox="0 0 100 100"><path d="M50 8 62 36 92 39 69 58 75 90 50 73 25 90 31 58 8 39 38 36Z"></path></svg>
                                </label>
                                <label className="star-label" htmlFor="star4">
                                    <svg viewBox="0 0 100 100"><path d="M50 8 62 36 92 39 69 58 75 90 50 73 25 90 31 58 8 39 38 36Z"></path></svg>
                                </label>
                                <label className="star-label" htmlFor="star5">
                                    <svg viewBox="0 0 100 100"><path d="M50 8 62 36 92 39 69 58 75 90 50 73 25 90 31 58 8 39 38 36Z"></path></svg>
                                </label>
                            </div>

                            <hr className="divider" />

                            <section className="section mb-10">
                                <h2 className="mb-6">Aus welchem Bereich kommen Sie?</h2>
                                <div className="checkbox-row">
                                    <label className="check-item">
                                        <span>Werkstatt</span>
                                        <input type="checkbox" name="bereich" value="Werkstatt" />
                                        <span className="check-box"></span>
                                    </label>
                                    <label className="check-item">
                                        <span>Verkauf</span>
                                        <input type="checkbox" name="bereich" value="Verkauf" />
                                        <span className="check-box"></span>
                                    </label>
                                    <label className="check-item">
                                        <span>Service</span>
                                        <input type="checkbox" name="bereich" value="Service" />
                                        <span className="check-box"></span>
                                    </label>
                                </div>
                            </section>

                            <hr className="divider" />

                            <div className="space-y-8">
                                <section className="section">
                                    <h2>Haben Sie Verbesserungsvorschläge?</h2>
                                    <textarea className="lined-field h-3" name="verbesserung"></textarea>
                                </section>

                                <section className="section">
                                    <h2>Welche Themen würden Sie sich in Zukunft wünschen?</h2>
                                    <textarea className="lined-field h-4" name="themen"></textarea>
                                </section>

                                <section className="section">
                                    <h2>Welche Insel hat Ihnen am besten gefallen?</h2>
                                    <textarea className="lined-field h-3" name="insel_feedback"></textarea>
                                </section>

                                <section className="section">
                                    <h2>Würden Sie die Campus Schulung weiterempfehlen? Wenn ja, warum?</h2>
                                    <textarea className="lined-field h-4" name="weiterempfehlung"></textarea>
                                </section>
                            </div>
                        </div>
                    </form>
                </div>
            </PremiumBackground>
        </RoleGuard>
    );
}
