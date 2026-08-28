import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-ref.supabase.co'
);

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Checks if a string is a valid UUID v4
 */
export function isValidUUID(id: string): boolean {
    if (!id) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
}

/**
 * Generates a standard UUID v4
 */
export function generateUUID(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Uploads a file directly to Supabase Storage bucket 'shaids-assets'.
 * If Supabase is not configured, converts file to Base64 data URL for local storage.
 */
export async function uploadMediaFile(file: File, bucket = 'shaids-assets'): Promise<string> {
    if (isSupabaseConfigured && supabase) {
        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

        if (uploadError) {
            console.error('Supabase Storage Upload Error:', uploadError);
            throw new Error(uploadError.message || 'File upload failed');
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;
    } else {
        // Local Fallback: Convert to Base64 Data URL
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
        });
    }
}

/**
 * Deletes a file from Supabase Storage given its public URL.
 * Automatically cleans up old uploaded photos/brochures to save storage space.
 */
export async function deleteMediaFile(fileUrl?: string, bucket = 'shaids-assets'): Promise<boolean> {
    if (!fileUrl || !isSupabaseConfigured || !supabase) return false;

    try {
        // Check if the URL is from Supabase Storage
        if (!fileUrl.includes(`/storage/v1/object/public/${bucket}/`)) {
            return false;
        }

        // Extract the file path relative to the bucket
        const filePath = fileUrl.split(`/storage/v1/object/public/${bucket}/`)[1];
        if (!filePath) return false;

        const { error } = await supabase.storage.from(bucket).remove([filePath]);
        if (error) {
            console.warn('Failed to delete old file from Supabase Storage:', error);
            return false;
        }

        console.log('Successfully deleted old file from Storage:', filePath);
        return true;
    } catch (err) {
        console.warn('Error deleting old file:', err);
        return false;
    }
}
