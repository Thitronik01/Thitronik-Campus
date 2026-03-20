"use client";

import { useState } from "react";
import { ChronikEntry, ChronikImage } from "@/types/chronik";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChronikCommentSection } from "./chronik-comment-section";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ChronikTimelineProps {
  entries: ChronikEntry[];
  currentUserId?: string;
  locale: string;
}

export function ChronikTimeline({ entries, currentUserId, locale }: ChronikTimelineProps) {
  const t = useTranslations("Chronik");
  const [activeYear, setActiveYear] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<{ image: ChronikImage, entry: ChronikEntry } | null>(null);

  const years = Array.from(new Set(entries.map((e) => e.year.toString()))).sort((a, b) => b.localeCompare(a));
  const filteredEntries = activeYear === "all" ? entries : entries.filter((e) => e.year.toString() === activeYear);

  const handlePrevImage = () => {
      if (!selectedImage) return;
      const allImages = selectedImage.entry.images;
      const currentIndex = allImages.findIndex(img => img.id === selectedImage.image.id);
      const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
      setSelectedImage({ image: allImages[prevIndex], entry: selectedImage.entry });
  };

  const handleNextImage = () => {
      if (!selectedImage) return;
      const allImages = selectedImage.entry.images;
      const currentIndex = allImages.findIndex(img => img.id === selectedImage.image.id);
      const nextIndex = (currentIndex + 1) % allImages.length;
      setSelectedImage({ image: allImages[nextIndex], entry: selectedImage.entry });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic"
        >
          Campus <span className="text-brand-sky">Chronik</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-lg max-w-2xl mx-auto"
        >
            {t("subtitle", { count: entries.length })}
        </motion.p>
      </div>

      <div className="flex justify-center">
        <Tabs value={activeYear} onValueChange={setActiveYear} className="w-full">
          <div className="flex justify-center mb-12">
              <TabsList className="bg-brand-navy/50 border border-white/10 p-1 rounded-full h-auto flex-wrap justify-center gap-1 backdrop-blur-md">
                <TabsTrigger value="all" className="rounded-full px-6 py-2 data-[state=active]:bg-brand-sky data-[state=active]:text-brand-navy font-bold transition-all">
                  {t("years")}
                </TabsTrigger>
                {years.map((year) => (
                  <TabsTrigger key={year} value={year} className="rounded-full px-6 py-2 data-[state=active]:bg-brand-sky data-[state=active]:text-brand-navy font-bold transition-all">
                    {year}
                  </TabsTrigger>
                ))}
              </TabsList>
          </div>

          <div className="relative border-l-4 border-brand-sky/20 ml-4 md:ml-12 pl-8 md:pl-16 space-y-24 py-8">
            <AnimatePresence mode="wait">
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index % 5 * 0.1 }}
                  className="relative"
                >
                  {/* Year marker */}
                  <div className="absolute -left-[calc(2rem+12px)] md:-left-[calc(4rem+12px)] top-0 flex items-center justify-center w-12 h-12 rounded-full bg-brand-navy border-4 border-brand-sky text-brand-sky font-black text-lg shadow-[0_0_20px_rgba(0,210,255,0.4)] z-10 transition-transform hover:scale-110">
                    {entry.year.toString().slice(-2)}
                  </div>

                  <div className="bg-gradient-to-br from-brand-navy/90 to-brand-navy/50 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-10 border border-white/10 shadow-2xl space-y-8 relative overflow-hidden group/card shadow-brand-sky/5">
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-sky/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
                    
                    <div className="space-y-4">
                        <div className="flex items-baseline gap-4">
                             <span className="text-5xl md:text-6xl font-black text-brand-sky/10 select-none leading-none">{entry.year}</span>
                             <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic leading-none">{entry.title}</h3>
                        </div>
                        {entry.description && (
                            <p className="text-white/70 leading-relaxed text-lg md:text-xl font-medium max-w-3xl">{entry.description}</p>
                        )}
                    </div>

                    {entry.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {entry.images.map((image) => (
                                <div
                                    key={image.id}
                                    className="group relative aspect-video rounded-2xl overflow-hidden border border-white/20 cursor-pointer shadow-lg transition-all hover:shadow-brand-sky/20 hover:border-brand-sky/50"
                                    onClick={() => setSelectedImage({ image, entry })}
                                >
                                    <Image
                                        src={image.publicUrl || "/placeholder.jpg"}
                                        alt={image.caption || t("image_alt")}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-brand-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-md border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            <Maximize2 className="text-white w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {entry.video_url && (
                        <div className="aspect-video rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative group/video">
                             <iframe
                                src={entry.video_url.replace("watch?v=", "embed/")}
                                className="w-full h-full"
                                allowFullScreen
                            />
                        </div>
                    )}

                    <div className="pt-6 border-t border-white/10">
                        <ChronikCommentSection
                            chronikId={entry.id}
                            comments={entry.comments}
                            currentUserId={currentUserId}
                            locale={locale}
                        />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Tabs>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 bg-brand-navy/95 border-none overflow-hidden flex flex-col items-center justify-center backdrop-blur-xl">
             <div className="relative w-full h-full flex items-center justify-center p-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-6 right-6 z-50 text-white hover:bg-white/10 rounded-full h-12 w-12 border border-white/10"
                    onClick={() => setSelectedImage(null)}
                >
                    <X className="w-6 h-6" />
                </Button>

                <AnimatePresence mode="wait">
                    {selectedImage && (
                        <motion.div
                            key={selectedImage.image.id}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full h-full flex flex-col items-center justify-center gap-6"
                        >
                            <div className="relative w-full flex-grow max-h-[75vh] shadow-2xl rounded-2xl overflow-hidden border border-white/10">
                                <Image
                                    src={selectedImage.image.publicUrl || "/placeholder.jpg"}
                                    alt={selectedImage.image.caption || ""}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            {selectedImage.image.caption && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-white text-center"
                                >
                                    <p className="bg-brand-sky/20 px-8 py-3 rounded-full border border-brand-sky/30 backdrop-blur-md text-lg font-bold">
                                        {selectedImage.image.caption}
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-8 pointer-events-none">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handlePrevImage} 
                        className="pointer-events-auto h-14 w-14 bg-brand-navy/80 border-white/20 text-white hover:bg-brand-sky hover:text-brand-navy rounded-full shadow-lg"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </Button>
                    <span className="pointer-events-auto text-white font-mono bg-brand-navy/90 px-6 py-2 rounded-full border border-white/20 text-sm font-bold shadow-lg">
                        {(selectedImage?.entry.images.findIndex(img => img.id === selectedImage.image.id) || 0) + 1} / {selectedImage?.entry.images.length}
                    </span>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleNextImage} 
                        className="pointer-events-auto h-14 w-14 bg-brand-navy/80 border-white/20 text-white hover:bg-brand-sky hover:text-brand-navy rounded-full shadow-lg"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </Button>
                </div>
             </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
