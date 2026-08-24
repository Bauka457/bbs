import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { lettersData } from './data/letters';
import { Particles } from './components/Particles';
import { MusicPlayer } from './components/MusicPlayer';
import { Home } from './components/Home';
import { EnvelopeGrid } from './components/EnvelopeGrid';
import { LetterView } from './components/LetterView';

export default function App() {
  const [openedIds, setOpenedIds] = useState<string[]>([]);
  const [currentLetterId, setCurrentLetterId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [moonClicks, setMoonClicks] = useState(0);
  const [showFinalScene, setShowFinalScene] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('opened_letters');
    if (saved) {
      try {
        setOpenedIds(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleOpenLetter = (id: string) => {
    setCurrentLetterId(id);
    if (!openedIds.includes(id)) {
      const newOpened = [...openedIds, id];
      setOpenedIds(newOpened);
      localStorage.setItem('opened_letters', JSON.stringify(newOpened));
      
      // Check if all main 12 letters are opened
      const mainLettersCount = lettersData.filter(l => l.id !== '13').length;
      if (newOpened.length >= mainLettersCount) {
        // Will show final scene after closing the last letter
      }
    }
  };

  const handleCloseLetter = () => {
    const was13 = currentLetterId === '13';
    setCurrentLetterId(null);
    
    // Check if we should transition to final scene
    const mainLettersCount = lettersData.filter(l => l.id !== '13').length;
    if (openedIds.length === mainLettersCount && !openedIds.includes('13')) {
      setTimeout(() => setShowFinalScene(true), 500);
    } else if (was13) {
      setTimeout(() => setShowFinalScene(true), 500);
    }
  };

  const handleMoonClick = () => {
    setMoonClicks(c => c + 1);
  };

  const activeLetter = lettersData.find(l => l.id === currentLetterId);
  const totalStandardCount = 12;
  const openedStandardCount = openedIds.filter(id => id !== '13').length;

  return (
    <div className="relative min-h-screen bg-bg-main text-text-main font-sans overflow-x-hidden flex flex-col">
      {/* Background Atmospheric Glow */}
      <div className="absolute w-[600px] h-[600px] bg-accent-warm opacity-[0.03] rounded-full blur-[120px] -top-20 -left-20 pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] bg-accent-warm opacity-[0.02] rounded-full blur-[100px] bottom-0 right-0 pointer-events-none"></div>

      <Particles />
      
      <MusicPlayer isPlaying={musicPlaying} toggleMusic={() => setMusicPlaying(!musicPlaying)} />

      <AnimatePresence mode="wait">
        {!showGrid && !showFinalScene && (
          <motion.div key="home" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="flex-1 flex flex-col">
            <Home 
              openedCount={openedStandardCount} 
              totalCount={totalStandardCount}
              onScrollToGrid={() => setShowGrid(true)} 
            />
          </motion.div>
        )}

        {showGrid && !showFinalScene && (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col pb-24">
            <EnvelopeGrid 
              letters={lettersData.filter(l => l.id !== '13')} 
              openedIds={openedIds}
              onOpenLetter={handleOpenLetter}
              moonClicks={moonClicks}
              onMoonClick={handleMoonClick}
            />
            {openedIds.length >= 12 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex justify-center -mt-16 mb-12 relative z-20"
              >
                <button 
                  onClick={() => setShowFinalScene(true)}
                  className="px-6 py-3 bg-accent-warm/10 text-accent-warm border border-accent-warm/30 rounded-full font-serif text-lg hover:bg-accent-warm/20 transition-colors shadow-lg shadow-black"
                >
                  Финальное послание
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {showFinalScene && (
          <motion.div 
            key="final" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="fixed inset-0 z-30 bg-bg-main flex items-center justify-center p-6 text-center"
          >
            <div className="max-w-[480px] w-full space-y-12">
              <motion.h2 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 2 }}
                className="font-serif text-4xl text-accent-warm"
              >
                ❤️ Ты открыла всё.
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 2, duration: 2 }}
                className="font-serif text-xl leading-relaxed text-white/80"
              >
                Но вообще я оставил тебе эти письма не потому, что хочу, чтобы тебе было грустно.
                <br/><br/>
                Я просто хотел, чтобы даже в такие дни у тебя было место, где тебя любят.
              </motion.p>
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5, duration: 1 }} className="flex flex-col items-center gap-6">
                 <button 
                   onClick={() => handleOpenLetter('13')}
                   className="px-8 py-4 bg-accent-warm/10 hover:bg-accent-warm/20 text-accent-warm border border-accent-warm/30 rounded-full font-serif text-xl transition-colors shadow-[0_0_20px_rgba(232,184,199,0.1)]"
                 >
                   [ Открыть последнее письмо ]
                 </button>

                 {openedIds.includes('13') && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="flex flex-col gap-4 mt-4"
                   >
                     <button 
                       onClick={() => setShowFinalScene(false)}
                       className="text-sm text-text-muted hover:text-white transition-colors uppercase tracking-widest font-sans"
                     >
                       Вернуться к письмам
                     </button>
                     <button 
                       onClick={() => {
                         setOpenedIds([]);
                         localStorage.removeItem('opened_letters');
                         setShowFinalScene(false);
                         setShowGrid(false);
                       }}
                       className="text-sm text-accent-warm/70 hover:text-accent-warm transition-colors uppercase tracking-widest font-sans"
                     >
                       Прочесть всё заново
                     </button>
                   </motion.div>
                 )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeLetter && (
          <LetterView 
            letter={activeLetter} 
            onClose={handleCloseLetter} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
