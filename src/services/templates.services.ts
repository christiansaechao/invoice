import { supabase } from "@/lib/supabase-client";

export const getTemplates = async () => {
    try {
        const { data, error } = await supabase
            .from('invoice_templates')
            .select('*')
            .eq('is_active', true);
            
        if (error) throw error;
        return data;
    } catch (err) {
        throw new Error("Failed to fetch templates: " + err);
    }
}
