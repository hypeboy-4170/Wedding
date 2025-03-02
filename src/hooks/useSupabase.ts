import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabasePhotos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : '写真の取得に失敗しました');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addPhoto = async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('photos')
        .insert([{ url }])
        .select()
        .single();

      if (err) throw err;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : '写真の追加に失敗しました');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getPhotos, addPhoto, loading, error };
};

export const useSupabaseMessages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (err) throw err;
      return data[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'メッセージの取得に失敗しました');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateMessage = async (content: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data: existingMessages } = await supabase
        .from('messages')
        .select('*')
        .limit(1);

      let result;
      if (existingMessages && existingMessages.length > 0) {
        const { data, error: err } = await supabase
          .from('messages')
          .update({ content })
          .eq('id', existingMessages[0].id)
          .select()
          .single();
        
        if (err) throw err;
        result = data;
      } else {
        const { data, error: err } = await supabase
          .from('messages')
          .insert([{ content }])
          .select()
          .single();
        
        if (err) throw err;
        result = data;
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'メッセージの更新に失敗しました');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getMessages, updateMessage, loading, error };
};