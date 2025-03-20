import { motion } from 'framer-motion';
import { FloatingElements } from './components/FloatingElements';
import { HeartAnimation } from './components/HeartAnimation';
import { useSupabaseMessages } from './hooks/useSupabase';
import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState("中学・高校時代よりお世話になったお二人が結ばれたことは、なにより特別でありとても感慨深いです。これからの新たな人生も、お互いに支え合いながら、素敵な家庭を築かれることを心よりお祈り申し上げます。\n末永くお幸せに！");
  const { getMessages } = useSupabaseMessages();
  const [effectType, setEffectType] = useState<'cascade' | 'fountain' | 'fireworks' | 'rain'>('cascade');

  useEffect(() => {
    const loadInitialMessage = async () => {
      const initialMessage = await getMessages();
      if (initialMessage) {
        setMessage(initialMessage.content);
      }
    };
    loadInitialMessage();
  }, [getMessages]);

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
        style={{
          backgroundImage: `url("https://qogvnargefvimqlquouc.supabase.co/storage/v1/object/sign/WeddingImage/wedding4.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJXZWRkaW5nSW1hZ2Uvd2VkZGluZzQuanBnIiwiaWF0IjoxNzQyNDg1NDY3LCJleHAiOjIwNTc4NDU0Njd9.Qg6K8Fj4gvH1y_N2f6Zf3ZAWjUyUgOkl1gp7k-HPd6I")`,
        }}
      />
      
      <FloatingElements />

      <div className="relative min-h-screen flex flex-col md:flex-row">
        {/* Left Side - Photo */}
        <motion.div 
          className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
        >
          <motion.img
            src="hhttps://qogvnargefvimqlquouc.supabase.co/storage/v1/object/sign/WeddingImage/IMG_1143.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJXZWRkaW5nSW1hZ2UvSU1HXzExNDMucG5nIiwiaWF0IjoxNzQyNDg1Mzg0LCJleHAiOjIwNTc4NDUzODR9.6J_t1_fReP0dBTqja-Im6KS8sLG6ZtI34FErukSFgqI"
            alt="Wedding couple"
            className="w-full max-w-2xl object-contain"
            style={{ maxHeight: '70vh' }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          />
        </motion.div>

        {/* Right Side - Message */}
        <motion.div 
          className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
        >
          <motion.div 
            className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-xl max-w-lg w-full relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="relative z-10"
            >
              <div className="relative">
                <HeartAnimation />
              </div>
              
              <motion.h1 
                className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: "0.5px"
                }}
              >
                Wishing you a lifetime of love and happiness!
              </motion.h1>
              
              <motion.div 
                className="text-base md:text-lg text-gray-700 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.4 }}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1rem",
                  lineHeight: "1.8"
                }}
              >
                <p className="text-left mb-4">
                  中学・高校時代よりお世話になったお二人が結ばれたことは、なにより特別でありとても感慨深いです。これからの新たな人生も、お互いに支え合いながら、素敵な家庭を築かれることを心よりお祈り申し上げます。
                </p>
                <p className="text-center">
                  末永くお幸せに！
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;