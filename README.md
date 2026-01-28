# TradeVirtual

A modern virtual trading platform that allows users to practice cryptocurrency trading with simulated funds. Built with Next.js 14, featuring real-time price data, gamification elements, and Telegram authentication.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)

## Features

### Trading
- **Real-Time Prices** — Live cryptocurrency prices updated every 5 seconds via Binance API
- **Virtual Trading** — Buy and sell popular cryptocurrencies (BTC, ETH, BNB, SOL, ADA, DOGE) with simulated funds
- **Trade History** — Complete record of all your transactions

### Gamification
- **XP System** — Earn experience points for every trade
- **Leveling** — Progress through levels as you gain XP
- **Leaderboard** — Compete with other traders globally
- **XP Exchange** — Convert your earned XP into virtual balance

### Dashboard
- **Portfolio Overview** — Track your virtual balance, XP, and level at a glance
- **Recent Activity** — View your latest trades
- **Performance Stats** — Analyze your trading volume and patterns

### Profile & Analytics
- **Activity Timeline** — Visual history of all your trades
- **Trading Statistics** — Total trades, buy/sell ratios, and volume metrics
- **Level Progress** — Track your journey to the next level

### Admin Panel
- **System Configuration** — Adjust XP rewards and initial balance settings

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Prisma ORM (SQLite for development, PostgreSQL ready)
- **Authentication:** Telegram Login Widget + JWT
- **Icons:** Lucide React
- **Price Data:** Binance Public API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Telegram Bot (create one via [@BotFather](https://t.me/botfather))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trade-virtual
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration:
   - `TELEGRAM_BOT_TOKEN` — Your Telegram bot token from BotFather
   - `JWT_SECRET` — A secure random string for JWT signing

4. **Initialize the database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Configure Telegram Login**
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Use `/setdomain` command and set your domain (use `localhost` for development)
   - Update the `botName` in `src/app/login/page.tsx` with your bot's username

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin configuration panel
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── leaderboard/   # Leaderboard data
│   │   ├── trade/         # Trade execution
│   │   └── xp-exchange/   # XP to balance conversion
│   ├── leaderboard/       # Leaderboard page
│   ├── login/             # Login page
│   ├── profile/           # User profile & analytics
│   └── trade/             # Trading terminal
├── components/
│   ├── auth/              # Authentication components
│   ├── gamification/      # XP exchange widget
│   └── layout/            # Navbar & Sidebar
├── lib/                   # Utility functions & Prisma client
└── middleware.ts          # Route protection
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Database Schema

The application uses three main models:

- **User** — Stores trader information, balance, XP, and level
- **Trade** — Records all buy/sell transactions
- **SystemConfig** — Platform-wide settings (XP per trade, initial balance)


## License

This project is licensed for non-commercial use only. Commercial use is prohibited.
