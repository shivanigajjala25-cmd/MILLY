# MILLY — AI-Powered PTSD Support Companion

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21%2B%20%2F%2024-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-cyan.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> **Important Healthcare Disclaimer:**
> **MILLY is an AI-based educational and emotional-support prototype.** It does not diagnose PTSD, provide clinical medical treatment, or replace a licensed mental health professional. If you or someone you know is in immediate physical danger, please contact local emergency services (911, 112, 999) or dial the **988 Suicide & Crisis Lifeline** immediately.

---

## 1. Problem Statement

Post-Traumatic Stress Disorder (PTSD) affects millions of trauma survivors worldwide. Individuals living with PTSD frequently struggle with sudden intrusive flashbacks, debilitating nightmares, hypervigilance, and unexpected sensory triggers. While psychotherapy (such as EMDR and Cognitive Processing Therapy) is highly effective, survivors frequently experience acute distress outside clinic hours—at home, late at night, or in crowded public environments.

Most general-purpose AI conversational agents are ill-suited for trauma support:
- They can hallucinate unverified medical advice.
- They lack domain-bounded emotional grounding.
- They depend on external cloud APIs that transmit sensitive thoughts to third parties.
- They lack architectural separation between conversational dialogue and deeply confidential private journal notes.

---

## 2. Objective

**MILLY** is an open-source, domain-specific AI support companion designed specifically around PTSD trauma recovery and emotional regulation.

Key objectives:
1. Provide instant, evidence-informed trauma psychoeducation and somatic grounding.
2. Accurately categorize user intents across 15 PTSD-specific domains.
3. Detect user emotional states across 7 affective categories.
4. Intercept acute crisis / self-harm language before response generation.
5. Retrieve curated, evidence-based coping literature using local TF-IDF cosine similarity without external paid LLMs.
6. Enforce a strict architectural privacy wall between the AI dialogue engine and the user's PIN-locked digital journal.

---

## 3. Technology Stack

- **Backend:** Java 21+ / Java 24, Spring Boot 3.3.4 (REST Controllers, Spring Data JPA, HikariCP)
- **Database:** SQLite embedded database (`milly.db`) with Hibernate Community Dialect
- **NLP & Machine Learning Engine:** Native Java Machine Learning:
  - Text Normalization & N-gram Tokenizer
  - TF-IDF Vectorizer with smooth IDF & L2-normalization
  - Multinomial Logistic Regression (Softmax Regression) trained with Gradient Descent and L2-regularization
  - Evaluation metric calculation (Accuracy, Precision, Recall, Macro F1-score)
- **Information Retrieval:** Local TF-IDF Cosine Similarity index over curated PTSD knowledge base
- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons, Recharts

---

## 4. System Architecture

```
                    USER
                      |
                      v
             [ React 19 Frontend ]
             (Vite + Tailwind CSS)
                      |
                      | HTTP REST (/api/chat)
                      v
        ┌─────────────────────────────┐
        │   Spring Boot 3 Backend     │
        └──────────────┬──────────────┘
                       |
                       v
         [ Safety & Crisis Detector ] ──(Crisis Detected)──> [ Immediate 988 Safety Response ]
                       | (Safe)
        ┌──────────────┴──────────────┐
        v                             v
[ Intent Classifier ]      [ Emotion Classifier ]
(TF-IDF + Softmax)         (TF-IDF + Softmax)
        |                             |
        └──────────────┬──────────────┘
                       v
          [ Knowledge Retriever ]
       (Cosine Similarity Search on
         20-Topic PTSD KB JSON)
                       |
                       v
            [ Response Engine ]
      (Combines Intent + Emotion +
     Retrieved Knowledge + Context)
                       |
                       v
           [ Personalized Response ]
                       +
        [ Coping Recommendation ]
```

---

