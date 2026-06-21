"use client";

import { useState } from "react";
import PriceGuessGame from "@/components/PriceGuessGame";

type Mode = "menu" | "bot" | "create-room" | "join-room";

export default function Home() {
  const [mode, setMode] = useState<Mode>("menu");
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");

  function handleCreateRoom() {
    const code = Math.random().toString(36).slice(2, 7).toUpperCase();
    setRoomCode(code);
    setMode("create-room");
  }

  if (mode === "bot") {
    return (
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-md mx-auto mb-4">
          <button
            onClick={() => setMode("menu")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Orqaga
          </button>
        </div>
        <PriceGuessGame />
      </main>
    );
  }

  if (mode === "create-room") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Xona kodi</p>
          <p className="text-3xl font-semibold tracking-widest mb-4">{roomCode}</p>
          <p className="text-sm text-gray-500 mb-6">
            Bu kodni do&apos;stingizga yuboring, u shu kod orqali xonaga qo&apos;shiladi.
          </p>
          <button
            onClick={() => setMode("menu")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Orqaga
          </button>
        </div>
      </main>
    );
  }

  if (mode === "join-room") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white border border-gray-200 rounded-xl p-6">
          <label className="text-sm text-gray-500">Xona kodini kiriting</label>
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="masalan AB3X9"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-4 text-center tracking-widest text-lg"
            maxLength={6}
          />
          <button className="w-full px-4 py-2 rounded-md bg-black text-white text-sm mb-3">
            Qo&apos;shilish
          </button>
          <button
            onClick={() => setMode("menu")}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            ← Orqaga
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-center mb-2">Narx Top</h1>
        <p className="text-sm text-gray-500 text-center mb-4">
          O&apos;zbekiston avtomobil bozoridagi haqiqiy narxlarni taxmin qiling
        </p>

        <button
          onClick={() => setMode("bot")}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-left"
        >
          <p className="font-medium text-sm">Bot bilan o&apos;ynash</p>
          <p className="text-xs text-gray-500">Yakka tartibda, kompyuter raqib bilan</p>
        </button>

        <button
          onClick={handleCreateRoom}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-left"
        >
          <p className="font-medium text-sm">Xona yaratish</p>
          <p className="text-xs text-gray-500">Do&apos;stlaringizni taklif qiling</p>
        </button>

        <button
          onClick={() => setMode("join-room")}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-left"
        >
          <p className="font-medium text-sm">Xonaga qo&apos;shilish</p>
          <p className="text-xs text-gray-500">Kod orqali do&apos;stingizga qo&apos;shiling</p>
        </button>
      </div>
    </main>
  );
}
