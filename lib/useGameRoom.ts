"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

export type RoomPlayer = {
  id: string;
  name: string;
  score: number;
  is_host: boolean;
};

export type RoomState = {
  code: string;
  players: RoomPlayer[];
  status: "waiting" | "playing" | "finished";
  currentRound: number;
};

// Xona kodi generatori: 5 belgili, harf+raqam (masalan AB3X9)
function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Bu hook Supabase Realtime "broadcast" kanali orqali xona ichidagi
// o'yinchilar holatini sinxronlaydi. Har bir o'yinchi bir xil
// `room:{code}` kanaliga ulanadi va presence/broadcast orqali
// ball, navbat, va savol holatini almashadi.
export function useGameRoom(playerName: string) {
  const [room, setRoom] = useState<RoomState | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const myIdRef = useRef<string>(
    Math.random().toString(36).slice(2, 10)
  );

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  function joinRoom(code: string, asHost: boolean) {
    cleanup();

    const channel = supabase.channel(`room:${code}`, {
      config: { presence: { key: myIdRef.current } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<{ name: string; score: number }>();
        const players: RoomPlayer[] = Object.entries(state).map(([id, metas]) => ({
          id,
          name: metas[0]?.name || "O'yinchi",
          score: metas[0]?.score || 0,
          is_host: asHost && id === myIdRef.current,
        }));
        setRoom((prev) => ({
          code,
          players,
          status: prev?.status || "waiting",
          currentRound: prev?.currentRound || 0,
        }));
      })
      .on("broadcast", { event: "game_update" }, ({ payload }) => {
        setRoom((prev) =>
          prev ? { ...prev, status: payload.status, currentRound: payload.currentRound } : prev
        );
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ name: playerName, score: 0 });
        }
      });

    channelRef.current = channel;
  }

  function createRoom(): string {
    const code = generateRoomCode();
    joinRoom(code, true);
    return code;
  }

  function broadcastGameUpdate(status: RoomState["status"], currentRound: number) {
    channelRef.current?.send({
      type: "broadcast",
      event: "game_update",
      payload: { status, currentRound },
    });
  }

  function updateMyScore(score: number) {
    channelRef.current?.track({ name: playerName, score });
  }

  return { room, createRoom, joinRoom, broadcastGameUpdate, updateMyScore, myId: myIdRef.current };
}
