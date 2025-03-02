import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

export const HeartAnimation = () => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [isActive, setIsActive] = useState(false);

  const createHearts = () => {
    const newHearts: FloatingHeart[] = [];
    for (let i = 0; i < 10; i++) {
      newHearts.push({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100
      });
    }
    setHearts([...hearts, ...newHearts]);

    // Remove hearts after animation
    setTimeout(() => {
      setHearts(prev => prev.filter(heart => !newHearts.find(h => h.id === heart.id)));
    }, 1000);
  };

  return (
    <div className="relative flex justify-center mb-6">
      <motion.div 
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-12 bg-pink-100 rounded-full"
        animate={{
          scale: isActive ? 1.2 : 1,
          opacity: isActive ? 0.8 : 0.6
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.div 
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-14 bg-pink-50 rounded-full"
        animate={{
          scale: isActive ? 1.3 : 1,
          opacity: isActive ? 0.6 : 0.4
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      <motion.button
        onTouchStart={() => setIsActive(true)}
        onTouchEnd={() => {
          setIsActive(false);
          createHearts();
        }}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        onClick={createHearts}
        className="relative z-10 bg-transparent border-none p-3 cursor-pointer touch-manipulation"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart 
          className="w-12 h-12 text-pink-500 drop-shadow-lg" 
          fill={isActive ? "currentColor" : "none"}
        />
      </motion.button>
      
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ 
              scale: 0.5,
              opacity: 1,
              x: 0,
              y: 0
            }}
            animate={{ 
              scale: [0.5, 1, 0.5],
              opacity: [1, 1, 0],
              x: heart.x,
              y: [0, -100 + heart.y]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1,
              ease: "easeOut"
            }}
            className="absolute z-0 pointer-events-none"
          >
            <Heart 
              className="w-6 h-6 text-pink-400" 
              fill="currentColor"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};