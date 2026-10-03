# 🍱 DabbaGo — Home Lunch Box Delivery App

> **Hot, fresh home-cooked tiffins delivered right on time to school classrooms & office desks.**

[![Vite](https://img.shields.io/badge/Vite-8.3.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Vanilla_Design_System-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable_&_Offline-5A0FC8?style=flat&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Highlights & Features

### 1. 🎒 Dual Lunch Profiles (School & Office)
* **School Student Mode**: Tailored for students like **Aarav** at Green Valley School with gate reception coordination, drop-off before the lunch bell (12:10 PM), and digital gate pass PIN verification.
* **Working Professional Mode**: Tailored for office workers like **Vikram** at Mindspace Cyber Towers with corporate desk handover before 12:45 PM.

### 2. 🛵 Live Order Tracking & Verified Rider
* **Rider Rahul**: Electric Scooter (`KA-03-EB-4921`), `⭐ 4.95` rating across 1,420+ safe deliveries.
* **Interactive Live Route Map**: Modal showing live GPS movement, real-time ETA, route checkpoints (Picked up $\rightarrow$ In transit $\rightarrow$ Handover), and direct rider contact options.
* **One-Tap Actions**: Direct phone call and WhatsApp message integration for delivery instructions.

### 3. 🔐 Smart OTP Authentication Flow
* **30-Second Countdown Timer**: Real-time ticker counting down from `30s` to `0s`. Prevents accidental duplicate requests and reveals a reactive **Resend OTP** button upon expiry.
* **Full-Width Edge-to-Edge Grid**: 4 equal-width digit boxes stretching across the card container for effortless touch typing.
* **Instant Auto-Submit**: Automatically validates and submits upon typing the 4th digit (or tapping the quick **DEMO OTP: 4829** chip), giving instantaneous login/signup feedback.
* **Clean Logout**: Streamlined profile action button with dedicated red styling and no clutter.

### 4. 📅 Smart Term Subscription & Skip Day Management
* **Flexible Term Plans**: Monthly and quarterly plans with renewal countdowns.
* **Skip Day with Instant Credit**: Skip planned holidays or sick days with 1 tap, automatically pausing rider pickup and crediting **₹115** to your subscription balance.

### 5. 📱 Progressive Web App (PWA)
* Fully installable on iOS and Android with custom app icons, standalone portrait display, and offline support via Service Worker caching (`sw.js`).
* Includes interactive simulation controls for all 3 delivery stages (**Stage 1: Pickup Scheduled**, **Stage 2: In Transit**, **Stage 3: Delivered**).

---

## 📂 Project Structure

```text
lunch box/
├── index.html              # Main application markup & semantic layout
├── app.js                  # Application state, OTP controller, timers & navigation
├── styles.css              # Custom CSS design system, typography & animations
├── public/                 # Static assets & PWA configuration
│   ├── manifest.webmanifest# PWA Web App Manifest
│   ├── sw.js               # Service Worker for offline caching & network fallback
│   ├── icon-192.png        # App icon (192x192)
│   ├── icon-512.png        # App icon (512x512)
│   ├── icon-maskable-512.png # Maskable adaptive icon
│   └── apple-touch-icon.png# iOS touch icon
├── package.json            # Node.js scripts and Vite dependencies
├── .gitignore              # Git ignore rules for node_modules, dist, etc.
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* `npm` (bundled with Node.js)

### Installation
Clone the repository and install dependencies:

```bash
git clone <your-repository-url>
cd lunch-box
npm install
```

### Run Locally (Development)
Start the Vite local development server:

```bash
npm run dev
```

Open your browser and navigate to:
**`http://localhost:5173/`**

### Build for Production
To generate a production-ready optimized bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🧪 Testing & Verification Credentials

| Feature | Details |
| :--- | :--- |
| **Demo Login Mobile** | `9845028190` |
| **Demo OTP Code** | `4829` (Also supported via one-tap autofill chip) |
| **OTP Timer** | 30 seconds live countdown before Resend button activates |
| **Auto-Submit** | Triggers automatically as soon as the 4th digit is input |
| **Rider Name** | **Rahul** (Electric Scooter KA-03-EB-4921) |
| **Simulation Controls** | Bottom bar allows toggling between Stage 1, Stage 2, and Stage 3 |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
