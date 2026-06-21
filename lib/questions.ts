export type Question = {
  id: string;
  brand: string;
  year: number | null;
  mileage: number | null;
  correct_answer: number;
  currency: string;
  image_url: string | null;
};

// Bu yerga real questions.json (OLX scraperdan olingan) qo'yiladi.
// Hozircha demo uchun qo'lda yozilgan namunalar.
export const SAMPLE_QUESTIONS: Question[] = [
  { id: "1", brand: "Chevrolet Cobalt", year: 2019, mileage: 50000, correct_answer: 150000000, currency: "UZS", image_url: null },
  { id: "2", brand: "Chevrolet Nexia 3", year: 2018, mileage: 129000, correct_answer: 120050000, currency: "UZS", image_url: null },
  { id: "3", brand: "Daewoo Matiz", year: 2008, mileage: 200000, correct_answer: 25810750, currency: "UZS", image_url: null },
  { id: "4", brand: "Chevrolet Damas", year: 2010, mileage: 250000, correct_answer: 50000000, currency: "UZS", image_url: null },
  { id: "5", brand: "Kia K5", year: 2022, mileage: 45500, correct_answer: 273714000, currency: "UZS", image_url: null },
  { id: "6", brand: "Chevrolet Malibu 2", year: 2021, mileage: 72000, correct_answer: 271313000, currency: "UZS", image_url: null },
  { id: "7", brand: "Chevrolet Tracker", year: 2025, mileage: 18000, correct_answer: 210087500, currency: "UZS", image_url: null },
  { id: "8", brand: "Chevrolet Gentra", year: 2023, mileage: 21000, correct_answer: 166869500, currency: "UZS", image_url: null },
];

export function pickRandomQuestions(count: number): Question[] {
  const shuffled = [...SAMPLE_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
