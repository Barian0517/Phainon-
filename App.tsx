import React, { useState, useEffect, useRef } from 'react';
import { CRTOverlay } from './components/CRTOverlay';
import { audioService } from './services/audioService';

// Define the stages of the animation
enum Stage {
  INITIAL_TYPE, // Typing "Press any key..."
  WAITING,      // Waiting for user input
  DELETING,     // Deleting "Press any key..."
  FINAL_TYPE,   // Typing "明天見"
  FINISHED      // Done
}

// Removed the hardcoded underscore from intro text so it doesn't double up with the cursor
const TEXT_INTRO = "Press any key to continue";
const TEXT_OUTRO = "刻法勒，永志不忘";

// Typing speeds in ms
const TYPE_SPEED = 50;
const DELETE_SPEED = 30;
const FINAL_TYPE_SPEED = 150;

const App: React.FC = () => {
  const [stage, setStage] = useState<Stage>(Stage.INITIAL_TYPE);
  const [displayText, setDisplayText] = useState('');
  
  // Audio started flag to prevent multiple inits
  const audioStarted = useRef(false);

  // --- Animation Loop Logic ---
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleTypeLogic = () => {
      // 1. Typing the intro text
      if (stage === Stage.INITIAL_TYPE) {
        if (displayText.length < TEXT_INTRO.length) {
          const nextChar = TEXT_INTRO.charAt(displayText.length);
          
          // Realistic Typing Logic:
          // Pause significantly at spaces (word boundaries).
          // Add slight randomness to normal keys.
          let delay = TYPE_SPEED + Math.random() * 30; // Base variance
          
          if (nextChar === ' ') {
            delay = 450; // Pause ~0.45s at spaces
          }

          timeoutId = setTimeout(() => {
            setDisplayText(TEXT_INTRO.slice(0, displayText.length + 1));
          }, delay);
        } else {
          setStage(Stage.WAITING);
        }
      }

      // 2. Deleting the intro text
      if (stage === Stage.DELETING) {
        if (displayText.length > 0) {
          // Deleting is mechanically consistent and fast
          timeoutId = setTimeout(() => {
            setDisplayText(displayText.slice(0, -1));
          }, DELETE_SPEED);
        } else {
          setStage(Stage.FINAL_TYPE);
        }
      }

      // 3. Typing the final text
      if (stage === Stage.FINAL_TYPE) {
        if (displayText.length < TEXT_OUTRO.length) {
          const nextChar = TEXT_OUTRO.charAt(displayText.length);
          
          // Pause for punctuation in the final dramatic text
          let delay = FINAL_TYPE_SPEED;
          
          if (nextChar === '，' || nextChar === ' ' || nextChar === ',') {
             delay = 800; // Dramatic pause for comma
          }

          timeoutId = setTimeout(() => {
            setDisplayText(TEXT_OUTRO.slice(0, displayText.length + 1));
          }, delay);
        } else {
          setStage(Stage.FINISHED);
        }
      }
    };

    handleTypeLogic();

    return () => clearTimeout(timeoutId);
  }, [displayText, stage]);


  // --- User Interaction Handler ---
  const handleInteraction = () => {
    if (stage === Stage.WAITING) {
      if (!audioStarted.current) {
        audioService.start();
        audioStarted.current = true;
      }
      setStage(Stage.DELETING);
    }
  };

  // Setup global event listener for "Press any key"
  useEffect(() => {
    const handler = () => handleInteraction();
    
    if (stage === Stage.WAITING) {
      window.addEventListener('keydown', handler);
      window.addEventListener('click', handler);
      window.addEventListener('touchstart', handler);
    }

    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('click', handler);
      window.removeEventListener('touchstart', handler);
    };
  }, [stage]);

  // --- Determine Text Color/Style based on content ---
  // Updated to Gold (#FFD700)
  const textColorClass = "text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]";

  return (
    <div 
      className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center font-['VT323'] selection:bg-yellow-900 selection:text-white"
      onClick={handleInteraction} // Fallback interaction
    >
      <CRTOverlay />

      <div className="z-10 text-center px-4 relative">
        <h1 className={`text-4xl md:text-6xl tracking-widest ${textColorClass}`}>
          {displayText}
          {/* Blinking Underscore Cursor */}
          <span className={`inline-block ml-1 ${textColorClass} cursor-blink`}>_</span>
        </h1>
        
        {/* Optional hint if user waits too long */}
        {stage === Stage.WAITING && (
          <div className="absolute bottom-[-50px] left-0 right-0 text-center opacity-30 text-xs text-[#FFD700] font-sans tracking-widest animate-pulse">
            [ WAITING FOR SIGNAL ]
          </div>
        )}
      </div>

      {/* Decorative Grid Background (Subtle) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

      {/* Footer Author Credit */}
      <div className="absolute bottom-4 text-[10px] text-[#FFD700] opacity-40 font-sans tracking-wider pointer-events-none z-20">
        © 2025. Made by <a href="https://barian.moe" target="_blank" rel="noopener noreferrer" className="pointer-events-auto underline hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>幽影櫻</a>
      </div>
    </div>
  );
};

export default App;