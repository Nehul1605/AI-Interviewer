# 🤖 AI Interviewer Platform — Product Requirements Document

> **Version 1.1 | Hackathon Edition | March 2026**

| Field | Value |
|---|---|
| **Project Name** | AI Interviewer Platform |
| **Document Type** | Product Requirements Document |
| **Version** | 1.1 — Hackathon MVP (Updated) |
| **Date** | March 2026 |
| **Status** | DRAFT — In Development |
| **Hackathon Ready** | ✅ YES — Strong Submission |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Tech Stack Decision](#2-tech-stack-decision)
3. [System Architecture](#3-system-architecture)
4. [Feature Specifications](#4-feature-specifications)
5. [Scoring & Evaluation System](#5-scoring--evaluation-system)
6. [API Endpoint Reference](#6-api-endpoint-reference)
7. [Practice Mode — Deep Dive](#7-practice-mode--deep-dive)
8. [Emotion Analysis — Deep Dive](#8-emotion-analysis--deep-dive)
9. [Hackathon Assessment](#9-hackathon-assessment)
10. [Free & Low-Cost AI Model Reference](#10-free--low-cost-ai-model-reference)
11. [Environment Configuration](#11-environment-configuration)
12. [Final Verdict](#12-final-verdict)

---

## 1. Executive Summary

The AI Interviewer Platform is an intelligent, automated interview system powered by Large Language Models (LLMs). It has two core modes:

- **Live Interview Mode** — for HR teams to evaluate real candidates
- **Practice Mode** — where job seekers upload their resume, pick a target role, and receive personalized mock interviews with detailed feedback

This project is excellent for a hackathon — it demonstrates real AI value, solves a genuine pain point, has a compelling demo flow, and can be built end-to-end with **FastAPI + React + Gemini/Groq** in 24–48 hours.

### 1.1 The Problem

- Hiring is slow — traditional interview scheduling wastes 15+ hours per candidate
- Screening quality is inconsistent and biased
- Candidates have no structured way to practice for specific roles
- Small companies cannot afford dedicated HR tech stacks

### 1.2 The Solution

- AI conducts structured, adaptive interviews automatically
- Scores and ranks candidates with explainable metrics
- Gives candidates a practice arena tailored to their resume + target role
- Generates detailed PDF reports for both HR and candidates
- **Analyses candidate emotion and confidence across the interview to surface delivery insights**

---

## 2. Tech Stack Decision

### 2.1 Why FastAPI Only (No Node.js)

Since all heavy lifting — LLM calls, NLP scoring, resume parsing, audio transcription — is Python-native, there is no reason to add a Node.js layer. FastAPI alone handles REST APIs, WebSockets, async I/O, and file uploads with excellent performance.

| Concern | Node.js + FastAPI | FastAPI Only (Recommended) |
|---|---|---|
| Complexity | Two runtimes, two deploy configs | Single runtime, simple deploy |
| Performance | Node proxies to Python (extra hop) | Direct Python async — faster |
| AI/ML Libraries | Node has none natively | Python has everything (spaCy, Whisper, etc.) |
| Hackathon Speed | Slower to set up | Ship in hours |
| WebSockets | Needs socket.io | FastAPI native WebSockets |
| File Uploads | Multer + proxy | FastAPI UploadFile built-in |

### 2.2 Full Tech Stack

#### Frontend

| Technology | Purpose | Why |
|---|---|---|
| React 18 + Vite | Main UI Framework | Fast HMR, great DX for hackathons |
| Tailwind CSS | Styling | Rapid UI, no CSS files needed |
| shadcn/ui | Component Library | Beautiful pre-built components |
| React Router v6 | Navigation | SPA routing |
| Axios | HTTP Client | API calls to FastAPI |
| React Hook Form | Form Management | Resume upload, job role selection |
| Recharts | Score Visualization | Radar/bar charts for results |
| MediaRecorder API | Voice Capture (browser) | Records audio blob; sent to backend for Whisper + SpeechBrain processing. Replaces Web Speech API for full server-side pipeline. |

> ⚠️ **Changed from v1.0:** Web Speech API replaced with `MediaRecorder`. Web Speech API is browser-inconsistent and gives no audio file for server-side emotion analysis. `MediaRecorder` captures a raw audio blob, which is sent to FastAPI where both Whisper (STT) and SpeechBrain (prosody emotion) can run on the same file.

#### Backend

| Technology | Purpose | Why |
|---|---|---|
| FastAPI | REST API + WebSocket server | Async Python, auto docs, fast |
| Uvicorn | ASGI Server | Production-grade ASGI |
| Pydantic v2 | Data validation & schemas | Native to FastAPI |
| SQLAlchemy 2.0 | ORM | Async DB queries |
| Alembic | DB migrations | Schema versioning |
| PyMuPDF / pdfminer | Resume PDF parsing | Extract text from resumes |
| python-jose | JWT Auth | Token-based auth |
| passlib | Password hashing | bcrypt hashing |

#### AI / ML Layer

| Tool | Purpose | Cost |
|---|---|---|
| Google Gemini 1.5 Flash | Question generation + Answer eval + Adaptive prompting | **FREE** — 1M tokens/day free |
| Groq (Llama 3 70B) | Fast inference fallback | **FREE** — very fast inference |
| OpenRouter (Claude Haiku) | Best answer evaluation quality | ~$0.25 / 1M input tokens |
| faster-whisper | Speech-to-text transcription | **FREE** — runs locally, 4× faster than openai-whisper |
| SpeechBrain | Speech/prosody emotion analysis from audio | **FREE** — Apache 2.0, CPU-friendly |
| j-hartmann/emotion-english-distilroberta-base | Text emotion classification (6-class) | **FREE** — HuggingFace, ~80MB |
| spaCy | NLP: filler word detection, hedging language, readability | **FREE** — open source |
| sentence-transformers | Semantic similarity scoring | **FREE** — runs locally |
| PyPDF2 / pdfminer.six | Resume text extraction | **FREE** — open source |

> 💡 **Changed from v1.0:** `openai-whisper` replaced with `faster-whisper` (CTranslate2 backend) — same model weights, 4× faster inference, lower memory footprint. Added SpeechBrain and j-hartmann emotion model for full emotion analysis pipeline.

> 💡 **Recommendation for Hackathon:** Use Gemini 1.5 Flash as primary (free, very capable). Use Groq as fallback for speed. **Total cost for demo: $0.**

#### Database

| Tool | Purpose | Notes |
|---|---|---|
| PostgreSQL | Primary DB — users, sessions, scores | Free on Railway/Supabase |
| Redis | Session caching, real-time interview state, emotion score buffer | Free tier on Upstash. **Recommended even for MVP** — needed to track per-question emotion trends and current session state. |
| Supabase Storage | Resume + audio file storage | Free 1GB tier |

> ⚠️ **Changed from v1.0:** Redis promoted from "optional" to recommended for MVP. Real-time emotion tracking requires buffering per-question scores across the session lifetime, which is a natural fit for Redis.

#### Infrastructure & DevOps

| Tool | Purpose | Cost |
|---|---|---|
| Railway | Backend deployment (FastAPI) | **FREE** tier — perfect for hackathons |
| Vercel | Frontend deployment (React) | **FREE** tier |
| Supabase | PostgreSQL + Storage | **FREE** tier |
| Docker | Local dev consistency | Free |
| GitHub Actions | CI/CD | Free for public repos |

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐   │
│  │  HR Dashboard│  │ Interview UI │  │Practice Mode│   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘   │
└─────────┼─────────────────┼─────────────────┼──────────┘
          │     REST / WebSocket (HTTPS)       │
┌─────────▼─────────────────▼─────────────────▼──────────┐
│               FASTAPI BACKEND (Python)                  │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌─────────┐   │
│  │Auth/User │ │Interview │ │ Practice  │ │ Report  │   │
│  │  Router  │ │  Router  │ │  Router   │ │ Router  │   │
│  └──────────┘ └────┬─────┘ └─────┬─────┘ └────┬────┘   │
│              ┌─────▼─────────────▼─────────────▼─────┐  │
│              │          AI SERVICE LAYER              │  │
│              │  ┌──────────┐  ┌──────────────────┐   │  │
│              │  │ Question │  │  Answer Evaluator │   │  │
│              │  │Generator │  │  (LLM + NLP)      │   │  │
│              │  └──────────┘  └──────────────────┘   │  │
│              │  ┌──────────┐  ┌──────────────────┐   │  │
│              │  │ Resume   │  │  Score Aggregator │   │  │
│              │  │ Parser   │  │  + Report Gen     │   │  │
│              │  └──────────┘  └──────────────────┘   │  │
│              │  ┌──────────┐  ┌──────────────────┐   │  │
│              │  │ Emotion  │  │  Adaptive Prompt  │   │  │
│              │  │Aggregator│  │  Engine (Gemini)  │   │  │
│              │  └──────────┘  └──────────────────┘   │  │
│              └───────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
           ┌────────────┴──────────────┐
    ┌───────▼──────┐          ┌────────▼──────────┐
    │  PostgreSQL  │          │  Supabase Storage  │
    │(Users,Scores)│          │  (Resumes, Audio)  │
    └──────────────┘          └────────────────────┘
          External: Gemini API / Groq API / faster-whisper / SpeechBrain
```

### 3.2 Audio Processing Pipeline

```
Browser (MediaRecorder)
    ↓ audio blob (WebM/WAV)
FastAPI /interview/{id}/answer
    ↓
    ├── faster-whisper → transcript text
    │
    └── SpeechBrain   → prosody emotion label + confidence
              ↓
         transcript → j-hartmann/emotion → text emotion label
              ↓
         transcript → spaCy → filler word count + hedging phrases
              ↓
         emotion_aggregator.py → composite confidence score
              ↓
         Redis (session emotion buffer) → per-question trend tracking
```

### 3.3 FastAPI Backend — Module Structure

```
app/
├── main.py                  # FastAPI app, CORS, router registration
├── config.py                # Settings (API keys, DB URL from .env)
├── database.py              # Async SQLAlchemy engine + session
├── models/
│   ├── user.py              # User, CandidateProfile
│   ├── interview.py         # InterviewSession, Question, Answer
│   ├── score.py             # ScoreReport, DimensionScore
│   └── practice.py          # PracticeSession, ResumeData
├── schemas/                 # Pydantic request/response models
├── routers/
│   ├── auth.py              # POST /auth/register, /auth/login
│   ├── interview.py         # POST /interview/create, GET /interview/{id}
│   ├── practice.py          # POST /practice/start, /practice/answer
│   ├── questions.py         # GET /questions/generate
│   ├── evaluate.py          # POST /evaluate/answer, /evaluate/session
│   └── reports.py           # GET /reports/{session_id}/pdf
├── services/
│   ├── llm_service.py       # Gemini / Groq API calls
│   ├── question_engine.py   # Generates adaptive questions
│   ├── evaluator.py         # Scores individual answers
│   ├── resume_parser.py     # Extracts data from PDF resumes
│   ├── speech_service.py    # faster-whisper transcription
│   ├── emotion_service.py   # SpeechBrain + j-hartmann + spaCy fusion  ← NEW
│   ├── emotion_aggregator.py # Weighted composite confidence score      ← NEW
│   ├── nlp_service.py       # spaCy filler word + readability
│   └── report_generator.py  # Builds final PDF report
└── websockets/
    └── interview_ws.py      # Real-time interview session handler
```

### 3.4 Database Schema

| Table | Key Columns | Purpose |
|---|---|---|
| `users` | id, email, password_hash, role (hr/candidate), created_at | Auth & identity |
| `interview_sessions` | id, job_role, jd_text, candidate_id, hr_id, status, created_at | Interview metadata |
| `questions` | id, session_id, text, type, order_num, expected_answer, difficulty | Interview questions |
| `answers` | id, question_id, session_id, transcript, audio_url, submitted_at | Candidate responses |
| `score_reports` | id, session_id, total_score, technical, communication, behavioral, problem_solving, confidence, emotion_trend | Aggregated scores |
| `emotion_snapshots` | id, answer_id, session_id, text_emotion, prosody_emotion, filler_count, hedge_count, confidence_score | Per-answer emotion data ← NEW |
| `practice_sessions` | id, candidate_id, job_role, resume_url, resume_text, status | Practice mode sessions |
| `resume_data` | id, practice_id, skills[], experience[], education[], parsed_json | Extracted resume info |

---

## 4. Feature Specifications

### 4.1 Feature 1: Live Interview Mode (HR Flow)

| Step | Action | Tech Used |
|---|---|---|
| 1 | HR registers and creates interview campaign | FastAPI auth + PostgreSQL |
| 2 | HR uploads Job Description (text or PDF) | UploadFile + pdfminer |
| 3 | System generates 8–12 tailored questions from JD | LLM (Gemini Flash) |
| 4 | HR shares unique interview link with candidate | UUID-based session tokens |
| 5 | Candidate joins link, sees questions one-by-one | React UI + WebSocket |
| 6 | Candidate answers by voice (MediaRecorder) or text | MediaRecorder blob → FastAPI |
| 7 | Audio processed: transcript + prosody emotion extracted | faster-whisper + SpeechBrain |
| 8 | Text emotion + NLP signals extracted from transcript | j-hartmann + spaCy |
| 9 | AI scores each answer; emotion aggregated per question | LLM evaluator + emotion_aggregator |
| 10 | If answer vague or candidate nervous, AI adapts follow-up | Adaptive question engine + emotion state |
| 11 | Session ends; full score report with emotion trend generated | FastAPI report service |
| 12 | HR sees ranked candidates with confidence metrics on dashboard | React dashboard + charts |

### 4.2 Feature 2: Practice Mode (Candidate Flow)

> ⭐ This is the **standout feature** for the hackathon. Candidates get personalized interview practice based on their actual resume and target role.

| Step | Action | Tech Used |
|---|---|---|
| 1 | Candidate uploads their resume (PDF) | UploadFile → pdfminer + spaCy NER |
| 2 | Candidate selects target job role | Dropdown: Frontend, Backend, Full Stack, Data, DevOps, etc. |
| 3 | System parses resume: skills, experience, gaps | resume_parser.py → structured JSON |
| 4 | AI generates custom questions targeting gaps | LLM prompt: resume JSON + role requirements |
| 5 | Candidate completes mock interview (text/voice) | Same interview UI as Live mode |
| 6 | AI provides per-answer feedback + scores + emotion snapshot | LLM evaluator + emotion_aggregator |
| 7 | Report shows: strengths, gaps, what to study, confidence trend | Detailed feedback report |
| 8 | Candidate can retry to improve score | New session, same resume |

### 4.3 Question Types

| Type | Example | When Used |
|---|---|---|
| Technical | Explain the difference between `useEffect` and `useLayoutEffect` | Based on role + JD/resume |
| Behavioral (STAR) | Tell me about a time you handled a production outage | All roles |
| Situational | How would you design a rate-limiting system for an API? | Senior roles |
| Resume-Specific | Your resume shows React but no TypeScript — how would you approach learning it? | Practice mode |
| Follow-up | You mentioned caching — can you explain your specific implementation? | Adaptive, when answer is vague |
| Emotion-Adaptive | You seem uncertain — take your time. Can you walk me through what you do know about X? | When fear/anxiety detected in prosody |
| Role-fit | Why do you want to work as a backend developer specifically? | HR mode |

---

## 5. Scoring & Evaluation System

### 5.1 Scoring Dimensions

| Dimension | Weight | How Measured | Tool |
|---|---|---|---|
| Technical Accuracy | 30% | LLM compares answer to ideal answer rubric | Gemini / Groq |
| Communication Clarity | 20% | Readability score + coherence + grammar check | spaCy + textstat |
| Problem-Solving | 20% | LLM rubric: logic, structure, creativity | Gemini |
| Behavioral (STAR) | 15% | STAR framework detection in answer | LLM + regex patterns |
| Confidence & Delivery | 15% | Filler word count + text emotion + prosody emotion composite | spaCy + SpeechBrain + j-hartmann |

### 5.2 Confidence Score Calculation

The Confidence & Delivery dimension is computed by `emotion_aggregator.py` from three signals:

```python
def compute_confidence_score(text_emotion, prosody_emotion, filler_count, hedges):
    # Map text emotions to a 0–1 confidence proxy
    text_score = {
        "joy": 1.0, "neutral": 0.7, "surprise": 0.5,
        "fear": 0.2, "sadness": 0.3, "anger": 0.4
    }.get(text_emotion, 0.5)

    # Map prosody/speech emotions to a 0–1 confidence proxy
    prosody_score = {
        "happy": 1.0, "calm": 0.8, "neutral": 0.6,
        "fear": 0.2, "angry": 0.3
    }.get(prosody_emotion, 0.5)

    # Penalise filler words (um, uh, like, you know) and hedging phrases (I think, maybe)
    fluency_penalty = min(filler_count * 0.05, 0.3)
    hedge_penalty   = min(len(hedges) * 0.04, 0.2)

    return (text_score * 0.35 + prosody_score * 0.35) - fluency_penalty - hedge_penalty
```

**Weights:** text emotion 35%, prosody emotion 35%, fluency penalties up to 30%. Hedging phrases detected by spaCy include: "I think", "I'm not sure", "maybe", "probably", "I believe", "I guess".

### 5.3 Score Bands

| Score Range | Band | Recommendation | Color |
|---|---|---|---|
| 91 – 100 | Exceptional | Fast-track to offer / Advanced practice complete | 🟢 Green |
| 76 – 90 | Strong | Proceed to next round / Good practice progress | 🔵 Blue |
| 61 – 75 | Good | Proceed with reservations / Keep practicing | 🟡 Yellow |
| 41 – 60 | Needs Work | Additional screening needed / More practice required | 🟠 Orange |
| 0 – 40 | Not Ready | Do not proceed / Significant gaps identified | 🔴 Red |

### 5.4 Answer Evaluation Prompt Strategy

Each answer is evaluated using this LLM prompt structure. Note the addition of emotion state for adaptive tone:

```
SYSTEM: You are a senior technical interviewer. Score this answer objectively.
        The candidate's current emotion state is: {emotion_label} (confidence: {confidence_score}).
        If confidence is below 0.4, phrase any follow-up question in a supportive tone.

Question: {question_text}
Expected Key Points: {rubric_points}
Candidate Answer: {answer_transcript}
Role Level: {seniority}
Emotion State: {emotion_label} | Confidence Score: {confidence_score}

Return JSON: {
  score: 0-100,
  dimension_scores: { technical, clarity, structure, completeness, confidence },
  feedback: "specific, actionable feedback",
  missing_concepts: ["concept1", "concept2"],
  strengths: ["what they did well"],
  follow_up_needed: true/false,
  follow_up_question: "question if needed",
  tone: "neutral | supportive"
}
```

---

## 6. API Endpoint Reference

### 6.1 Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register new user (HR or Candidate) |
| `POST` | `/auth/login` | Login, returns JWT token |
| `GET` | `/auth/me` | Get current user profile |

### 6.2 Interview (HR Mode)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/interview/create` | Create interview with JD + job role |
| `GET` | `/interview/{id}` | Get interview session details |
| `POST` | `/interview/{id}/questions` | Generate questions from JD (calls LLM) |
| `GET` | `/interview/{id}/questions` | Fetch generated questions |
| `WS` | `/ws/interview/{session_token}` | WebSocket — real-time interview session |
| `POST` | `/interview/{id}/answer` | Submit audio blob or text answer for evaluation |
| `GET` | `/interview/{id}/score` | Get session score summary |
| `GET` | `/interview/{id}/emotion` | Get per-question emotion trend for session ← NEW |
| `GET` | `/hr/candidates` | List all candidates with scores (HR only) |

### 6.3 Practice Mode

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/practice/start` | Upload resume + select job role → create session |
| `GET` | `/practice/{id}/questions` | Get personalized questions |
| `POST` | `/practice/{id}/answer` | Submit answer, get immediate feedback + emotion snapshot |
| `GET` | `/practice/{id}/report` | Get full practice report with gaps + emotion trend |
| `GET` | `/practice/history` | List all practice sessions for candidate |

### 6.4 Reports

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/reports/{session_id}` | Get full score report (JSON) |
| `GET` | `/reports/{session_id}/pdf` | Download PDF report |
| `GET` | `/reports/{session_id}/summary` | Short summary for sharing |
| `GET` | `/reports/{session_id}/emotion` | Get detailed emotion timeline ← NEW |

---

## 7. Practice Mode — Deep Dive

### 7.1 Resume Parsing Pipeline

```
PDF Upload → pdfminer (extract raw text)
    ↓
spaCy NER → extract: Name, Skills, Companies, Dates, Education
    ↓
LLM Structuring → convert to JSON:
  { skills: [], experience: [{role, company, duration, technologies}],
    education: [], projects: [], total_years_exp: N }
    ↓
Gap Analysis → compare skills in resume vs required skills for target role
    ↓
Question Personalization → weight questions toward gaps
```

### 7.2 Job Role Question Banks

| Role | Core Topics Tested | Resume Gap Focus |
|---|---|---|
| Frontend Developer | React, TypeScript, CSS, Performance, Testing, A11y | Missing: TS, Testing, CSS-in-JS |
| Backend Developer | APIs, DBs, Auth, Caching, System Design, Docker | Missing: Docker, Redis, SQL optimization |
| Full Stack | Both frontend + backend + deployment | Weak areas across stack |
| Data Engineer | Python, SQL, Spark, ETL pipelines, Airflow, Cloud | Missing: Spark, Airflow, Cloud services |
| DevOps | CI/CD, Docker, K8s, Terraform, Monitoring, Linux | Missing: K8s, IaC, monitoring stack |
| Mobile (React Native) | RN, Native APIs, App Store, Performance | Missing: Native modules, App Store |

### 7.3 Practice Report Contents

- Overall Score with band (Exceptional / Strong / Good / Needs Work / Not Ready)
- Per-question score + detailed feedback
- Skills Gap Analysis: what you have vs what the role needs
- Top 3 Strengths identified from answers
- Top 3 Areas to Improve with specific study suggestions
- Recommended resources: docs, courses, topics to review
- Comparison: your score vs average for this role
- **Communication & Confidence section: dominant emotion per question, filler word rate, confidence trend across the session** ← NEW

---

## 8. Emotion Analysis — Deep Dive

### 8.1 Why Emotion Analysis Matters for Interviews

Emotion analysis adds a dimension that LLM answer scoring cannot capture: *how* a candidate delivers their answer, not just *what* they say. A confident delivery of a technically weak answer and a nervous delivery of a technically strong answer are meaningfully different signals for HR. For candidates in practice mode, seeing their confidence trend across questions is a powerful self-improvement tool.

### 8.2 Two Layers of Emotion

| Layer | What It Captures | Tool |
|---|---|---|
| **Speech / Prosody** | Tone, pitch variation, pace, nervousness in voice | SpeechBrain |
| **Text / Linguistic** | Word-level sentiment, emotional framing of content | j-hartmann/emotion-english-distilroberta-base |
| **Linguistic Signals** | Filler words, hedging phrases — confidence proxies | spaCy |

### 8.3 Tool Specifications

#### SpeechBrain (Prosody Emotion)

- **Licence:** Apache 2.0 — fully open source
- **Hardware:** Runs on CPU; no GPU required
- **Input:** Raw audio waveform (WAV or WebM decoded)
- **Output:** Emotion label (happy, sad, angry, neutral, fear, disgust, surprise) + confidence score
- **Why it beats alternatives:** Operates directly on the audio signal before transcription, catching nervousness, hesitation pauses, and pitch drops that disappear once the speech becomes text
- **Install:** `pip install speechbrain`

```python
from speechbrain.pretrained import EncoderClassifier

classifier = EncoderClassifier.from_hparams(
    source="speechbrain/emotion-recognition-wav2vec2-IEMOCAP"
)

def get_prosody_emotion(audio_path: str) -> dict:
    out_prob, score, index, label = classifier.classify_file(audio_path)
    return {"emotion": label[0], "confidence": float(score)}
```

#### j-hartmann/emotion-english-distilroberta-base (Text Emotion)

- **Licence:** MIT — fully open source
- **Model size:** ~80 MB — CPU-friendly
- **Input:** Transcript text string
- **Output:** One of 6 labels — joy, sadness, anger, fear, disgust, surprise, neutral — with probability scores
- **Why it beats plain sentiment:** 6-class classification captures nuance (fear vs sadness vs neutral) that binary positive/negative sentiment misses entirely in an interview context
- **Install:** `pip install transformers torch`

```python
from transformers import pipeline

text_emotion_pipe = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=1
)

def get_text_emotion(transcript: str) -> dict:
    result = text_emotion_pipe(transcript)[0][0]
    return {"emotion": result["label"], "score": result["score"]}
```

#### spaCy Linguistic Signals

spaCy is already in the stack for NLP. Extend `nlp_service.py` to detect:

- **Filler words:** um, uh, like, you know, sort of, kind of, basically, literally
- **Hedging phrases:** I think, I'm not sure, maybe, probably, I believe, I guess, something like that
- **Response length:** very short answers are a nervousness proxy

```python
FILLERS = {"um", "uh", "like", "basically", "literally", "sort", "kind"}
HEDGES  = ["i think", "i'm not sure", "maybe", "probably", "i believe", "i guess"]

def get_linguistic_signals(transcript: str) -> dict:
    doc = nlp(transcript.lower())
    filler_count = sum(1 for t in doc if t.text in FILLERS)
    hedge_count  = sum(1 for h in HEDGES if h in transcript.lower())
    return {"filler_count": filler_count, "hedge_count": hedge_count,
            "word_count": len(doc)}
```

### 8.4 Emotion Aggregator

`emotion_aggregator.py` fuses all three signal sources into a single **composite confidence score** (0–1) and a human-readable **emotion summary** used in both the report and the adaptive prompt engine.

```python
def aggregate_emotion(
    text_emotion: str,
    prosody_emotion: str,
    filler_count: int,
    hedges: list[str]
) -> dict:
    text_score    = {"joy": 1.0, "neutral": 0.7, "surprise": 0.5,
                     "fear": 0.2, "sadness": 0.3, "anger": 0.4}.get(text_emotion, 0.5)
    prosody_score = {"happy": 1.0, "calm": 0.8, "neutral": 0.6,
                     "fear": 0.2, "angry": 0.3}.get(prosody_emotion, 0.5)

    fluency_penalty = min(filler_count * 0.05, 0.3)
    hedge_penalty   = min(len(hedges)   * 0.04, 0.2)

    composite = (text_score * 0.35 + prosody_score * 0.35) - fluency_penalty - hedge_penalty
    composite = max(0.0, min(1.0, composite))

    dominant = text_emotion if text_score < prosody_score else prosody_emotion

    return {
        "composite_confidence": composite,
        "dominant_emotion":     dominant,
        "text_emotion":         text_emotion,
        "prosody_emotion":      prosody_emotion,
        "filler_count":         filler_count,
        "hedge_count":          len(hedges),
    }
```

### 8.5 Emotion-Adaptive Question Generation

The aggregated emotion state is injected into the Gemini prompt for the next question. This makes the interviewer feel responsive and human rather than robotic:

```python
emotion_context = ""
if emotion_snapshot["composite_confidence"] < 0.4:
    emotion_context = (
        "The candidate appears nervous or uncertain. "
        "Phrase the next question in a calm, supportive tone. "
        "Consider a simpler bridging question before returning to harder topics."
    )
elif emotion_snapshot["dominant_emotion"] == "joy":
    emotion_context = (
        "The candidate is engaged and confident. "
        "You may increase question difficulty or probe deeper."
    )

prompt = f"""
You are an adaptive AI interviewer.
{emotion_context}
Previous answer summary: {answer_summary}
Generate the next interview question for a {job_role} candidate.
"""
```

### 8.6 Emotion in the Report

The practice and interview reports include a dedicated **Communication & Confidence** section:

| Metric | Description |
|---|---|
| Dominant emotion | Most frequent emotion label across all answers |
| Confidence trend | Per-question composite score plotted as a line chart |
| Filler word rate | Average fillers per 100 words |
| Hedging frequency | Count of hedge phrases per answer |
| Best question | Question where confidence was highest |
| Worst question | Question where confidence was lowest — flag for practice |

---

## 9. Hackathon Assessment

### 9.1 Is This Good for a Hackathon? YES ✅

| Criteria | Assessment | Score |
|---|---|---|
| WOW Factor | AI that actually interviews you live and adapts to your emotion — very impressive demo | ⭐⭐⭐⭐⭐ |
| Real-World Value | HR tech is a billion-dollar space, solves real pain | ⭐⭐⭐⭐⭐ |
| Technical Depth | LLMs + NLP + Emotion Analysis + Resume Parsing + WebSockets + PDF gen | ⭐⭐⭐⭐⭐ |
| Buildability in 24–48h | MVP is very achievable with right stack | ⭐⭐⭐⭐☆ |
| Demo Flow | Clear story: upload resume → interview → emotion-aware AI → see score | ⭐⭐⭐⭐⭐ |
| Originality | Practice mode + emotion-adaptive interviewer is a fresh idea | ⭐⭐⭐⭐⭐ |
| Judge Appeal | Non-technical judges can immediately understand it | ⭐⭐⭐⭐⭐ |

### 9.2 MVP Scope (Build in 24 Hours)

| Feature | Include in MVP? | Priority |
|---|---|---|
| User auth (JWT) | ✅ Yes | P0 |
| Text-based interview (no voice) | ✅ Yes | P0 |
| LLM question generation from JD | ✅ Yes | P0 |
| LLM answer evaluation + scoring | ✅ Yes | P0 |
| Practice mode with resume upload | ✅ Yes | **P0 — KILLER FEATURE** |
| Resume PDF parsing | ✅ Yes | P0 |
| Score report (JSON → UI) | ✅ Yes | P0 |
| spaCy filler word + hedge detection | ✅ Yes — lightweight, already in stack | P1 |
| j-hartmann text emotion | ✅ Yes — 80MB, CPU, fast to integrate | P1 |
| Score PDF download | ✅ Yes — simple WeasyPrint | P1 |
| Voice input (faster-whisper) | ⏳ If time | P2 |
| SpeechBrain prosody emotion | ⏳ If time — add after voice input | P2 |
| Emotion-adaptive question prompting | ⏳ If time | P2 |
| HR dashboard with multiple candidates | ⏳ If time | P2 |
| Video recording | ❌ Post-hackathon | P3 |

> 💡 **Emotion analysis tip for hackathon:** If you run out of time for SpeechBrain, ship with just j-hartmann (text emotion) + spaCy (filler words). You still get a meaningful confidence score and a compelling "Communication & Confidence" section in the report — judges won't know what you left out.

### 9.3 Hackathon Build Timeline

| Hour | Task | Owner |
|---|---|---|
| 0–2h | Project setup: FastAPI + React + DB schema + env config | Backend |
| 2–5h | Auth system + user models + JWT middleware | Backend |
| 5–9h | LLM service: Gemini API integration + question engine | Backend |
| 9–13h | Answer evaluator + scoring system + practice mode backend | Backend |
| 13–15h | Resume parser + gap analysis service | Backend |
| 15–17h | Emotion service: j-hartmann + spaCy signals + aggregator | Backend |
| 17–18h | Wire emotion state into Gemini adaptive prompt | Backend |
| 2–8h | React UI: Interview screen + question flow + answer input | Frontend |
| 8–14h | Practice mode UI + resume upload + role selector | Frontend |
| 14–18h | Score report UI + charts (Recharts) + emotion trend chart | Frontend |
| 18–22h | Integration testing + bug fixes + polish | Both |
| 22–24h | Deploy to Railway + Vercel + prepare demo script | Both |

### 9.4 Demo Script (2-minute pitch)

1. *"HR uploads a job description for a Backend Developer role."*
2. *"The AI instantly generates 10 tailored interview questions."*
3. *"Candidate gets a link, answers questions — text or voice."*
4. *"AI evaluates each answer live — scores communication, technical accuracy, and behavior."*
5. **"But here's what's different — the AI is also reading the candidate's emotion. It detects nervousness in the voice and phrasing, and adapts its next question to be supportive."**
6. *"HR sees ranked candidates with explainable scores AND a confidence trend for each."*
7. **"NOW — the killer feature: Practice Mode. Candidate uploads their resume..."**
8. *"AI finds skill gaps vs the role they want."*
9. *"Generates a personalized mock interview targeting exactly what they're weak in."*
10. *"They get a detailed report: what to study, where they stand, how they delivered — and how their confidence changed question by question."*

---

## 10. Free & Low-Cost AI Model Reference

| Model | Provider | Free Tier | Best For | Speed |
|---|---|---|---|---|
| Gemini 1.5 Flash | Google AI Studio | 1M tokens/day FREE | Question gen + evaluation + adaptive prompting | ⚡ Fast |
| Gemini 2.0 Flash | Google AI Studio | Free in preview | Best free quality | ⚡ Fast |
| Llama 3.3 70B | Groq | Free (rate limited) | Fast inference, good quality | ⚡⚡ Very Fast |
| Llama 3.1 8B | Groq | Free (higher limits) | Simple tasks, fast responses | ⚡⚡⚡ Fastest |
| Mixtral 8x7B | Groq / Together | Free tier | Good reasoning | ⚡ Fast |
| Claude 3 Haiku | Anthropic API | $0.25/1M input tokens | Best evaluation quality | ⚡ Fast |
| GPT-4o Mini | OpenAI | $0.15/1M input tokens | Solid all-around | ⚡ Fast |
| Mistral 7B | Mistral / Ollama | Free (self-hosted) | Local, private, no API cost | Depends on hardware |
| Phi-3 Mini | Microsoft / Ollama | Free (self-hosted) | Lightweight local model | Fast on CPU |
| faster-whisper | Local | FREE — runs locally | Speech-to-text (4× faster than openai-whisper) | Fast |
| SpeechBrain | Local | FREE — Apache 2.0 | Prosody emotion from audio | Medium (CPU) |
| j-hartmann/emotion-distilroberta | Local (HuggingFace) | FREE — MIT | Text emotion classification, 6-class | Fast (CPU, ~80MB) |

> **For the hackathon:** Use **Gemini 1.5 Flash** as primary and **Groq Llama 3** as fallback. Both are completely free — total cost is **$0**.

---

## 11. Environment Configuration

```env
# .env

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host/dbname
REDIS_URL=redis://localhost:6379

# AI Models (use free tiers)
GOOGLE_API_KEY=your_gemini_api_key          # FREE — get at aistudio.google.com
GROQ_API_KEY=your_groq_api_key              # FREE — get at console.groq.com
ANTHROPIC_API_KEY=your_claude_key           # Optional — $0.25/1M tokens

# Primary model config
PRIMARY_LLM=gemini-1.5-flash                # Use for all main tasks
FALLBACK_LLM=llama-3.3-70b-versatile       # Groq fallback

# STT config
WHISPER_MODEL=base                          # Options: tiny, base, small, medium
WHISPER_BACKEND=faster-whisper             # Use faster-whisper (not openai-whisper)

# Emotion models (loaded at startup, cached in memory)
EMOTION_TEXT_MODEL=j-hartmann/emotion-english-distilroberta-base
EMOTION_SPEECH_MODEL=speechbrain/emotion-recognition-wav2vec2-IEMOCAP
EMOTION_ENABLED=true                        # Set false to skip emotion pipeline in dev

# Storage
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# Auth
SECRET_KEY=your_jwt_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=60

# App
CORS_ORIGINS=["http://localhost:5173", "https://yourapp.vercel.app"]
MAX_QUESTIONS_PER_SESSION=12
MAX_RESUME_SIZE_MB=5
MAX_AUDIO_SIZE_MB=25
```

---

## 12. Final Verdict

### 🏆 Build it. This project wins hackathons.

The AI Interviewer with Practice Mode and Emotion Analysis is a compelling, technically deep, and visually impressive project that judges — technical and non-technical alike — will immediately understand and appreciate. The combination of **FastAPI + Gemini Flash + React** keeps your stack lean and entirely free to run during the hackathon. The **Practice Mode resume gap analysis** and the **emotion-adaptive interviewer** are genuinely novel features that set this apart from every other LLM chatbot demo.

| Strength | Why It Matters |
|---|---|
| Real AI value — not a wrapper | Uses LLMs + NLP + emotion models for complex evaluation, not just chat |
| Two audiences: HR and Candidates | Double the use cases, double the impact |
| Free to run end-to-end | Gemini + Groq + local models = $0 for the entire demo |
| Emotion-adaptive questioning | No other hackathon project will have an AI that reads nervousness and adapts |
| Clean demo story | Upload JD → Interview → Emotion-aware AI → Score is a 2-minute wow moment |
| Resume gap analysis | Personalized mock interviews — it's your differentiator |
| All models lightweight + open-source | faster-whisper, SpeechBrain, j-hartmann all run on CPU with no API cost |

---

*AI Interviewer Platform — PRD v1.1 | Hackathon Edition | March 2026*
