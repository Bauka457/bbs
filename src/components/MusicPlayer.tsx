import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

export function MusicPlayer({ isPlaying, toggleMusic }: { isPlaying: boolean, toggleMusic: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && audioRef.current.paused) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.log("Autoplay prevented or interrupted:", e);
          });
        }
      } else if (!isPlaying && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      toggleMusic();
      return;
    }

    audio.play()
      .then(() => toggleMusic())
      .catch(error => {
        console.warn('Audio playback could not start:', error);
      });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-6 bg-gradient-to-t from-[#0F1015] to-transparent pointer-events-none">
      <div className="max-w-[480px] mx-auto pointer-events-auto flex flex-col gap-2">
        <audio 
          ref={audioRef} 
          loop
          preload="none"
          playsInline
          type="audio/mpeg"
          src="/kapkan.mp3?v=refresh123"
        />
        
        <button 
          onClick={handleToggle}
          className="w-full text-left bg-bg-main/80 backdrop-blur-md border border-white/10 rounded-full py-3 px-6 flex items-center justify-between cursor-pointer hover:bg-bg-main/90 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isPlaying ? 'bg-accent-warm text-bg-main' : 'bg-white/10 text-white'}`}>
              {isPlaying ? (
                <div className="flex gap-0.5 ml-0">
                  <div className="w-0.5 h-3 bg-bg-main"></div>
                  <div className="w-0.5 h-3 bg-bg-main"></div>
                </div>
              ) : (
                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-current border-b-[5px] border-b-transparent ml-1"></div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-text-main font-medium leading-none mb-1">Наша Песня</span>
              <span className="text-[9px] text-text-muted leading-none">Нажми, чтобы {isPlaying ? 'остановить' : 'включить'}</span>
            </div>
          </div>
          
          <div className="flex gap-0.5 items-center h-5">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-accent-warm rounded-full"
                initial={{ height: i === 2 ? 12 : 8 }}
                animate={{ height: isPlaying ? [4, 16, 4] : (i === 2 ? 12 : 8) }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </button>
      </div>
    </div>
  );
}
