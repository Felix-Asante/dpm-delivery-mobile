# DPM Parcel Delivery App

A cross-platform mobile app for **delivery riders** to manage parcels, view earnings, update shipment statuses, and request payouts. Built with Expo and React Native.

---

## Features

- **Authentication** — Sign in with phone and password; secure token storage (SecureStore on native, encrypted storage on web).
- **Home dashboard** — Wallet balance, total earnings, quick actions (Request Payment, Transactions), and account stats.
- **Available deliveries** — Browse and accept delivery requests; filter by status (Assigned, In Transit, Delivered, etc.).
- **Order history** — View past orders with filters and infinite scroll; tap into full shipment details.
- **Shipment details** — See route, contact info, payment summary; update shipment status (e.g. Pickup Confirmed, In Transit, Delivered) with optional notes/photos.
- **Transactions** — List wallet transactions with pagination.
- **Request payment** — Request payout (e.g. mobile money, bank transfer); verify mobile money numbers via Paystack-style flow.
- **Profile** — View profile info, manage account (placeholders for edit profile, password, settings), and **logout**.

---

## Tech stack

| Area               | Choice                                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework          | [Expo](https://expo.dev) (~54) + [React Native](https://reactnative.dev)                                                                                                 |
| Language           | TypeScript                                                                                                                                                               |
| Routing            | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based)                                                                                                   |
| UI                 | [HeroUI Native](https://heroui.com), [Uniwind](https://github.com/uniwind-ui/uniwind) (Tailwind-style styling)                                                           |
| Data & API         | [TanStack Query](https://tanstack.com/query/latest), [Axios](https://axios-http.com)                                                                                     |
| Forms & validation | [React Hook Form](https://react-hook-form.com), [Zod](https://zod.dev), [@hookform/resolvers](https://github.com/react-hook-form/resolvers)                              |
| Storage            | [MMKV](https://github.com/mrousavy/react-native-mmkv) (native), [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) (tokens), web crypto for web |
| Lists              | [FlashList](https://shopify.github.io/flash-list/)                                                                                                                       |
| Icons              | expo-symbols (iOS) + MaterialIcons fallback (Android/Web) via custom `IconSymbol`                                                                                        |

---

## Prerequisites

- **Node.js** (LTS recommended, e.g. 18+)
- **bun**
- **Expo CLI** (optional; `npx expo` is enough)
- **iOS**: Xcode (Mac) for simulator/device
- **Android**: Android Studio / SDK for emulator or device
- **Web**: modern browser (Expo web)

---

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd dpm-parcel-delivery-app
npm install
```

### 2. Environment variables

Create a `.env.local` (or use your env scheme) in the project root with:

```env
EXPO_PUBLIC_API_BASE_URL=https://your-api.example.com
EXPO_PUBLIC_ENCRYPTION_KEY=your-encryption-key
EXPO_PUBLIC_WEB_CRYPTO_KEY=your-web-crypto-key
```

- `EXPO_PUBLIC_API_BASE_URL` — Backend API base URL (required).
- `EXPO_PUBLIC_ENCRYPTION_KEY` — Used for MMKV/encryption (required).
- `EXPO_PUBLIC_WEB_CRYPTO_KEY` — Used for web crypto (required; see `src/utils/env.ts`).

Missing vars will throw at runtime (see `src/utils/env.ts`).

### 3. Start the app

```bash
bunx expo start
```

Then:

- Press **i** for iOS simulator
- Press **a** for Android emulator
- Press **w** for web
- Or scan the QR code with **Expo Go** on a physical device (for development builds, use a custom dev client).

---

## Scripts

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `bun start`            | Start Expo dev server                |
| `bun run android`      | Run on Android                       |
| `bun run ios`          | Run on iOS                           |
| `bun run web`          | Start with web                       |
| `bun run lint`         | Run ESLint                           |
| `bun run generate-apk` | Build release APK (Android)          |
| `bun run view:apk`     | Open folder containing generated APK |

---

## Project structure (high level)

```
src/
├── app/                    # Expo Router screens
│   ├── (public)/           # Unauthenticated (e.g. sign-in)
│   └── (parcel)/           # Authenticated rider app
│       ├── (tabs)/         # Tab screens: Home, History, Transactions, Profile
│       └── (stack)/        # Stack screens: shipment detail, request payment, etc.
├── components/             # Shared UI (forms, cards, icons, etc.)
├── constants/              # App config, theme, data
├── hooks/                  # React hooks (theme, API, etc.)
├── lib/                    # TanStack query options, payment gateways, logger
├── modules/                # Feature modules (auth, dashboard, parcels, payouts)
├── services/               # API services (auth, users, shipments, payment)
├── types/                  # TypeScript types and enums
├── utils/                  # Storage, env, currency, validation, errors
├── global.css              # Tailwind + Uniwind + HeroUI styles
└── uniwind-types.d.ts      # Uniwind TypeScript declarations
```

---

## Configuration

- **API base URL** — Set via `EXPO_PUBLIC_API_BASE_URL`; used in `src/services/api/end-points.ts`.
- **Currency** — Default is **Cedis (₵)** in `src/constants/config.ts`; change there if you use another currency.
- **Theme** — Light/dark support; colors in `src/constants/theme.ts` and `src/global.css`.

---

## Building for production

- **Android APK**: `npm run generate-apk` (output in `android/app/build/outputs/apk/release/`).
- **iOS**: Open `ios/` in Xcode and archive for TestFlight/App Store.
- **Web**: Use Expo’s web export (e.g. `npx expo export --platform web`); host the output as a static site.

---

## License

Private / All rights reserved.

---
