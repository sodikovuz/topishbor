import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Haqiqiy savollarni Supabase questions_bank jadvalidan olish.
// Agar Supabase sozlanmagan bo'lsa (demo holat), bu funksiya xato qaytaradi
// va chaqiruvchi tomon SAMPLE_QUESTIONS'ga qaytadi.
export async function fetchQuestionsFromSupabase(category: string, limit: number) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase sozlanmagan");
  }

  const { data, error } = await supabase
    .from("questions_bank")
    .select("id, title, correct_answer, currency, year, mileage, image_url, brand")
    .eq("category", category)
    .eq("is_active", true)
    .limit(limit * 5); // ko'proq olib, keyin random tanlaymiz

  if (error || !data) {
    throw new Error(error?.message || "Savollar topilmadi");
  }

  const shuffled = data.sort(() => Math.random() - 0.5).slice(0, limit);
  return shuffled.map((row) => ({
    id: row.id,
    brand: row.brand || row.title,
    year: row.year,
    mileage: row.mileage,
    correct_answer: row.correct_answer,
    currency: row.currency || "UZS",
    image_url: row.image_url,
  }));
}
