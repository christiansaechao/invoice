import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ybjcirbcjxjopjxyntoz.supabase.co";
const supabaseKey = "sb_publishable_VY179H8a9PK0-2D3fcfd8Q_tI0IJKtM";

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    const newTemplates = [
        {
            name: "Luxury Editorial",
            description: "Deep contrasting greens with elegant serif typography.",
            slug: "luxury_editorial",
            is_active: true
        },
        {
            name: "Clean Minimalist Spa",
            description: "Soft boxed layouts with premium golden accents.",
            slug: "clean_minimalist",
            is_active: true
        },
        {
            name: "Modern Studio",
            description: "A soft contemporary design with bright cyan overlays.",
            slug: "modern_studio",
            is_active: true
        },
        {
            name: "Botanical / Organic",
            description: "Crisp white styling with dark green pill accents.",
            slug: "botanical",
            is_active: true
        }
    ];

    const { data, error } = await supabase.from('invoice_templates').insert(newTemplates);
    if(error) {
       console.error("Error inserting templates:", error);
    } else {
       console.log("Successfully seeded 4 new templates.");
    }
}
seed();
