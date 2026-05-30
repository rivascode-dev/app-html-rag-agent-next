# HTML RAG Agent
## HTML RAG Agent whit Langchain, TypeScript and Next.js.

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
OPENAI_API_KEY="your_openai_api_key_here"
```

> **Note**: Replace `your_openai_api_key_here` with your actual OpenAI API key.

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


