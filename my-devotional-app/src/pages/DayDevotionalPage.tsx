import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronLeft, Check, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournal, useDevotional, useProgress } from '../hooks/useDevotional';
import { Stepper, StepLabels } from '../components/devotional/Stepper';
import { BiblePassage } from '../components/devotional/BiblePassage';
import { TextQuestions } from '../components/devotional/TextQuestions';
import { MeditationQuestions } from '../components/devotional/MeditationQuestions';
import { PrayerSection } from '../components/devotional/PrayerSection';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { formatDate, cn } from '../lib/utils';
import { DEVOTIONAL_STEPS } from '../types';
import type { DevotionalStep } from '../types';

export default function DayDevotionalPage() {
  const { slug, dayNumber } = useParams<{ slug: string; dayNumber: string }>();
  const navigate = useNavigate();
  const day = parseInt(dayNumber || '1', 10);

  const { journal } = useJournal(slug);
  const { devotional, loading, error } = useDevotional(journal?.id, day);
  const { progress, markStep } = useProgress(devotional?.id);

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [completionDismissed, setCompletionDismissed] = useState(false);

  // Reset stepper to step 0 when navigating to a different day
  useEffect(() => {
    setCurrentStep(0);
    setDirection(0);
    setCompletionDismissed(false);
  }, [day]);

  const completedSteps = progress?.completed_steps ?? {
    passage: false,
    textQuestions: false,
    meditation: false,
    prayer: false,
  };

  const showCompletion = Boolean(progress?.is_completed) && !completionDismissed;

  const goToStep = (index: number) => {
    setDirection(index > currentStep ? 1 : -1);
    setCurrentStep(index);
  };

  const handleNext = async () => {
    // Mark current step as completed
    const stepKey = DEVOTIONAL_STEPS[currentStep].key as DevotionalStep;
    await markStep(stepKey, true);

    if (currentStep < DEVOTIONAL_STEPS.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const handleShare = async () => {
    if (navigator.share && devotional) {
      try {
        await navigator.share({
          title: `Ziua ${devotional.day_number}: ${devotional.title}`,
          text: `${devotional.bible_passage_reference} - ${devotional.title}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (error || !devotional) return <ErrorState message={error || 'Devotionalul nu a fost găsit'} />;

  const isLastStep = currentStep === DEVOTIONAL_STEPS.length - 1;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(`/jurnal/${slug}`)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Înapoi</span>
          </button>
          <span className="text-sm font-bold text-slate-800">Ziua {devotional.day_number}</span>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day header */}
      <div className="max-w-lg mx-auto w-full px-5 pt-5 pb-2">
        <h1 className="text-xl font-bold text-slate-800">{devotional.title}</h1>
        <p className="text-sm text-slate-400 mt-1">{formatDate(devotional.date)}</p>
      </div>

      {/* Stepper */}
      <div className="max-w-lg mx-auto w-full px-5">
        <Stepper
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={goToStep}
        />
        <StepLabels currentStep={currentStep} />
      </div>

      {/* Step content */}
      <div className="flex-1 max-w-lg mx-auto w-full px-5 py-4 overflow-x-hidden overflow-y-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {currentStep === 0 && (
              <BiblePassage
                reference={devotional.bible_passage_reference}
                text={devotional.bible_passage_text}
              />
            )}
            {currentStep === 1 && <TextQuestions questions={devotional.text_questions} />}
            {currentStep === 2 && <MeditationQuestions questions={devotional.meditation_questions} />}
            {currentStep === 3 && <PrayerSection prayerText={devotional.prayer_text} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi
          </Button>

          <Button
            variant="primary"
            onClick={isLastStep ? async () => { await handleNext(); } : handleNext}
            className={cn('flex-1', isLastStep && 'bg-[#d4a843] hover:bg-[#b8922e]')}
          >
            {isLastStep ? (
              <>
                <Check className="w-4 h-4" />
                Finalizează
              </>
            ) : (
              <>
                Continuă
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Completion overlay */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setCompletionDismissed(true)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 rounded-full bg-[#d4a843]/15 flex items-center justify-center mx-auto mb-5">
                <Check className="w-10 h-10 text-[#d4a843]" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Felicitări! 🎉</h2>
              <p className="text-slate-500 mb-6">
                Ai completat devotionalul Zilei {devotional.day_number}. Continuă să crești în
                credință!
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate(`/jurnal/${slug}/ziua/${day + 1}`)}
                >
                  Ziua următoare
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate(`/jurnal/${slug}`)}
                >
                  Înapoi la listă
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
