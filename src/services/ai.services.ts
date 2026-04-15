import { supabase } from "@/lib/supabase-client";

/**
 * extractInvoiceWithAI (client-side proxy)
 * Calls the backend API `POST /api/ai/generate` which performs server-side
 * credit validation, atomic deduction, logging, and the actual AI call.
 * Returns the backend response including `result` and `creditsRemaining`.
 */
export const extractInvoiceWithAI = async (
    promptText: string,
    userId: string,
    availableClients: any[],
    currentHourlyRate: string
) => {
    if (!promptText.trim() || !userId) {
        throw new Error("Missing required parameters for AI extraction.");
    }

    // Prepare a compact context payload for the server to forward to the AI function
    const clientContext = availableClients.map((c) => ({
        id: c.id,
        name: c.company_name || c.contact_name || "Unknown Client",
    }));

    const body = {
        prompt: promptText,
        context: {
            default_rate: parseFloat(currentHourlyRate) || 0,
            available_clients: clientContext,
        },
    };

    // Attach the user's access token so the backend can validate identity if needed
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const apiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "") + "/api/ai/generate";

    const resp = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
    });

    if (resp.status === 402) {
        const json = await resp.json().catch(() => ({}));
        throw new Error(json?.message || "Insufficient Magic AI credits");
    }

    if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        console.error("AI backend error:", resp.status, text);
        throw new Error("The AI service encountered an error. Please try again.");
    }

    const payload = await resp.json();
    // Expect payload: { generationId, result, creditsRemaining }
    return payload;
};