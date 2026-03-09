import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TextQuestionsProps {
  questions: string[];
}

export function TextQuestions({ questions }: TextQuestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-[#1e3a5f]" />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Întrebări din Text</p>
          <p className="text-sm text-slate-600">Reflectează asupra pasajului citit</p>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="flex gap-3 p-4 rounded-xl bg-[#1e3a5f]/5 border border-[#1e3a5f]/10"
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center text-sm font-bold">
              {index + 1}
            </span>
            <p className="text-slate-700 text-sm leading-relaxed pt-0.5 break-words min-w-0">{question}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
