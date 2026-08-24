import { motion, AnimatePresence } from 'motion/react';
import { LetterConfig } from '../types';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

interface LetterViewProps {
  letter: LetterConfig;
  onClose: () => void;
}

export function LetterView({ letter, onClose }: LetterViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  // For specific letter interactions
  const [hugsCount, setHugsCount] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [randomMsgIndex, setRandomMsgIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioLoadingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const secretAudioRef = useRef<HTMLAudioElement>(null);
  const secretAudioLoadingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPlayingSecret, setIsPlayingSecret] = useState(false);
  const [isSecretAudioLoading, setIsSecretAudioLoading] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const [audioError, setAudioError] = useState(false);
  const [secretAudioError, setSecretAudioError] = useState(false);

  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const [imagesLoading, setImagesLoading] = useState(false);

  useEffect(() => {
    const photos = letter.photoPaths || (letter.photoPath ? [letter.photoPath] : []);
    if (photos.length > 0) {
      setImagesLoading(true);
      setLoadedImagesCount(0);
      let loaded = 0;
      const total = photos.length;
      const targetLoadCount = Math.max(1, Math.floor(total * 0.8)); // Wait for 80%
      
      photos.forEach(src => {
        const img = new Image();
        img.src = src;
        const onLoadOrError = () => {
          loaded++;
          setLoadedImagesCount(loaded);
          if (loaded >= targetLoadCount) {
             setImagesLoading(false);
          }
        };
        img.onload = onLoadOrError;
        img.onerror = onLoadOrError;
      });
    } else {
      setImagesLoading(false);
    }
  }, [letter]);

  useEffect(() => {
    if (letter.type === 'surprise' && letter.randomMessages) {
      setRandomMsgIndex(Math.floor(Math.random() * letter.randomMessages.length));
    }
  }, [letter]);

  useEffect(() => {
    let timer: any;
    if (letter.type === 'miss' && step === 1 && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (letter.type === 'miss' && step === 1 && countdown === 0) {
      setTimeout(() => setStep(2), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown, letter.type]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        if (isPlayingSecret && secretAudioRef.current) {
           secretAudioRef.current.pause();
           setIsPlayingSecret(false);
        }
        setIsAudioLoading(true);
        audioLoadingTimeout.current = setTimeout(() => {
          setIsAudioLoading(false);
          setAudioError(true);
        }, 12000);
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlayingAudio(true);
          }).catch(e => {
            console.warn("Audio play interrupted:", e);
            setIsPlayingAudio(false);
            setIsAudioLoading(false);
            if (audioLoadingTimeout.current) clearTimeout(audioLoadingTimeout.current);
          });
        } else {
          setIsPlayingAudio(true);
        }
      }
    }
  };

  const toggleSecretAudio = () => {
    if (secretAudioRef.current) {
      const audio = secretAudioRef.current;
      if (isPlayingSecret) {
        audio.pause();
        setIsPlayingSecret(false);
      } else {
        if (isPlayingAudio && audioRef.current) {
           audioRef.current.pause();
           setIsPlayingAudio(false);
        }
        audio.load();
        setIsSecretAudioLoading(true);
        secretAudioLoadingTimeout.current = setTimeout(() => {
          setIsSecretAudioLoading(false);
          setSecretAudioError(true);
        }, 12000);
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlayingSecret(true);
          }).catch(e => {
            console.warn("Audio play interrupted:", e);
            setIsPlayingSecret(false);
            setIsSecretAudioLoading(false);
            if (secretAudioLoadingTimeout.current) clearTimeout(secretAudioLoadingTimeout.current);
            setSecretAudioError(true);
          });
        } else {
          setIsPlayingSecret(true);
        }
      }
    }
  };

  const renderContent = () => {
    switch (letter.type) {
      case 'hugs':
        return (
          <div className="space-y-12 flex flex-col items-center">
            <p className="whitespace-pre-line text-lg leading-relaxed text-center font-serif">
              {letter.content}
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setHugsCount(c => c + 1)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-accent-warm/30 rounded-full text-accent-warm transition-colors"
            >
              [ Ещё одна обнимашка {hugsCount > 0 ? `(${hugsCount + 1})` : ''} ]
            </motion.button>
            
            <AnimatePresence>
              {hugsCount > 0 && (
                <motion.div
                  key={hugsCount}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 text-accent-warm opacity-10"
                >
                  <div className="w-full h-full absolute inset-0 bg-accent-warm/5 mix-blend-screen" />
                  <span className="text-9xl blur-sm">🫂</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case 'sick':
        return (
          <div className="space-y-8">
            <p className="font-serif text-xl text-center mb-8">{letter.content}</p>
            <div className="space-y-4">
              {letter.list?.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex items-center gap-3 text-lg bg-white/5 p-4 rounded-xl"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'miss':
        if (step === 0) {
          return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-white/10 rounded-full font-serif text-xl"
              >
                Закрой глаза на 5 секунд. Нажми, когда закроешь.
              </motion.button>
            </div>
          );
        }
        if (step === 1) {
          return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-8">
              <p className="font-serif text-2xl">Закрой глаза...</p>
              <motion.div 
                key={countdown}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-7xl font-serif text-accent-warm"
              >
                {countdown}
              </motion.div>
            </div>
          );
        }
        
        if (imagesLoading) {
          return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-6">
               <div className="w-12 h-12 border-4 border-accent-warm border-t-transparent rounded-full animate-spin"></div>
               <p className="font-serif text-accent-warm/70">Загружаем фото... ({loadedImagesCount}/{letter.photoPaths?.length || 1})</p>
            </div>
          );
        }

        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="space-y-8 flex flex-col items-center w-full">
            <p className="font-serif text-2xl text-center">
              Ну всё. Представила меня?<br/>Теперь можешь открывать глаза 😌
            </p>
            {letter.photoPaths && letter.photoPaths.length > 0 ? (
              <div className="w-[calc(100%+3rem)] -mx-6 flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-8 hide-scrollbar pointer-events-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                {letter.photoPaths.map((path, idx) => (
                  <div key={idx} className="w-[85%] shrink-0 snap-center flex flex-col items-center">
                    <div 
                      className="w-full aspect-[4/5] bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden relative shadow-2xl cursor-pointer"
                      onClick={() => setSelectedPhotoIndex(idx)}
                    >
                      <img 
                        src={path} 
                        alt={`Photo ${idx + 1}`} 
                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity hover:opacity-100" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.opacity = '0';
                          if (!target.parentElement?.querySelector('.error-fallback')) {
                            target.parentElement?.insertAdjacentHTML('beforeend', '<div class="error-fallback absolute inset-0 flex flex-col items-center justify-center text-white/30"><span class="text-4xl mb-2">📷</span><span class="text-xs text-center px-4">Жду твое фото<br/>' + path + '</span></div>');
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : letter.photoPath ? (
              <img src={letter.photoPath} alt="Photo" className="w-full max-w-sm rounded-xl shadow-2xl opacity-90 border border-white/10" />
            ) : null}
            
            {letter.photoPaths && letter.photoPaths.length > 1 && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 3, duration: 1 }}
                className="text-xs text-text-muted uppercase tracking-widest flex items-center gap-2"
              >
                <span>Листай в сторону</span>
                <span className="text-accent-warm">→</span>
              </motion.p>
            )}
          </motion.div>
        );

      case 'angry':
        if (step === 0) {
          return (
            <div className="flex flex-col items-center h-[50vh] justify-center space-y-8">
              <p className="font-serif text-2xl text-center">Ты уверена, что хочешь это открыть? 😶</p>
              <button onClick={() => setStep(1)} className="px-6 py-2 border border-white/20 rounded-full hover:bg-white/10">[ Да ]</button>
            </div>
          );
        }
        if (step === 1) {
          return (
            <div className="flex flex-col items-center h-[50vh] justify-center space-y-8">
              <p className="font-serif text-2xl text-center">Прям совсем злишься?</p>
              <button onClick={() => {
                setStep(2);
                setTimeout(() => setStep(3), 4000);
              }} className="px-6 py-2 border border-white/20 rounded-full hover:bg-white/10">[ Очень ]</button>
            </div>
          );
        }
        if (step === 2) {
           return (
            <div className="flex flex-col items-center h-[50vh] justify-center space-y-8 text-center">
              <p className="font-serif text-2xl">Ладно, ладно.<br/>Я сначала дам тебе спокойно позлиться.</p>
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-accent-warm text-3xl">...</motion.div>
            </div>
          );
        }
        return (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-line text-lg leading-relaxed font-serif text-center">
            {letter.content}
          </motion.p>
        );
        
      case 'sleep':
        if (step === 0) {
          return (
            <div className="flex flex-col items-center h-[50vh] justify-center space-y-8 text-center">
              <p className="font-serif text-2xl">Сегодня никаких мыслей о проблемах.<br/>Только ты, я и немного тишины.</p>
              <button onClick={() => setStep(1)} className="px-6 py-3 bg-white/5 border border-accent-warm/30 rounded-full text-accent-warm mt-8">
                [ Включить тихий режим ]
              </button>
            </div>
          );
        }
        return (
          <div className="flex flex-col items-center h-[60vh] justify-center text-center px-4 relative">
             <div className="absolute inset-0 bg-bg-main z-[-1] pointer-events-none transition-colors duration-1000" />
             {/* Starry background handled by a wrapper if needed, but we can just use CSS here */}
             <div className="space-y-16">
               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 1 }} className="text-xl font-serif text-white/60">
                 Ты можешь никуда не спешить.
               </motion.p>
               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 6 }} className="text-xl font-serif text-white/60">
                 Завтра будет новый день.
               </motion.p>
               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 11 }} className="text-xl font-serif text-accent-warm">
                 А сейчас просто отдыхай.
               </motion.p>
             </div>
          </div>
        );

      case 'surprise':
        const msg = letter.randomMessages ? letter.randomMessages[randomMsgIndex] : '';
        return (
          <div className="flex items-center justify-center h-[50vh] text-center">
            <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-3xl font-serif italic text-accent-warm">
              "{msg}"
            </motion.p>
          </div>
        );

      case 'photo':
        if (step === 0) {
          return (
            <div className="flex flex-col items-center h-[50vh] justify-center">
              <button onClick={() => setStep(1)} className="px-6 py-3 border border-white/20 rounded-full font-serif text-xl">
                Я хочу показать тебе кое-что. Нажми.
              </button>
            </div>
          );
        }

        if (imagesLoading) {
          return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-6">
               <div className="w-12 h-12 border-4 border-accent-warm border-t-transparent rounded-full animate-spin"></div>
               <p className="font-serif text-accent-warm/70">Загружаем фото...</p>
            </div>
          );
        }

        return (
          <motion.div initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 1.5 }} className="flex flex-col items-center space-y-6">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <img src={letter.photoPath} alt="Photo" className="w-full max-w-sm rounded-xl object-cover" />
            </div>
            <p className="font-serif text-xl text-center italic text-accent-warm">{letter.content}</p>
          </motion.div>
        );

      case 'voice':
        if (step === 0) {
          return (
            <div className="flex flex-col items-center h-[50vh] justify-center">
              <button onClick={() => setStep(1)} className="px-6 py-3 border border-white/20 rounded-full font-serif text-xl">
                Лучше послушай это, чем читай.
              </button>
            </div>
          );
        }
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 pt-8">
            <button disabled={isAudioLoading} className="w-24 h-24 shrink-0 rounded-full bg-accent-warm/10 border border-accent-warm/30 flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(232,184,199,0.15)] hover:bg-accent-warm/20 transition-colors disabled:cursor-wait disabled:opacity-60" onClick={toggleAudio}>
              <span className="text-4xl text-accent-warm ml-2">{isAudioLoading ? '…' : isPlayingAudio ? '⏸' : '▶'}</span>
            </button>
            {isAudioLoading && <p className="text-sm text-accent-warm/70">Загрузка песни...</p>}
            <div className="flex gap-1 items-end h-8">
               {[...Array(12)].map((_, i) => (
                 <motion.div key={i} className="w-1.5 bg-accent-warm/50 rounded-full" animate={{ height: isPlayingAudio ? [8, Math.random() * 24 + 8, 8] : 4 }} transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }} />
               ))}
            </div>

            {letter.id === '12' && (
              <div className="mt-8 flex flex-col items-center space-y-4 pt-8 border-t border-white/5 w-full">
                <button 
                  disabled={isSecretAudioLoading}
                  onClick={toggleSecretAudio}
                  className="px-6 py-4 bg-red-900/20 text-red-200 hover:text-white hover:bg-red-900/40 border border-red-900/50 rounded-full font-serif text-sm transition-all text-center flex items-center justify-center gap-3 w-full max-w-sm shadow-[0_0_15px_rgba(127,29,29,0.2)] disabled:cursor-wait disabled:opacity-60"
                >
                  <span className="text-xl flex-shrink-0">{isSecretAudioLoading ? '…' : isPlayingSecret ? '⏸' : '▶'}</span>
                  <span className="leading-tight">
                    {isSecretAudioLoading ? 'Загружаю голосовое сообщение...' : secretAudioError ? 'Голосовое сообщение не загрузилось' : isPlayingSecret ? 'Остановить сообщение' : 'Послушай, если тебе совсем плохо (только наедине)'}
                  </span>
                </button>
                {isPlayingSecret && (
                  <div className="flex gap-1 items-end h-4">
                    {[...Array(8)].map((_, i) => (
                      <motion.div key={i} className="w-1 bg-red-400/50 rounded-full" animate={{ height: [4, Math.random() * 12 + 4, 4] }} transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {letter.audioPath && <audio ref={audioRef} src={`${letter.audioPath.split('?')[0]}?v=refresh123`} preload="metadata" playsInline type="audio/mpeg" onLoadStart={() => setIsAudioLoading(true)} onCanPlay={() => { setIsAudioLoading(false); if (audioLoadingTimeout.current) clearTimeout(audioLoadingTimeout.current); }} onEnded={() => setIsPlayingAudio(false)} onError={() => { setIsAudioLoading(false); setAudioError(true); if (audioLoadingTimeout.current) clearTimeout(audioLoadingTimeout.current); }} />}
            {letter.id === '12' && <audio ref={secretAudioRef} src="/for_s.mp3?v=refresh123" preload="metadata" playsInline type="audio/mpeg" onLoadStart={() => setIsSecretAudioLoading(true)} onCanPlay={() => { setIsSecretAudioLoading(false); if (secretAudioLoadingTimeout.current) clearTimeout(secretAudioLoadingTimeout.current); }} onEnded={() => setIsPlayingSecret(false)} onError={() => { setIsSecretAudioLoading(false); setSecretAudioError(true); if (secretAudioLoadingTimeout.current) clearTimeout(secretAudioLoadingTimeout.current); }} />}
          </motion.div>
        );

      case 'future':
        return (
          <div className="flex flex-col h-[70vh] items-center text-center space-y-8 relative">
             <div className="absolute inset-0 bg-[#e8dbce]/5 mix-blend-overlay pointer-events-none rounded-xl" />
             <div className="text-sm tracking-[0.2em] text-accent-warm/70 uppercase pt-8">{letter.date}</div>
             <p className="whitespace-pre-line text-xl leading-relaxed font-serif pt-8">
              {letter.content}
            </p>
          </div>
        );

      default:
        // standard, serious, secret, final
        return (
          <div className="space-y-6 mt-4">
             <p className="whitespace-pre-line text-lg md:text-xl leading-relaxed font-serif text-center px-2">
              {letter.content}
            </p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-bg-main overflow-y-auto"
    >
      <div className="max-w-[480px] mx-auto min-h-screen flex flex-col px-6 py-8 relative">
        <button onClick={onClose} className="self-start p-2 text-white/50 hover:text-white mb-8 bg-white/5 rounded-full z-50">
          <ChevronLeft size={24} />
        </button>

        {!isOpen ? (
          <div className="flex-1 flex flex-col items-center justify-center pb-20">
            <motion.div
              layoutId={`envelope-${letter.id}`}
              onClick={() => setIsOpen(true)}
              className="w-48 h-32 bg-bg-card border border-white/10 rounded-lg relative cursor-pointer shadow-2xl flex items-center justify-center group"
            >
              {/* Envelope flap */}
              <div className="absolute top-0 w-full h-1/2 border-b border-white/5 bg-white/[0.02] origin-top rounded-t-lg shadow-sm" />
              <div className="text-5xl z-10 group-hover:scale-110 transition-transform">{letter.icon}</div>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12 text-center font-serif text-xl text-text-muted px-8">
              Нажми на конверт, чтобы открыть
            </motion.p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-12">
              <span className="text-4xl mb-4 block">{letter.icon}</span>
              <h2 className="font-serif text-3xl text-accent-warm">{letter.title}</h2>
            </div>
            
            <div className="flex-1 pb-16">
              {renderContent()}
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox for photos */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && letter.photoPaths && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-bg-main flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <div className="absolute top-6 right-6 text-white/50 text-sm tracking-widest uppercase font-serif z-[101]">
              Закрыть
            </div>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={letter.photoPaths[selectedPhotoIndex]}
              alt={`Fullscreen photo ${selectedPhotoIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Optional: if we want to allow clicking image to NOT close, but closing on click is fine.
            />
            
            {/* Simple Prev/Next overlay zones */}
            {letter.photoPaths.length > 1 && (
              <>
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1/3 flex items-center justify-start p-4 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex(prev => prev! > 0 ? prev! - 1 : letter.photoPaths!.length - 1);
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center text-white backdrop-blur-md border border-white/10 ml-2 md:ml-6">
                    <ChevronLeft />
                  </div>
                </div>
                <div 
                  className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-end p-4 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex(prev => prev! < letter.photoPaths!.length - 1 ? prev! + 1 : 0);
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center text-white backdrop-blur-md border border-white/10 mr-2 md:mr-6 rotate-180">
                    <ChevronLeft />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
