'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sendMessageAction } from '@/actions/chat';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: '¡Hola! Soy tu asistente inteligente para la constitución de empresas en Chile. He indexado información oficial de ChileAtiende, guías paso a paso de Nexbu y recomendaciones de Lofwork. Pregúntame sobre plazos, requisitos o pasos necesarios para crear tu empresa.',
};

const SUGGESTED_QUESTIONS = [
  '¿Cuáles son los pasos para crear una empresa en Chile?',
  '¿Qué es "Tu Empresa en un Día" y cómo funciona?',
  '¿Cuánto tiempo se demora en promedio crear una empresa?',
  '¿Cuáles son los requisitos básicos?',
];

export function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Set isClient to true once component mounts to avoid hydration issues with localStorage
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('rag_chat_messages');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load chat history from localStorage:', error);
        setMessages([INITIAL_WELCOME_MESSAGE]);
      }
    } else {
      setMessages([INITIAL_WELCOME_MESSAGE]);
    }
  }, []);

  // Sync messages with localStorage
  useEffect(() => {
    if (isClient && messages.length > 0) {
      localStorage.setItem('rag_chat_messages', JSON.stringify(messages));
    }
  }, [messages, isClient]);

  // Scroll to the bottom when messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Pass the entire history to maintain context
      const response = await sendMessageAction(updatedMessages);

      if (response.success && response.data) {
        setMessages((prev) => [...prev, { role: 'assistant', content: response.data as string }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: response.error || 'Lo siento, no pude procesar tu mensaje. Inténtalo nuevamente.',
          },
        ]);
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Ocurrió un error inesperado al enviar el mensaje. Revisa tu conexión e inténtalo más tarde.',
        },
      ]);
    } finally {
      setIsLoading(false);
      // Refocus textarea after sending
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  const handleClearChat = () => {
    if (confirm('¿Estás seguro de que deseas borrar el historial de conversación?')) {
      setMessages([INITIAL_WELCOME_MESSAGE]);
      localStorage.removeItem('rag_chat_messages');
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-[#0b0c10] dark:text-zinc-100">
      {/* Sidebar for Desktop & Mobile Toggle */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-zinc-200/80 bg-white p-5 transition-transform duration-300 dark:border-zinc-800/80 dark:bg-[#12141c] md:static md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-0 -translate-x-72 md:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold tracking-tight text-zinc-950 dark:text-white">RAG Empresa CL</span>
          </div>
          
          {/* Close Sidebar Button (Mobile) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <button
          onClick={handleClearChat}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 active:scale-98 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Limpiar conversación
        </button>

        {/* Sidebar content: Sources info */}
        <div className="mt-8 flex-1 overflow-y-auto pr-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Fuentes indexadas</h3>
          <div className="mt-3 space-y-3.5">
            <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/50 p-3.5 dark:border-zinc-800/60 dark:bg-zinc-900/40">
              <h4 className="text-xs font-medium text-zinc-800 dark:text-zinc-200">ChileAtiende</h4>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Ficha oficial del trámite "Tu empresa en un día".</p>
              <a
                href="https://www.chileatiende.gob.cl/fichas/21409-tu-empresa-en-un-dia"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Ver sitio
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>

            <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/50 p-3.5 dark:border-zinc-800/60 dark:bg-zinc-900/40">
              <h4 className="text-xs font-medium text-zinc-800 dark:text-zinc-200">Nexbu Blog</h4>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Guía paso a paso sobre cómo constituir una empresa.</p>
              <a
                href="https://nexbu.com/blog/como-constituir-empresa-chile-guia-paso-paso"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Ver sitio
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>

            <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/50 p-3.5 dark:border-zinc-800/60 dark:bg-zinc-900/40">
              <h4 className="text-xs font-medium text-zinc-800 dark:text-zinc-200">Lofwork Guía</h4>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Los 5 pasos fundamentales para crear una empresa.</p>
              <a
                href="https://www.lofwork.cl/5-pasos-para-crear-una-empresa-en-chile/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Ver sitio
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-zinc-200/60 pt-4 dark:border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Agente RAG Activo</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-zinc-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800/80 dark:bg-[#0b0c10]/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-sm font-semibold text-zinc-900 dark:text-white md:text-base">Agente RAG - Constitución de Empresas</h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Basado en LangChain y OpenAI</p>
            </div>
          </div>
        </header>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto max-w-3xl space-y-6">
            {isClient && messages.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={index}
                  className={cn(
                    'flex w-full gap-4 items-start animate-fade-in duration-200',
                    isAssistant ? 'justify-start' : 'justify-end'
                  )}
                >
                  {/* Assistant Avatar */}
                  {isAssistant && (
                    <div className="flex h-9.5 w-9.5 shrink-0 select-none items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/10">
                      <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      'prose prose-zinc dark:prose-invert max-w-[80%] rounded-2xl px-4.5 py-3.5 text-sm shadow-sm md:text-base leading-relaxed',
                      isAssistant
                        ? 'bg-white border border-zinc-200/60 text-zinc-800 dark:bg-[#12141c] dark:border-zinc-800/80 dark:text-zinc-200 rounded-tl-none'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-blue-600/10'
                    )}
                  >
                    <p className="whitespace-pre-line break-words">{msg.content}</p>
                  </div>

                  {/* User Avatar */}
                  {!isAssistant && (
                    <div className="flex h-9.5 w-9.5 shrink-0 select-none items-center justify-center rounded-xl bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Suggested Questions (Show only on start of conversation) */}
            {isClient && messages.length === 1 && !isLoading && (
              <div className="pt-4 animate-fade-in">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider dark:text-zinc-500 mb-3 ml-1">Preguntas sugeridas</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(question)}
                      className="text-left rounded-xl border border-zinc-200 bg-white p-3.5 text-xs font-medium text-zinc-700 transition-all hover:bg-zinc-50/80 hover:border-zinc-300 active:scale-98 dark:border-zinc-800 dark:bg-[#12141c] dark:text-zinc-300 dark:hover:bg-zinc-800/50 dark:hover:border-zinc-700/80"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex w-full gap-4 items-start justify-start">
                <div className="flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/10">
                  <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="bg-white border border-zinc-200/60 rounded-2xl rounded-tl-none px-5 py-4 dark:bg-[#12141c] dark:border-zinc-800/80">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Box Area */}
        <div className="border-t border-zinc-200/80 bg-white/70 px-4 py-4 backdrop-blur-md dark:border-zinc-800/80 dark:bg-[#0b0c10]/70 md:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="relative flex items-end rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 shadow-lg focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900/60">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu consulta sobre constitución de empresas aquí..."
                rows={1}
                disabled={isLoading}
                className="flex-1 resize-none bg-transparent py-1 text-sm outline-none placeholder:text-zinc-400 max-h-40 min-h-[24px] dark:placeholder:text-zinc-500 md:text-base"
              />
              
              <button
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || isLoading}
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 active:scale-95',
                  input.trim() && !isLoading
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10'
                    : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                )}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-zinc-400 dark:text-zinc-500">
              El agente consulta el contenido de los blogs indexados. Las respuestas dependen de la información recuperada.
            </p>
          </div>
        </div>
      </div>

      {/* Backdrop overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden"
        />
      )}
    </div>
  );
}
