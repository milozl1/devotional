import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface MeditationQuestionsProps {
  questions: string[];
}

export function MeditationQuestions({ questions }: MeditationQuestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-[#d4a843]/15 flex items-center justify-center">
          <Heart className="w-5 h-5 text-[#b8922e]" />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Meditație</p>
          <p className="text-sm text-slate-600">Interiorizează Cuvântul lui Dumnezeu</p>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="p-4 rounded-xl bg-gradient-to-r from-[#d4a843]/10 to-[#e8c76b]/10 border border-[#d4a843]/20"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#d4a843] mt-2" />
              <p className="text-slate-700 text-sm leading-relaxed italic break-words min-w-0">{question}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
