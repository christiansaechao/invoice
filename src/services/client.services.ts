import { supabase } from "@/lib/supabase-client";

export const getDefaultClient = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { data, error } = await supabase
      .from("user_settings")
      .select("default_client_id")
      .eq("user_id", session?.user.id)
      .single();

    if (error) throw error;

    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", data?.default_client_id)
      .single();

    if (clientError) throw clientError;

    return clientData;
  } catch (err) {
    throw new Error("There was in issue getting your default client: " + err);
  }
};

export const setDefaultClient = async (clientId: string) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { data, error } = await supabase
      .from("user_settings")
      .upsert({ user_id: session?.user.id, default_client_id: clientId });

    if (error) throw error;

    return data;
  } catch (err) {
    throw new Error("There was in issue setting your default client: " + err);
  }
};

export const updateClient = async (clientId: string, clientData: any) => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .update(clientData)
      .eq("id", clientId)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      return { success: false, error: error.message || JSON.stringify(error) };
    }

    if (!data || data.length === 0) {
      return { 
        success: false, 
        error: "No client was updated. This usually means you don't have permission (RLS) or the client ID is invalid." 
      };
    }

    return { success: true, data: data[0] };
  } catch (err: any) {
    console.error("Update client exception:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
  }
};

export const archiveClient = async (
  clientId: string,
  isArchived: boolean = true,
) => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .update({ is_archived: isArchived })
      .eq("id", clientId)
      .select();

    if (error) {
      console.error("Supabase archive error:", error);
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { 
        success: false, 
        error: "No client was archived. This usually means you don't have permission (RLS) or the client ID is invalid." 
      };
    }

    return { success: true, data: data[0] };
  } catch (err) {
    console.error("Archive client exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
};
