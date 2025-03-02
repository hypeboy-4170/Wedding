import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingElement {
  id: number;
  x: number;
  delay: number;
  type: 'petal' | 'confetti';
  color: string;
}

export const FloatingElements = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const newElements: FloatingElement[] = [];
    const colors = ['#FFD700', '#FFC0CB', '#FF69B4', '#FFB6C1', '#FFF0F5'];
    
    for (let i = 0; i < 30; i++) {
      newElements.push({
        id: i,
        x: Math.random() * window.innerWidth,
        delay: Math.random() * 5,
        type: Math.random() > 0.5 ? 'petal' : 'confetti',
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          initial={{ 
            y: -20,
            x: element.x,
            opacity: 0,
            scale: 0
          }}
          animate={{
            y: window.innerHeight + 20,
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 6,
            delay: element.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute"
        >
          {element.type === 'petal' ? (
            <div 
              className="w-4 h-4"
              style={{
                backgroundColor: element.color,
                clipPath: "ellipse(50% 100% at 50% 0%)",
                opacity: 0.6
              }}
            />
          ) : (
            <div 
              className="w-2 h-2"
              style={{
                backgroundColor: element.color,
                transform: "rotate(45deg)",
                opacity: 0.6
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};