# 🚨 EmergencyIQ
### AI-Powered Emergency Situation Intelligence Platform

> **EmergencyIQ is an AI-powered Emergency Situation Intelligence Platform that assists emergency dispatchers by transforming chaotic emergency conversations into structured operational intelligence. It continuously understands evolving situations, identifies critical missing information, estimates incident severity, and recommends the next best action in real time.**

🔗 **Live demo:** [TODO: add Vercel deployment link]
📦 **Repo:** [TODO: add GitHub repo link]

---

## 🌟 Overview

During emergency calls, dispatchers must rapidly interpret fragmented information, assess incident severity, collect critical details, and coordinate an appropriate response — all under immense pressure.

EmergencyIQ serves as an **AI-powered decision support platform**, continuously monitoring emergency conversations and converting them into structured operational intelligence.

Rather than functioning as a chatbot, EmergencyIQ acts as an intelligent reasoning engine that assists dispatchers throughout the incident lifecycle. The AI never talks to the caller — it only produces structured intelligence for the dispatcher, who remains the decision-maker at all times.

---

## ✨ Core Features

### 🧠 Situation Intelligence Engine
Continuously re-derives the full incident model from the entire conversation on every turn — not just appending new facts — so the picture stays accurate even as the story evolves.

### 🚨 Dynamic Incident Priority
Analyzes incoming information to estimate incident severity (Low / Moderate / High / Critical) with a numeric score, and updates it conservatively as new evidence arrives.

### 📊 Confidence Tracking
Every assessment carries an AI confidence score that grows or shifts as more information is confirmed — shown with a live delta indicator so dispatchers can see the AI's certainty evolve in real time.

### ⚠️ Critical Information Detection
Identifies the specific missing facts that matter most right now for this incident — not a generic checklist — and shrinks as the caller provides more detail.

### 💡 AI Dispatcher Guidance
Recommends exactly one next-best question per turn, with a short explanation of why it's the highest-value thing to ask right now.

### 🚑 Response Recommendation
Suggests appropriate emergency resources and a dispatch priority based on the current known situation only.

### 📋 Live Incident Summary
A structured, auto-updating view of incident type, victim details, symptoms, and medical history — labeled "Suspected" or "Confirmed" depending on AI confidence.

### 📈 Incident Timeline
A chronological, visually connected timeline of every meaningful event in the call.

### 📄 Incident Report Generation
Generates a polished, printable incident report (opens in a new tab, ready to print or save as PDF) summarizing the full call for handoff to responders.

### 🎬 Scripted Demo Scenarios
Three pre-written emergency scenarios (cardiac arrest, structure fire, road accident) playable step-by-step or via a "Play Scenario" auto-advance button for hands-free demoing.

---

## 🧠 EmergencyIQ Intelligence Pipeline

```text
Emergency Conversation
        │
        ▼
Situation Understanding
        │
        ▼
Structured Information Extraction
        │
        ▼
Incident Severity Assessment
        │
        ▼
Critical Information Detection
        │
        ▼
AI Dispatcher Guidance
        │
        ▼
Response Recommendation
        │
        ▼
Live Dashboard Update
        │
        ▼
Incident Report Generation
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 (App Router) | Full-stack Framework |
| React | Frontend |
| TypeScript | Type Safety |
| Tailwind CSS | UI Development |
| Google Gemini API | AI Reasoning Engine |
| Gemini Structured Output (`responseSchema`) | Structured Incident Model |
| Vercel | Deployment |

**Note on model choice:** the app calls Gemini via the `gemini-flash-latest` alias rather than a pinned dated model name, so it automatically tracks Google's current recommended flash-tier model rather than breaking when older model versions are deprecated.

---

## 🏗️ System Architecture

```text
                         EmergencyIQ Architecture

                  Emergency Conversation
                           │
                           ▼
                Dispatcher Dashboard (Next.js)
                           │
                           ▼
                 Situation Engine API Route
                           │
                           ▼
              Google Gemini API (Structured Output)
                           │
                           ▼
               Structured Incident Model (JSON)
                           │
      ┌──────────────┬──────────────┬──────────────┐
      ▼              ▼              ▼              ▼
 Situation      Severity      Critical       Dispatcher
 Summary       Assessment     Information     Guidance
                              Detection
      │
      ▼
 Response Recommendation
      │
      ▼
 Incident Timeline
      │
      ▼
 Incident Report
