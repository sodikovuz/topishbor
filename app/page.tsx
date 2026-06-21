"use client";

import { useState } from "react";
import PriceGuessGame from "@/components/PriceGuessGame";
import { useGameRoom } from "@/lib/useGameRoom";

type Mode = "menu" | "bot" | "create-room" | "join-room" | "in-room";

export default function Home() {
  const [mode, setMode] = useState<Mode>("menu");
  const [playerName, setPlayerName] = useState("");
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [joinError, setJoinError] = useState("");

  const { room, createRoom, joinRoom } = useGameRoom(playerName || "O'yinchi");

  function handleCreateRoom() {
    if (!playerName.trim()) return;
    createRoom();
    setMode("in-room");
  }

  function handleJoinRoom() {
    const code = joinCodeInput.trim().toUpperCase();
    if (!playerName.trim() || code.length < 4) {
      setJoinError("Ismingizni va to'g'ri kodni kiriting");
      return;
    }
    setJoinError("");
    joinRoom(code, false);
    setMode("in-room");
  }

  if (mode === "bot") {
    return (
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-md mx-auto mb-4">
          <button onClick={() => setMode("menu")} className="text-sm text-gray-500 hover:text-gray-700">
            ← Orqaga
          </button>
        </div>
        <PriceGuessGame />
      </main>
    );
  }

  if (mode === "in-room") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white border border-gray-200 rounded-xl p-6">
          {room ? (
            <>
              <p className="text-sm text-gray-500 mb-1 text-center">Xona kodi</p>
              <p className="text-3xl font-semibold tracking-widest mb-4 text-center">{room.code}</p>
              <p className="text-xs text-gray-500 mb-4 text-center">
                Bu kodni do&apos;stingizga yuboring — u shu kodni &quot;Xonaga qo&apos;shilish&quot; orqali kiritadi.
              </p>
              <div className="border-t border-gray-100 pt-4 mb-4">
                <p className="text-xs text-gray-500 mb-2">Xonadagi o&apos;yinchilar ({room.players.length})</p>
                <div className="flex flex-col gap-2">
                  {room.players.map((p) => (
                    <div key={p.id} className="flex justify-between text-sm bg-gray-50 rounded-md px-3 py-2">
                      <span>{p.name} {p.is_host && <span className="text-xs text-gray-400">(xona egasi)</span>}</span>
                      <span className="text-gray-500">{p.score} ball</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center mb-3">
                Kamida 2 kishi bo&apos;lganda o&apos;yin boshlanishi mumkin
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500 text-center py-6">Xonaga ulanmoqda...</p>
          )}
          <button onClick={() => setMode("menu")} className="w-full text-sm text-gray-500 hover:text-gray-700">
            ← Xonadan chiqish
          </button>
        </div>
      </main>
    );
  }

  if (mode === "create-room") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white border border-gray-200 rounded-xl p-6">
          <label className="text-sm text-gray-500">Ismingiz</label>
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="masalan Murodjon"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-4 text-sm"
            autoFocus
          />
          <button
            onClick={handleCreateRoom}
            disabled={!playerName.trim()}
            className="w-full px-4 py-2 rounded-md bg-black text-white text-sm mb-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Xona yaratish
          </button>
          <button onClick={() => setMode("menu")} className="w-full text-sm text-gray-500 hover:text-gray-700">
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
          <label className="text-sm text-gray-500">Ismingiz</label>
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="masalan Murodjon"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-4 text-sm"
          />
          <label className="text-sm text-gray-500">Xona kodi</label>
          <input
            value={joinCodeInput}
            onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
            placeholder="masalan AB3X9"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-2 text-center tracking-widest text-lg"
            maxLength={6}
          />
          {joinError && <p className="text-xs text-red-600 mb-3">{joinError}</p>}
          <button
            onClick={handleJoinRoom}
            className="w-full px-4 py-2 rounded-md bg-black text-white text-sm mb-3 mt-2"
          >
            Qo&apos;shilish
          </button>
          <button onClick={() => setMode("menu")} className="w-full text-sm text-gray-500 hover:text-gray-700">
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
          onClick={() => setMode("create-room")}
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
