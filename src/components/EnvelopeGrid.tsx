import { motion } from 'motion/react';
import { LetterConfig } from '../types';

interface GridProps {
  letters: LetterConfig[];
  openedIds: string[];
  onOpenLetter: (id: string) => void;
  moonClicks: number;
  onMoonClick: () => void;
}

export function EnvelopeGrid({ letters, openedIds, onOpenLetter, moonClicks, onMoonClick }: GridProps) {
  const visibleLetters = letters.filter(l => 
    !l.isHidden || 
    (l.id === '9' && (moonClicks >= 3 || openedIds.includes('9')))
  );

  return (
    <div className="flex-1 w-full px-6 py-12 pb-32 max-w-[480px] mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="grid grid-cols-2 gap-3 pb-8 relative"
      >
        {visibleLetters.map((letter, i) => {
          const isOpened = openedIds.includes(letter.id);
          
          return (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              onClick={() => onOpenLetter(letter.id)}
              className={`
                p-4 rounded-2xl flex flex-col items-center justify-center text-center aspect-[4/5] cursor-pointer
                transition-all duration-300
                ${isOpened 
                  ? 'bg-white/5 border border-accent-warm/20' 
                  : 'bg-bg-main border border-white/5 opacity-90 hover:opacity-100 hover:border-white/10'
                }
              `}
            >
              <div className={`text-2xl ${isOpened ? 'mb-2' : 'mb-3 opacity-60'}`}>
                {letter.icon}
              </div>
              
              {isOpened && (
                <span className="text-[10px] text-accent-warm uppercase tracking-tighter font-bold mb-1">
                  Прочитано
                </span>
              )}
              
              <h3 className={`text-[12px] leading-tight ${isOpened ? 'text-text-main' : 'text-text-muted'}`}>
                {letter.title.replace('Открой, ', '')}
              </h3>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Hidden moon for secret letter */}
      {moonClicks < 3 && !openedIds.includes('9') && (
        <div className="flex justify-center mt-12 mb-8">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onMoonClick}
            className="text-white/20 text-xs hover:text-white/40 transition-colors flex items-center gap-2"
          >
            <span>Тут есть ещё кое-что. Но я спрятал это.</span>
            <span className="text-lg">🌙</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}
