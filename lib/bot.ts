// Bot psixologik "ishonchlilik" darajasi: real narxdan tasodifiy chetlanish.
// Qiyinlik darajasiga qarab bot xato qilish ehtimoli oshadi/kamayadi.

export type BotDifficulty = "oson" | "orta" | "qiyin";

const ERROR_RANGE: Record<BotDifficulty, [number, number]> = {
  // [min, max] nisbiy xato ulushi, masalan -0.1..0.6 = haqiqiy narxdan 10% kam - 60% ko'p
  oson: [-0.05, 0.7],
  orta: [-0.1, 0.5],
  qiyin: [-0.05, 0.25],
};

export function botGuess(realPrice: number, difficulty: BotDifficulty = "orta"): number {
  const [min, max] = ERROR_RANGE[difficulty];
  const errorRatio = min + Math.random() * (max - min);
  const guess = Math.round(realPrice * (1 + errorRatio));
  return Math.max(1_000_000, guess);
}

export function scoreRound(
  yourGuess: number,
  botGuessValue: number,
  realPrice: number
): "you" | "bot" | "draw" {
  const yourDiff = Math.abs(yourGuess - realPrice);
  const botDiff = Math.abs(botGuessValue - realPrice);
  if (yourDiff < botDiff) return "you";
  if (botDiff < yourDiff) return "bot";
  return "draw";
}
