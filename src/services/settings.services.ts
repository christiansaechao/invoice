import { supabase } from "@/lib/supabase-client";

export const getUserSettings = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return null;

        const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle(); // maybeSingle instead of single so it doesn't hard-error on fresh accounts

        if (error) throw error;
        return data; // Will return null if no settings row exists yet
    } catch (err) {
        throw new Error("There was an issue getting your settings: " + err);
    }
}

export const updateUserSettings = async (updates: {
    default_client_id?: string | null;
    default_template_id?: string;
    logo_url?: string | null;
    payment_link?: string | null;
}) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) throw new Error("No active session.");

        // Grab existing settings first to merge properly, because upsert without full data sets omits to NULL by default in some Supabase configurations unless specifically ignoring.
        const { data: existing } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

        const payload = {
            user_id: session.user.id,
            ...existing,
            ...updates,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('user_settings')
            .upsert(payload, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (err) {
        throw new Error("There was an issue updating your settings: " + err);
    }
}
