import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface BiblePassageProps {
  reference: string;
  text: string;
}

export function BiblePassage({ reference, text }: BiblePassageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      {/* Reference badge */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-[#1e3a5f]" />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Pasaj Biblic</p>
          <p className="text-base font-bold text-[#1e3a5f]">{reference}</p>
        </div>
      </div>

      {/* Passage text */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-[#d4a843] to-[#e8c76b]" />
        <blockquote className="pl-5 pr-1">
          <p className="text-slate-700 text-[15px] leading-relaxed italic font-serif whitespace-pre-line break-words">
            „{text}"
          </p>
        </blockquote>
      </div>
    </motion.div>
  );
}
