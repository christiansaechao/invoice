import { supabase } from "@/lib/supabase-client";

export const getDefaultClient = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        const { data, error } = await supabase
            .from('user_settings')
            .select('default_client_id')
            .eq('user_id', session?.user.id)
            .single();

        if (error) throw error;

        const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .select('*')
            .eq('id', data?.default_client_id)
            .single();

        if (clientError) throw clientError;

        return clientData;
    } catch (err) {
        throw new Error("There was in issue getting your default client: " + err);
    }
}

export const setDefaultClient = async (clientId: string) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        const { data, error } = await supabase
            .from('user_settings')
            .upsert({ user_id: session?.user.id, default_client_id: clientId });

        if (error) throw error;

        return data;
    } catch (err) {
        throw new Error("There was in issue setting your default client: " + err);
    }
}