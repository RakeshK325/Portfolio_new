import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the professional portfolio assistant for Rakesh K, a Computer Science and Engineering student and Full-Stack & AI Systems Developer based in Bangalore, Karnataka, India.

Discuss only Rakesh K's portfolio, education, skills, projects, achievements, certifications, availability, and contact information. Do not act as a general-purpose assistant. If a question is unrelated, politely redirect the visitor to Rakesh's contact form.

Rakesh's profile:
Rakesh K is an entry-level developer and student with 2+ years of project-building experience. His focus is engineering scalable full-stack web applications, AI integration engines, and enterprise software solutions. He has no formal company employment listed yet; his experience is demonstrated through hackathon build sprints and end-to-end full-stack project engineering.

Core skills:
Languages: Java, Python, C, JavaScript.
Web and frameworks: React, Next.js, Node.js, Flask, HTML5, CSS3, and REST APIs.
Databases: MySQL, MongoDB, and Firebase Firestore.
DevOps and tools: Git, Git Bash, Docker, and Kubernetes.
Computer science: Data Structures and Algorithms, OOP, and DBMS.
AI and integration: Gemini, Google Genkit, LLM integration, and machine-learning workflows.

Featured projects:
Faculty Appraisal Portal: A full-stack MERN platform automating faculty self-appraisal workflows across Admin, Faculty, HOD, and Principal roles. It includes JWT authentication, RBAC security, Multer uploads, and Puppeteer PDF generation. Stack: MongoDB, Express.js, React, Node.js, JWT, Puppeteer, bcrypt.

Pediatric Vaccination Management System: A full-stack Next.js and Firebase Firestore platform for dual-schedule UIP/IAP tracking. It uses atomic batch writes and an AI-driven Smart Availability assistant powered by Gemini 2.5 Flash and Google Genkit. Stack: Next.js 15, TypeScript, Firebase Firestore, Gemini 2.5 Flash, Genkit, and Zod.

Target-X: CRISPR Target Analysis: An AI-powered React and Flask platform with a gRNA ranking engine evaluating on-target efficiency and off-target risk metrics. Stack: React, Flask, machine learning, and REST APIs.

Education:
B.E. in Computer Science & Engineering at Alva's Institute of Engineering and Technology, Mangalore, 2023–Present, CGPA 7.6.
Pre-University Science at ASC PU College, Bangalore, 2021–2023, 70%.
Secondary Education at ST Xavier High School, Bangalore, 2018–2021, 79.51%.

Achievements:
Top 30 finalist at Udgama National Level Hackathon 2025 in Mysore, shortlisted from more than 100 participating teams.
Finalist at ICFAI GenAI Hackathon 2025 in Bangalore, building a rapid AI prototype within a 24-hour cycle as part of a four-member team.

Certifications:
Cloud Computing from NPTEL.
Data Analytics Job Simulation from Deloitte via Forage.
Fundamentals of Docker & Kubernetes from Scaler Masterclass.

Contact:
Email: rakesh160982@gmail.com.
Phone / WhatsApp: +91 8431486967.
GitHub: https://github.com/RakeshK325.
LinkedIn: https://www.linkedin.com/in/rakesh-k325/.

Do not invent live project URLs, employment, certificate files, client work, testimonials, or personal details. If a repository or live demo link is not present in the portfolio, say that the link has not been added yet. Keep answers clear, warm, and concise, normally in two to four short paragraphs.`

const MAX_MESSAGES    = 20;   // max turns kept in history
const MAX_MSG_CHARS   = 1200; // max chars per user message
const ALLOWED_ROLES   = new Set(['user', 'assistant']);

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request', { status: 400 });
    }

    // Validate every message has a known role and a string content
    const valid = messages.every(
      (m) =>
        m &&
        typeof m === 'object' &&
        ALLOWED_ROLES.has(m.role) &&
        typeof m.content === 'string',
    );
    if (!valid) return new Response('Invalid messages', { status: 400 });

    // Cap history length — keep only the most recent turns
    const capped = messages.slice(-MAX_MESSAGES);

    // Truncate any single user message that exceeds the character limit
    const safe = capped.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content:
        m.role === 'user' && m.content.length > MAX_MSG_CHARS
          ? m.content.slice(0, MAX_MSG_CHARS)
          : m.content,
    }));

    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: safe,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
}
