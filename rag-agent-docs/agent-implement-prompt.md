<role_and_context>
- role: Eres un experto en desarrollo de aplicaciones y agentes de IA utilizando LangChain, Next.js (App Router), TypeScript y Tailwind CSS.
- context: Necesito integrar la lógica de un agente RAG (que actualmente se ejecuta a nivel global/script) dentro de una interfaz gráfica de chat moderna, similar a ChatGPT. La aplicación debe ser interactiva y visualmente atractiva.
</role_and_context>

<requirements>
La interfaz y arquitectura deben cumplir con las siguientes características:
1. **Diseño Visual (UI - Estilo ChatGPT):**
   - Diseño limpio y minimalista utilizando Tailwind CSS.
   - Un área principal scrollable para mostrar el historial de mensajes, con burbujas de chat diferenciadas visualmente (Usuario vs Asistente).
   - Un área de entrada de texto fija en la parte inferior.
   - Un botón para enviar el mensaje (puedes usar un icono SVG simple o iconos si están disponibles).
   - Tipografía moderna e interfaz responsive.

2. **Refactorización de Arquitectura (Next.js):**
   - **Backend:** El código actual ejecuta LangChain a nivel superior (top-level await). Debes refactorizar esta lógica hacia una **Server Action** (dentro de una carpeta `actions/` o `src/actions/`) para que el agente se ejecute bajo demanda cuando el usuario envíe una pregunta. (No uses API Routes).
   - **Frontend:** Mantén `page.tsx` como un **Server Component**. Extrae toda la lógica interactiva (el estado de la conversación, el input y los mensajes) a un nuevo componente cliente en la carpeta `/sections/`  (ej. `ChatClient.tsx` o `ChatUI.tsx` con `"use client"`) y renderízalo dentro de `page.tsx`.

3. **Experiencia de Usuario (UX):**
   - Mostrar un indicador de estado de carga (loading/typing indicator) mientras el agente genera la respuesta.
   - Limpiar el cuadro de texto al enviar el mensaje.
   - Scroll automático hacia el último mensaje.
</requirements>

<source_code_files>
- app/page.tsx: Contiene la logica base del agente RAG (que debe ser refactorizada) y la plantilla por defecto (que debe ser reemplazada).
- carpeta .agents/: Convenciones y rules del proyecto que debes seguir.
</source_code_files>

<execution_instructions>
1. Analiza el código actual en `page.tsx` y las reglas en `.agents/`.
2. Genera un plan detallado explicando cómo separarás la lógica del backend (LangChain) del frontend (UI).
3. Proporciona el código completo y refactorizado, indicando en qué archivo va cada bloque de código (ej. el Client Component de la UI y el handler del backend).
</execution_instructions>