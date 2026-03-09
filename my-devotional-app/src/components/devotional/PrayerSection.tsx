import { motion } from 'framer-motion';

/* Inline SVG – praying hands (palms together) */
function PrayingHandsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Left hand */}
      <path d="M12 2C12 2 9 6 9 10v4l-2.5 3.5" />
      <path d="M9 10c0-3 -1.5-5.5-3-7" />
      <path d="M6 3c1 1.5 2 4 2 7" />
      <path d="M6.5 17.5c-1 .5-2 1.5-2.5 3" />
      {/* Right hand */}
      <path d="M12 2c0 0 3 4 3 8v4l2.5 3.5" />
      <path d="M15 10c0-3 1.5-5.5 3-7" />
      <path d="M18 3c-1 1.5-2 4-2 7" />
      <path d="M17.5 17.5c1 .5 2 1.5 2.5 3" />
      {/* Center line where palms meet */}
      <path d="M12 2v12" strokeDasharray="2 2" opacity="0.5" />
    </svg>
  );
}

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
          <PrayingHandsIcon className="w-5 h-5 text-[#1e3a5f]" />
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
          <p className="text-slate-700 text-[15px] leading-relaxed italic font-serif whitespace-pre-line break-words">
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
