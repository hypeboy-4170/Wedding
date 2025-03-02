import { motion } from 'framer-motion';
import { FloatingElements } from './components/FloatingElements';
import { Edit2 } from 'lucide-react';
import { useSupabaseMessages } from './hooks/useSupabase';
import { useState, useEffect } from 'react';
import { HeartAnimation } from './components/HeartAnimation';

function App() {
  const [message, setMessage] = useState("お二人の新しい人生の門出を\n心よりお祝い申し上げます。\n末永くお幸せに。");
  const [isEditing, setIsEditing] = useState(false);
  const { getMessages, updateMessage, loading: messageLoading, error: messageError } = useSupabaseMessages();

  useEffect(() => {
    const loadInitialData = async () => {
      const initialMessage = await getMessages();
      if (initialMessage) {
        setMessage(initialMessage.content);
      }
    };
    loadInitialData();
  }, [getMessages]);

  const handleMessageUpdate = async () => {
    if (!isEditing) return;
    try {
      await updateMessage(message);
      setIsEditing(false);
    } catch (err) {
      console.error('Message update failed:', err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url("https://qogvnargefvimqlquouc.supabase.co/storage/v1/object/public/WeddingImage//wedding4.jpg")`,
        }}
      />
      
      <FloatingElements />

      <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="container mx-auto max-w-6xl flex flex-col items-center gap-8">
          {/* Photo */}
          <motion.div 
            className="w-full max-w-[800px]"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="relative">
              <motion.img
                src="https://qogvnargefvimqlquouc.supabase.co/storage/v1/object/public/WeddingImage//IMG_1143.png"
                alt="Wedding couple"
                className="w-full h-auto object-contain"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
                style={{
                  filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))'
                }}
              />
            </div>
          </motion.div>

          {/* Message */}
          <motion.div 
            className="w-full max-w-[800px] bg-white/80 backdrop-blur-sm rounded-lg shadow-xl p-12"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col"
            >
              <HeartAnimation />
              
              <h1 className="text-4xl font-bold text-gray-800 text-center mb-10 font-serif">
                ご結婚おめでとうございます
              </h1>
              
              <div className="mb-10">
                {isEditing ? (
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onBlur={handleMessageUpdate}
                    className="w-full min-h-[200px] p-6 border rounded-md text-2xl text-gray-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-pink-500"
                    autoFocus
                  />
                ) : (
                  <div className="relative group">
                    <p className="text-2xl text-gray-700 leading-relaxed whitespace-pre-line">
                      {message}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                      disabled={messageLoading}
                    >
                      <Edit2 className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>
              
              {messageError && (
                <div className="text-red-600 text-sm mb-4">
                  {messageError}
                </div>
              )}
              
              <p className="text-right text-gray-600 italic text-xl">
                2024年3月吉日
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;