## 5. Architectural Privacy Wall (Zero-AI Journal)

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│         MILLY AI CHAT           │       │         PRIVATE JOURNAL         │
│                                 │       │                                 │
│  - /api/chat                    │       │  - /api/journal/*               │
│  - NLP Classification           │  X    │  - PIN-Protected (e.g. 1234)   │
│  - RAG Knowledge Retrieval      │ <---> │  - Isolated Database Table      │
│  - Session context buffer       │       │  - ZERO AI ACCESS               │
│  - Temporary (sliding 10 msgs)  │       │  - Encrypted / Local only       │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

The system strictly guarantees that:
- The AI pipeline does **not** read, query, or summarize private journal entries.
- If a user wishes to share a thought with MILLY, they must explicitly copy and paste it into the chat window themselves.

---

## 6. Supervised NLP & ML Methodology

### A. Intent Classification (15 Categories)
1. `greeting`
2. `ptsd_information`
3. `anxiety`
4. `panic`
5. `flashback`
6. `nightmare`
7. `sleep_problem`
8. `trigger`
9. `grounding`
10. `emotional_distress`
11. `coping`
12. `professional_help`
13. `gratitude`
14. `goodbye`
15. `crisis`

### B. Emotion Classification (7 Categories)
- `fear`
- `anxiety`
- `sadness`
- `anger`
- `calm`
- `neutral`
- `distress`

### C. Mathematical Formulation
- **Smooth Inverse Document Frequency (IDF):**
  $$\text{IDF}(t) = \ln\left(\frac{1 + N}{1 + \text{DF}(t)}\right) + 1$$
- **L2-Normalized TF-IDF Feature Vector:**
  $$v_i = \frac{\text{TF-IDF}_i}{\sqrt{\sum_{j} \text{TF-IDF}_j^2}}$$
- **Multinomial Softmax Probabilities:**
  $$P(y = k \mid x) = \frac{\exp(w_k^T x + b_k)}{\sum_{m=0}^{K-1} \exp(w_m^T x + b_m)}$$
- **Loss Function with L2-Regularization:**
  $$J(W, b) = -\frac{1}{N} \sum_{i=1}^N \ln P(y^{(i)} \mid x^{(i)}) + \frac{\lambda}{2} \sum_{k} \sum_{j} W_{k, j}^2$$

---

## 7. Model Evaluation & Telemetry

On application startup, the Spring Boot engine performs an 80/20 train/test split on both datasets and prints the verification report to the terminal:

```
=================================================
  INTENT CLASSIFIER MODEL EVALUATION RESULTS     
=================================================
Total samples: 305, Train split: 244, Test split: 61
Accuracy:  63.93% (0.6393)
Precision: 0.6005
Recall:    0.5983
F1 Score:  0.5757
=================================================
```

A live **AI Insight** panel is built into the UI so instructors and students can observe:
- Intent prediction and confidence percentage
- Emotion prediction
- Retrieved topics from the 20-article knowledge base
- Recommended somatic coping action

---

## 8. Curated PTSD Knowledge Base (20 Topics)

The knowledge base (`knowledge_base.json`) contains evidence-informed educational articles:
1. What is PTSD?
2. PTSD Symptoms & Four Clusters
3. Understanding Flashbacks
4. Trauma-Related Nightmares
5. Identifying and Managing Triggers
6. Hypervigilance & Constant Alertness
7. PTSD-Related Anxiety
8. Handling Acute Panic Surges
9. Sleep Disturbances and Insomnia
10. The Science of Grounding Techniques
11. The 5-4-3-2-1 Sensory Method
12. Box Breathing (4x4 Breathwork)
13. Progressive Muscle Relaxation (PMR)
14. Holistic Coping Strategies for Everyday Life
15. When to Seek Professional Help
16. PTSD and Interpersonal Relationships
17. Navigating PTSD in Daily Life & Work
18. PTSD in Pregnancy & Postpartum Experiences
19. Difference Between PTSD and Normal Stress
20. Recovery Pathways & Clinical Treatment

---

## 9. Interactive Coping Toolkit

- **5-4-3-2-1 Grounding:** Step-by-step interactive sensory counter (5 see, 4 touch, 3 hear, 2 smell, 1 taste).
- **Box Breathing:** 4s inhale, 4s hold, 4s exhale, 4s hold with animated expanding breathing circle.
- **Progressive Muscle Relaxation (PMR):** Guided muscle group tension and release protocol.
- **Safe Place Visualization:** Multi-sensory guided imagery for calming autonomic arousal.
- **Calm Mode:** Minimal, low-stimulation screen ("Breathe. You're here right now.").

---

## 10. How to Run the Application

### Prerequisites
- Java JDK 21 or later (`java -version`)
- Node.js 18+ and npm (`node -v`)

### Step 1: Start the Java Spring Boot Backend
```bash
cd backend
# Windows:
.\mvnw.cmd spring-boot:run

# Linux / macOS:
./mvnw spring-boot:run
```
The backend starts at `http://localhost:8080`. SQLite database (`milly.db`) will be automatically created and seeded.

### Step 2: Start the React Frontend
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend dev server starts at `http://localhost:5173`. Open your browser at `http://localhost:5173`.

### Step 3: Run Automated Test Suite
To run the backend test suite:
```bash
cd backend
.\mvnw.cmd test
```

## 11. Public Demo Deployment (Render + Vercel)

> **Deployment scope:** This is a single-user educational prototype, not a production healthcare service. The wellness endpoints do not authenticate users, journal sessions are held in backend memory, and journal content is stored as plaintext in SQLite. There is no login system for wellness data, rate limiting, or clinical safety monitoring. Do not enter real journal entries, health information, or other sensitive personal data. Use synthetic demo data only.

This setup hosts the Spring Boot API on Render with a persistent disk for SQLite and the Vite frontend on Vercel. Run only one backend instance because SQLite and journal sessions are not configured for horizontal scaling.

### 1. Deploy the backend to Render

1. Push the project to GitHub and create a Render **Web Service** connected to the `MILLY` repository and `main` branch.
2. Set **Root Directory** to `backend`, choose **Docker**, and select a plan that supports a persistent disk.
3. Add a disk named `milly-data`, mounted at `/data`. Keep the service at one instance.
4. Add these environment variables in Render. Generate a unique PIN of at least 8 digits and enter it directly in Render; do not put it in GitHub or a checked-in `.env` file.

  | Name | Value |
  | --- | --- |
  | `DATA_DIR` | `/data` |
  | `APP_DEMO_DATA_ENABLED` | `false` |
  | `MILLY_INITIAL_JOURNAL_PIN` | A private PIN with at least 8 digits |
  | `APP_CORS_ALLOWED_ORIGINS` | The exact Vercel site origin, added in step 3 |

5. Set the health check path to `/api/health` and deploy. Render supplies `PORT` automatically.
6. Open `https://<your-render-service>.onrender.com/api/health`. Continue only when the response reports `UP` and both models are ready.

The initial PIN is stored using BCrypt. If a database already exists on the persistent disk, initialization will keep that database and will not reseed its contents. The checked-in SQLite file is removed from the next Git revision, but remains in earlier Git history; rewrite repository history before deployment if it ever contained real personal data.

### 2. Deploy the frontend to Vercel

1. Import the same GitHub repository as a Vercel project.
2. Set **Root Directory** to `frontend`; use the Vite defaults (`npm run build`, output directory `dist`).
3. Add the environment variable `VITE_API_BASE_URL` with `https://<your-render-service>.onrender.com/api`.
4. Deploy and copy the exact site origin, such as `https://milly-demo.vercel.app` (no trailing slash).

### 3. Restrict API CORS and verify

1. In Render, set `APP_CORS_ALLOWED_ORIGINS` to the exact Vercel origin from step 2. For a Vercel preview deployment, add its exact origin too, separated by a comma.
2. Redeploy the backend after changing the variable.
3. Open the Vercel URL and verify chat, dashboard, grounding, and journal PIN verification. Check the Render `/api/health` endpoint again after each backend deploy.

The API URL is compiled into the frontend at build time; redeploy the Vercel project whenever `VITE_API_BASE_URL` changes. Keep the Render disk attached and back it up before maintenance. Do not scale the backend to multiple instances.

### Deployment hardening still required for real users

- Add real user accounts and authorization to all data APIs. At present, dashboard, check-in, and grounding data use a shared demo user and are not private between visitors.
- Move journal session storage out of process memory, add expiration/revocation controls, login rate limiting, and stronger authentication.
- Encrypt journal content at rest and use a managed database with backups and a documented retention/deletion policy before storing personal data.
- Arrange qualified clinical, privacy, and security review before describing this as a mental-health treatment or crisis-response service.

---

## 12. Verification Scenarios

| Scenario | User Input | Classified Intent | Expected Output |
| :--- | :--- | :--- | :--- |
| **1. Flashback** | *"I keep remembering what happened"* | `flashback` | Empathetic validation + Grounding technique |
| **2. Nightmare** | *"I can't sleep because I keep having nightmares."* | `nightmare` | Sleep grounding guidance + bed anchors |
| **3. Trigger** | *"Loud noises suddenly make me terrified."* | `trigger` | Psychoeducation on sensory alarm + Grounding |
| **4. Education** | *"What exactly is PTSD?"* | `ptsd_information` | Educational summary of neurobiology & recovery |
| **5. Panic / Grounding** | *"Help me calm down."* | `panic` or `grounding` | Immediate invitation to 5-4-3-2-1 or Box Breathing |
| **6. Crisis Intervention** | *"I don't want to live anymore."* | `crisis` | Intercepted! Dedicated crisis response + 988 emergency help button |

---

## 13. Responsible AI & Ethical Considerations

- **No Medical Claims:** MILLY explicitly declares that it cannot diagnose PTSD or replace licensed healthcare providers.
- **Safety Priority:** High-risk self-harm phrases bypass normal conversational flows and trigger emergency intervention resources.
- **Local Autonomy:** Runs entirely on local infrastructure with zero tracking, external telemetry, or reliance on commercial cloud APIs.
- **Privacy by Design:** Digital journaling is architecturally isolated from the AI retrieval pipeline with PIN access control.
