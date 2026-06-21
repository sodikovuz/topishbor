"use client";

import { useState, useEffect, useCallback } from "react";
import { pickRandomQuestions, Question } from "@/lib/questions";
import { fetchQuestionsFromSupabase } from "@/lib/supabase";
import { botGuess, scoreRound, BotDifficulty } from "@/lib/bot";

const ROUNDS = 5;

type RoundResult = {
  question: Question;
  yourGuess: number;
  botGuessValue: number;
  winner: "you" | "bot" | "draw";
};

export default function PriceGuessGame() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [roundIndex, setRoundIndex] = useState(0);
  const [guessInput, setGuessInput] = useState("");
  const [results, setResults] = useState<RoundResult[]>([]);
  const [showingResult, setShowingResult] = useState(false);
  const [difficulty, setDifficulty] = useState<BotDifficulty>("orta");
  const [finished, setFinished] = useState(false);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const real = await fetchQuestionsFromSupabase("avto", ROUNDS);
      setQuestions(real);
    } catch {
      setQuestions(pickRandomQuestions(ROUNDS));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const currentQuestion = questions[roundIndex];

  function submitGuess() {
    const yourGuess = parseInt(guessInput, 10);
    if (!yourGuess || yourGuess <= 0 || !currentQuestion) return;

    const bot = botGuess(currentQuestion.correct_answer, difficulty);
    const winner = scoreRound(yourGuess, bot, currentQuestion.correct_answer);

    setResults((prev) => [
      ...prev,
      { question: currentQuestion, yourGuess, botGuessValue: bot, winner },
    ]);
    setShowingResult(true);
  }

  function nextRound() {
    setShowingResult(false);
    setGuessInput("");
    if (roundIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setRoundIndex((i) => i + 1);
    }
  }

  function restart() {
    setRoundIndex(0);
    setResults([]);
    setShowingResult(false);
    setGuessInput("");
    setFinished(false);
    loadQuestions();
  }

  function fmt(n: number) {
    return new Intl.NumberFormat("ru-RU").format(Math.round(n)) + " so'm";
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Yuklanmoqda...</div>;
  }

  const scoreYou = results.filter((r) => r.winner === "you").length;
  const scoreBot = results.filter((r) => r.winner === "bot").length;

  if (finished) {
    const message =
      scoreYou > scoreBot
        ? `Siz g'alaba qozondingiz! ${scoreYou} - ${scoreBot}`
        : scoreBot > scoreYou
          ? `Bot g'alaba qozondi. ${scoreBot} - ${scoreYou}`
          : `Durang! ${scoreYou} - ${scoreBot}`;

    return (
      <div className="max-w-md mx-auto text-center py-10 px-6 bg-gray-50 rounded-xl">
        <p className="text-xl font-medium mb-6">{message}</p>
        <button
          onClick={restart}
          className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
        >
          Qaytadan o&apos;ynash
        </button>
      </div>
    );
  }

  const lastResult = results[results.length - 1];

  return (
    <div className="max-w-md mx-auto flex flex-col gap-4">
      <div className="flex justify-between items-center text-sm">
        <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-600">
          {roundIndex + 1}-savol / {questions.length}
        </span>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-md bg-blue-50 text-blue-700">Siz: {scoreYou}</span>
          <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-600">Bot: {scoreBot}</span>
        </div>
      </div>

      {!showingResult && (
        <div className="flex justify-end">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as BotDifficulty)}
            className="text-xs border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="oson">Bot: oson</option>
            <option value="orta">Bot: o&apos;rta</option>
            <option value="qiyin">Bot: qiyin</option>
          </select>
        </div>
      )}

      <div className="border border-gray-200 rounded-xl p-5 bg-white">
        {!showingResult ? (
          <>
            <p className="font-medium text-base mb-1">{currentQuestion.brand}</p>
            <p className="text-sm text-gray-500 mb-4">
              {currentQuestion.year ? `${currentQuestion.year}-yil, ` : ""}
              {currentQuestion.mileage != null
                ? `${new Intl.NumberFormat("ru-RU").format(currentQuestion.mileage)} km bosgan`
                : "probeg noma'lum"}{" "}
              — hozir necha pulga sotiladi?
            </p>
            <label className="text-xs text-gray-500">Sizning taxminingiz (so&apos;mda)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitGuess()}
                placeholder="masalan 90000000"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                autoFocus
              />
              <button
                onClick={submitGuess}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition text-sm"
              >
                Tasdiqlash
              </button>
            </div>
          </>
        ) : (
          lastResult && (
            <div className="flex flex-col gap-3">
              <Row label="Haqiqiy narx" value={fmt(lastResult.question.correct_answer)} />
              <Row label="Sizning taxminingiz" value={fmt(lastResult.yourGuess)} />
              <Row label="Bot taxmini" value={fmt(lastResult.botGuessValue)} />
              <div
                className={`text-sm font-medium px-3 py-2 rounded-md ${
                  lastResult.winner === "you"
                    ? "bg-green-50 text-green-700"
                    : lastResult.winner === "bot"
                      ? "bg-red-50 text-red-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {lastResult.winner === "you"
                  ? "Siz yutdingiz bu raundda!"
                  : lastResult.winner === "bot"
                    ? "Bot yutdi bu raundda."
                    : "Durang!"}
              </div>
              <button
                onClick={nextRound}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition text-sm self-start"
              >
                Keyingisi →
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
