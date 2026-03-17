"use client";

import { useState, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, SkipForward } from "lucide-react";
import { useTranslations } from "next-intl";

interface GuessInputProps {
  onGuess: (answer: string) => boolean;
  onSkip: () => void;
  accentColor: string;
  disabled?: boolean;
}

export function GuessInput({
  onGuess,
  onSkip,
  accentColor,
  disabled = false,
}: GuessInputProps) {
  const t = useTranslations("games.wasBinIch");
  const [value, setValue] = useState("");
  const controls = useAnimation();

  const handleSubmit = useCallback(() => {
    if (!value.trim() || disabled) return;

    const isCorrect = onGuess(value);
    if (!isCorrect) {
      // Shake animation on wrong guess
      controls.start({
        x: [-10, 10, -10, 10, 0],
        transition: { duration: 0.4 },
      });
    }
    setValue("");
  }, [value, disabled, onGuess, controls]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div animate={controls} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          id="was-bin-ich-guess"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("inputPlaceholder")}
          disabled={disabled}
          className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-1"
          style={{
            borderColor: `${accentColor}40`,
          }}
          autoComplete="off"
        />
        <Button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="font-bold px-6"
          style={{
            backgroundColor: accentColor,
            color: "#0a1628",
          }}
        >
          <Send className="w-4 h-4 mr-2" />
          {t("guess")}
        </Button>
      </div>

      <Button
        variant="ghost"
        onClick={onSkip}
        disabled={disabled}
        className="text-white/40 hover:text-white/70 hover:bg-white/5 text-sm self-start"
      >
        <SkipForward className="w-4 h-4 mr-1" />
        {t("skip")}
      </Button>
    </motion.div>
  );
}
