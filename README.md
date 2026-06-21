# Narx Top - avto narxini taxmin qilish o'yini

## Ishga tushirish

```bash
npm install
cp .env.local.example .env.local
# .env.local ichiga Supabase URL va anon key'ni yozing
npm run dev
```

## Tuzilishi

- `app/page.tsx` - bosh sahifa: bot / xona yaratish / xonaga qo'shilish
- `components/PriceGuessGame.tsx` - asosiy o'yin komponenti (bot bilan)
- `lib/questions.ts` - savollar bazasi (demo namunalar, real questions.json bilan almashtiriladi)
- `lib/bot.ts` - bot taxmin logikasi (qiyinlik darajalari bilan)
- `lib/supabase.ts` - Supabase client va savol olish funksiyasi
- `lib/useGameRoom.ts` - multiplayer xona logikasi (Supabase Realtime presence/broadcast)

## Keyingi qadamlar

1. `questions_bank` jadvalini Supabase'da yaratish (oldingi scraper skriptlari orqali to'ldirilgan)
2. `.env.local` ga real Supabase kalitlarini qo'yish
3. Multiplayer xona UI'sini `useGameRoom` hook bilan to'liq bog'lash (hozircha asosiy infratuzilma tayyor, lekin room ichida real vaqtli savol-javob aylanishi qo'shilishi kerak)
4. Telegram Mini App uchun `@twa-dev/sdk` qo'shish
