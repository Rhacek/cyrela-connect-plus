
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Uploads an avatar image to Supabase storage
 * @param file The image file to upload
 * @param userId The user ID to use as the folder name
 * @returns The public URL of the uploaded image or null if upload failed
 */
export const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
  try {
    // Create a unique file name with original extension
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;
    const filePath = fileName;

    // Upload file to the avatars bucket
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true, // Overwrite if file exists
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      toast.error('Erro ao fazer upload da imagem');
      return null;
    }

    // Get the public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadAvatar:', error);
    toast.error('Erro ao fazer upload da imagem');
    return null;
  }
};

/**
 * Updates the user's profile with the avatar URL
 * @param userId The user ID
 * @param avatarUrl The public URL of the avatar
 * @returns A boolean indicating if the update was successful
 */
export const updateProfileAvatar = async (userId: string, avatarUrl: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ profile_image: avatarUrl })
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile avatar:', error);
      toast.error('Erro ao atualizar foto de perfil');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateProfileAvatar:', error);
    toast.error('Erro ao atualizar foto de perfil');
    return false;
  }
};
