import { HandMetal } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrayerSectionProps {
  prayerText: string;
}

export function PrayerSection({ prayerText }: PrayerSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
          <HandMetal className="w-5 h-5 text-[#1e3a5f]" />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Rugăciune</p>
          <p className="text-sm text-slate-600">Vorbește cu Dumnezeu</p>
        </div>
      </div>

      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#1e3a5f]/5 via-slate-50 to-[#d4a843]/5 border border-[#1e3a5f]/10">
        {/* Decorative quotes */}
        <div className="absolute top-3 left-4 text-5xl text-[#d4a843]/30 font-serif leading-none">
          „
        </div>
        <div className="relative z-10 pt-4">
          <p className="text-slate-700 text-base leading-relaxed italic font-serif whitespace-pre-line">
            {prayerText}
          </p>
        </div>
        <div className="absolute bottom-1 right-6 text-5xl text-[#d4a843]/30 font-serif leading-none">
          "
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 italic">
        Ia un moment de liniște și vorbește cu Dumnezeu din inima ta.
      </p>
    </motion.div>
  );
}
