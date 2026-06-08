'use server';

import { askAgent, type ChatMessage } from '@/lib/ragAgent';

interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server Action to process a chat message sending event.
 * Invokes the RAG agent with the conversation history.
 *
 * @param messages The chat history including the new message.
 * @returns A promise resolving to an ActionResponse with the agent response.
 */
export async function sendMessageAction(
  messages: ChatMessage[],
): Promise<ActionResponse<string>> {
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        success: false,
        error: 'El historial de mensajes no es válido o está vacío.',
      };
    }

    const responseContent = await askAgent(messages);

    return {
      success: true,
      data: responseContent,
    };
  } catch (error) {
    console.error('[Server Action] Error processing chat message:', error);
    
    // Friendly error message in Spanish for the user interface
    const userFriendlyMessage = error instanceof Error 
      ? `Error al comunicarse con el agente: ${error.message}`
      : 'Ocurrió un error inesperado al procesar tu solicitud.';

    return {
      success: false,
      error: userFriendlyMessage,
    };
  }
}
