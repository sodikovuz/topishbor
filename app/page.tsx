"use client";

import { useState } from "react";
import PriceGuessGame from "@/components/PriceGuessGame";
import { useGameRoom } from "@/lib/useGameRoom";

type Mode = "menu" | "bot" | "create-room" | "join-room" | "in-room";

function BackgroundDecor() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1020] via-[#151233] to-[#1a0f2e]" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl" />
    </div>
  );
}

function Logo() {
  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      <div className="text-5xl animate-float select-none">🚗</div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
        Narx Top
      </h1>
      <p className="text-sm text-white/50 text-center max-w-xs">
        O&apos;zbekiston avtomobil bozoridagi haqiqiy narxlarni taxmin qiling
      </p>
    </div>
  );
}

function MenuCard({
  icon,
  title,
  subtitle,
  onClick,
  accent,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      className="glass w-full rounded-2xl p-4 flex items-center gap-4 text-left transition-all hover:bg-white/10 hover:scale-[1.02] hover:border-white/20 active:scale-[0.98]"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
        style={{ background: accent }}
      >
        {icon}
      </div>
      <div>
        <p className="font-semibold text-white text-sm">{title}</p>
        <p className="text-xs text-white/50">{subtitle}</p>
      </div>
      <div className="ml-auto text-white/30">→</div>
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-white/50 hover:text-white/90 transition-colors flex items-center gap-1"
    >
      ← Orqaga
    </button>
  );
}

function PanelShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative">
      <BackgroundDecor />
      <div className="max-w-sm w-full glass rounded-3xl p-7 relative z-10 shadow-2xl">
        {children}
      </div>
    </main>
  );
}

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
      <main className="min-h-screen py-10 px-4 relative">
        <BackgroundDecor />
        <div className="max-w-md mx-auto mb-4 relative z-10">
          <BackButton onClick={() => setMode("menu")} />
        </div>
        <div className="relative z-10">
          <PriceGuessGame />
        </div>
      </main>
    );
  }

  if (mode === "in-room") {
    return (
      <PanelShell>
        {room ? (
          <>
            <p className="text-xs text-white/40 mb-1 text-center uppercase tracking-widest">
              Xona kodi
            </p>
            <p className="text-4xl font-bold tracking-[0.3em] mb-1 text-center bg-gradient-to-r from-fuchsia-400 to-indigo-300 bg-clip-text text-transparent glow-pulse rounded-2xl py-2">
              {room.code}
            </p>
            <p className="text-xs text-white/40 mb-5 text-center mt-2">
              Bu kodni do&apos;stingizga yuboring — u shu kodni &quot;Xonaga
              qo&apos;shilish&quot; orqali kiritadi.
            </p>
            <div className="border-t border-white/10 pt-4 mb-5">
              <p className="text-xs text-white/40 mb-2">
                Xonadagi o&apos;yinchilar ({room.players.length})
              </p>
              <div className="flex flex-col gap-2">
                {room.players.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center text-sm bg-white/5 rounded-xl px-3 py-2.5"
                  >
                    <span className="flex items-center gap-2 text-white/90">
                      <span className="text-base">🏎️</span>
                      {p.name}
                      {p.is_host && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300">
                          host
                        </span>
                      )}
                    </span>
                    <span className="text-white/40 text-xs">{p.score} ball</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-white/30 text-center mb-4">
              Kamida 2 kishi bo&apos;lganda o&apos;yin boshlanishi mumkin
            </p>
          </>
        ) : (
          <p className="text-sm text-white/50 text-center py-8">Xonaga ulanmoqda...</p>
        )}
        <BackButton onClick={() => setMode("menu")} />
      </PanelShell>
    );
  }

  if (mode === "create-room") {
    return (
      <PanelShell>
        <p className="text-sm text-white/40 mb-4 text-center">Yangi xona yarating</p>
        <label className="text-xs text-white/50">Ismingiz</label>
        <input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="masalan Murodjon"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mt-1 mb-5 text-sm text-white placeholder:text-white/30 outline-none focus:border-fuchsia-400/50 transition-colors"
          autoFocus
        />
        <button
          onClick={handleCreateRoom}
          disabled={!playerName.trim()}
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white text-sm font-medium mb-3 disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          🎲 Xona yaratish
        </button>
        <div className="flex justify-center">
          <BackButton onClick={() => setMode("menu")} />
        </div>
      </PanelShell>
    );
  }

  if (mode === "join-room") {
    return (
      <PanelShell>
        <p className="text-sm text-white/40 mb-4 text-center">Do&apos;stingizga qo&apos;shiling</p>
        <label className="text-xs text-white/50">Ismingiz</label>
        <input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="masalan Murodjon"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mt-1 mb-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-fuchsia-400/50 transition-colors"
        />
        <label className="text-xs text-white/50">Xona kodi</label>
        <input
          value={joinCodeInput}
          onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
          placeholder="AB3X9"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mt-1 mb-2 text-center tracking-[0.3em] text-lg font-semibold text-white placeholder:text-white/20 outline-none focus:border-fuchsia-400/50 transition-colors"
          maxLength={6}
        />
        {joinError && <p className="text-xs text-red-400 mb-3 text-center">{joinError}</p>}
        <button
          onClick={handleJoinRoom}
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white text-sm font-medium mb-3 mt-3 hover:opacity-90 transition-opacity"
        >
          🚀 Qo&apos;shilish
        </button>
        <div className="flex justify-center">
          <BackButton onClick={() => setMode("menu")} />
        </div>
      </PanelShell>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative">
      <BackgroundDecor />
      <div className="max-w-md w-full flex flex-col gap-3 relative z-10">
        <Logo />

        <MenuCard
          icon="🤖"
          title="Bot bilan o'ynash"
          subtitle="Yakka tartibda, kompyuter raqib bilan"
          onClick={() => setMode("bot")}
          accent="linear-gradient(135deg, rgba(99,102,241,0.3), rgba(99,102,241,0.1))"
        />
        <MenuCard
          icon="🎲"
          title="Xona yaratish"
          subtitle="Do'stlaringizni taklif qiling"
          onClick={() => setMode("create-room")}
          accent="linear-gradient(135deg, rgba(217,70,239,0.3), rgba(217,70,239,0.1))"
        />
        <MenuCard
          icon="🚀"
          title="Xonaga qo'shilish"
          subtitle="Kod orqali do'stingizga qo'shiling"
          onClick={() => setMode("join-room")}
          accent="linear-gradient(135deg, rgba(34,211,238,0.3), rgba(34,211,238,0.1))"
        />

        <p className="text-center text-[11px] text-white/25 mt-4">
          Narxlar haqiqiy OLX.uz e&apos;lonlaridan olingan 🇺🇿
        </p>
      </div>
    </main>
  );
}
