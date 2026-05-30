# HTML RAG Agent

## Description

A powerful AI-powered agent that uses Retrieval-Augmented Generation (RAG) to answer questions about specific HTML document content. Users can upload HTML files or provide URLs, and the agent will extract relevant information from the DOM to provide context-aware answers.

## Features

- **Document Upload**: Upload HTML files directly for analysis
- **URL Scraping**: Provide a URL to scrape and analyze the page content
- **AI Q&A**: Chat with your documents using advanced RAG techniques
- **File Analysis**: Extract and analyze text content from uploaded HTML
- **Streaming Responses**: Real-time streaming of AI-generated responses
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS

## Tech Stack

### Frontend

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: React Hooks
- **Icons**: Lucide React

### AI & RAG

- **Framework**: [LangChain.js](https://js.langchain.com/)
- **Embedding Model**: Google OR-Tools (via @google/generative-ai)
- **Vector Store**: In-memory vector store
- **Model**: Gemini (via @google/generative-ai)

## Prerequisites

- Node.js 18.0.0 or higher
- npm, yarn, pnpm, or bun

## Installation

1. **Clone the repository** (if applicable)

2. **Install dependencies**:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Set up environment variables**:

Create a `.env` file in the root directory with the following variables:

```env
# Required environment variables
NEXT_PUBLIC_GOOGLE_API_KEY="your_google_api_key_here"
```

> **Note**: Replace `your_google_api_key_here` with your actual Google Gemini API key.

## Usage

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
