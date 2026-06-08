import { ChatClient } from '@/sections/ChatClient';

export const metadata = {
  title: 'Asistente de Constitución de Empresas RAG',
  description: 'Un agente inteligente para ayudarte a constituir tu empresa en Chile, con información oficial indexada.',
};

export default function Home() {
  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden">
      <ChatClient />
    </main>
  );
}

