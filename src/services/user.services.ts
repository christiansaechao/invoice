import { supabase } from "@/lib/supabase-client";

export const getProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        throw new Error(
            "There was an issue trying to retrieve the current users profile: " + error,
        );
    }

    return data;
};

export const updateProfile = async (userId: string, updates: any) => {
    const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

    if (error) {
        throw new Error(
            "There was an issue trying to update the current users profile: " + error,
        );
    }

    return data;
};


export const updateLogo = async (file: File, userId: string) => {
    try {
        const { data, error } = await supabase.storage
            .from('logos')
            .upload(`${userId}/logo.png`, file, {
                upsert: true
            });

        if (error) throw error;
        return data;
    } catch (err) {
        throw new Error("There was in issue uploading your image: " + err);
    }
}

export const getLogo = async (userId: string) => {
    try {
        const { data, error } = await supabase.storage
            .from('logos')
            .createSignedUrl(`${userId}/logo.png`, 600);

        if (error) throw error;
        return data;
    } catch (err) {
        throw new Error("There was in issue getting your logo: " + err);
    }
}