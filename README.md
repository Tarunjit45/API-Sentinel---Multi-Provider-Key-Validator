# 🛡️ API Sentinel — Multi-Provider AI Key Validator & Quota Monitor

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Providers](https://img.shields.io/badge/Supports-Gemini%20%7C%20OpenAI%20%7C%20Claude%20%7C%20Groq-4285F4?style=for-the-badge)](README.md)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**API Sentinel** is a developer tool and dashboard that instantly tests, verifies, and benchmarks API keys across multiple AI providers in one place. Prevent silent API key invalidations, verify model availability, and measure round-trip response latencies without executing full applications.

---

## 🌐 Supported AI Providers

| Provider | Validation Probe | Metrics Tested |
| :--- | :--- | :--- |
| **Google Gemini** | `gemini-2.5-flash` probe | Status, Token Quota, Latency (ms) |
| **OpenAI** | `gpt-4o-mini` probe | Auth, Org ID, Rate Limit Tier |
| **Anthropic Claude** | `claude-3-5-sonnet` probe | Key Validity, Workspace Status |
| **Groq Cloud** | `llama-3.3-70b-versatile` probe | High-speed TPS, Validity |
| **Mistral AI** | `mistral-small` probe | Endpoints, Auth Status |
| **Hugging Face** | User WhoAmI API | Read/Write Token Permissions |

---

## ✨ Features

* ⚡ **Instant Key Health Audit:** Paste an API key; API Sentinel fires a lightweight ping test and reports status within milliseconds.
* ⏱️ **Latency Benchmarking:** Real-time round-trip latency counter showing provider responsiveness.
* 🔒 **Client-Side Security:** Keys are tested directly from the user's browser or local runtime—keys are **never stored, logged, or sent to third-party databases**.
* 📋 **Model Capability Inspection:** Lists all model IDs accessible by the tested key.

---

## 📁 Repository Structure

```text
API-Sentinel---Multi-Provider-Key-Validator/
├── App.tsx             # Main dashboard, provider grid & key test cards
├── index.tsx           # React bootstrap entry point
├── components/         # KeyInputCard, ProviderBadge, LatencyGauge, ModelListModal
├── constants.tsx       # Provider endpoints, test payloads & headers
├── services/           # Validation service workers for each provider
├── metadata.json       # Project manifest
├── package.json        # Dependencies & scripts
├── LICENSE             # MIT License
└── README.md
```

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone https://github.com/Tarunjit45/API-Sentinel---Multi-Provider-Key-Validator.git
cd API-Sentinel---Multi-Provider-Key-Validator

npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