```

---

## 🎯 Core Innovation

Traditional AI assistants summarize conversations:

```
Conversation → AI → Summary
```

EmergencyIQ goes further:

```
Conversation → Situation Engine → Structured State → Critical Unknown Detection
→ Reasoning → Next Best Question → Dispatcher Decision Support
```

It continuously reasons about the evolving emergency by:

- Understanding the current situation
- Separating facts the caller explicitly stated from facts the AI infers
- Detecting critical missing information specific to this incident
- Estimating severity conservatively, without over- or under-escalating
- Recommending the single next-best dispatcher question
- Suggesting appropriate emergency resources
- Building a structured incident model in real time

This transforms emergency conversations into actionable operational intelligence instead of a passive transcript.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone [TODO: add GitHub repo link]
cd emergencyiq
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a file named `.env.local` in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## 🖥️ Dashboard Modules

The EmergencyIQ dashboard consists of:

- 🚨 Incident Priority Monitor
- 📞 Live Emergency Call (conversation panel)
- 📋 Active Incident Summary (with confidence delta)
- ⚠️ Critical Information Still Needed
- 🧠 AI Dispatcher Guidance
- 🚑 Response Recommendation
- 📈 Incident Timeline
- 📄 Dispatcher Actions (Incident Report Generator)

---

## 🎬 How to Use the Demo

1. Pick a scenario from the dropdown (Cardiac Emergency / Structure Fire / Road Accident)
2. Click **▶ Play Scenario** to auto-step through a scripted call, or type your own caller lines manually
3. Watch the Incident Priority, Situation Summary, Critical Information, AI Guidance, Response Recommendation, and Timeline panels update after every turn
4. Click **Generate Incident Report** to produce a printable handoff document
5. Click **Reset** to start a new call

---

## ⚡ Design Philosophy

EmergencyIQ is intentionally designed as an **AI-powered Emergency Situation Intelligence Platform**, not a chatbot.

The AI continuously monitors conversations, reasons about the evolving incident, and assists dispatchers with decision support — while keeping humans in complete control of emergency operations. The system is advisory, not autonomous.

The hackathon prototype intentionally avoids persistent storage, authentication, and database integration to focus on the platform's core innovation: **real-time emergency reasoning and decision support.**

---

## 📂 Project Structure

```text
app/
├── api/
│   └── situation-engine/
│       └── route.ts
│
├── page.tsx
├── layout.tsx
└── globals.css

components/
├── ConversationPanel.tsx
├── SeverityMeter.tsx
├── SituationSummary.tsx
├── CriticalUnknownsPanel.tsx
├── NextQuestionCard.tsx
├── Timeline.tsx
├── ResponseRecommendation.tsx
├── PulseLine.tsx
├── AIStatusIndicator.tsx
└── DispatcherActionPanel.tsx

lib/
├── prompts.ts
├── schema.ts
├── scenarios.ts
└── utils.ts
```

---

## 🔮 Future Enhancements (Roadmap)

- 🎤 Live Speech-to-Text Integration
- 🌍 GIS & Live Location Mapping
- 🚑 Ambulance Tracking
- 🏥 Hospital Availability Integration
- 📡 Computer-Aided Dispatch (CAD) Integration
- 👥 Multi-Incident Management
- 📊 Emergency Analytics Dashboard
- 🔐 Authentication & Multi-Tenant Dispatcher Accounts

---

## ❓ FAQ (Anticipated Judge Questions)

**How do you prevent hallucinated facts?**
The system prompt enforces a strict separation between facts the caller explicitly stated and facts the AI infers, plus conservative severity escalation rules and a confidence score on every response.

**How would this integrate with existing 911/CAD systems?**
Output is strict schema-conformant JSON by design, making it straightforward to consume from other dispatch systems in a production integration.

**What if the AI recommends the wrong resource?**
The dispatcher remains the decision-maker at all times. The system is advisory, not autonomous.

---

## 🏆 Built For

**IDEA2IMPACT 2026 Hackathon**
**Theme 3 — Crisis Management, HealthTech & Emergency Response**

[TODO: team name / participant name]

---

## 📜 License

Developed for educational, research, and hackathon purposes.

---

## ❤️ Why EmergencyIQ Matters

Every second matters during an emergency.

EmergencyIQ empowers dispatchers with real-time AI-powered situational intelligence, helping them ask better questions, identify critical risks sooner, and make faster, more informed emergency response decisions.