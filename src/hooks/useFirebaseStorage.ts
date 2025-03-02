import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { storage } from '../firebase';

export const useFirebaseStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError(null);
      
      const storageRef = ref(storage, `wedding-photos/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アップロードに失敗しました');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
};