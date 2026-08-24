import { motion } from 'motion/react';

interface HomeProps {
  openedCount: number;
  totalCount: number;
  onScrollToGrid: () => void;
}

export function Home({ openedCount, totalCount, onScrollToGrid }: HomeProps) {
  const text1 = "Я оставил тебе";
  const text2 = "несколько писем.";
  
  return (
    <div className="flex-1 flex flex-col justify-center px-8 relative max-w-[480px] mx-auto z-10 pt-20">
      <div className="pt-8 pb-4 text-center mb-8">
        <h1 className="font-serif text-[28px] leading-tight mb-3 italic">
          {text1.split(' ').map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: i * 0.15, duration: 1 }}
              className="inline-block mr-2"
            >
              {word}
            </motion.span>
          ))}
          <br />
          {text2.split(' ').map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.5 + i * 0.15, duration: 1 }}
              className="inline-block mr-2 text-accent-warm"
            >
              {word}
            </motion.span>
          ))}
        </h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-[13px] text-text-muted leading-relaxed px-4"
        >
          На случай, если меня сейчас нет рядом. Выбери то, что тебе сейчас нужно.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="w-full mt-auto mb-24"
      >
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[11px] text-text-muted uppercase tracking-widest">Коллекция</span>
            <span className="text-[11px] text-accent-warm font-medium">{openedCount} / {totalCount} открыто</span>
          </div>
          <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-accent-warm rounded-full"
              style={{ boxShadow: '0 0 8px #E8B8C7' }}
              initial={{ width: 0 }}
              animate={{ width: `${(openedCount / totalCount) * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>
        
        <div className="flex justify-center mt-12">
          <motion.button
            onClick={onScrollToGrid}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-white/30 hover:text-white/60 p-4 rounded-full"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
