# Asistente RAG para la Constitución de Empresas en Chile

Este proyecto es una aplicación web interactiva que implementa un agente RAG (Retrieval-Augmented Generation) para responder preguntas sobre la constitución y creación de empresas en Chile. Está construido con **Next.js (App Router)**, **LangChain.js**, **TypeScript** y **Tailwind CSS v4**.

---

## 📖 Contexto del Proyecto

El proceso de creación de empresas en Chile puede ser complejo debido a las diversas plataformas, requisitos legales y trámites necesarios. Este asistente de inteligencia artificial está diseñado para consolidar, analizar y recuperar información clave a partir de tres fuentes de referencia confiables:

1. **ChileAtiende (Ficha Oficial):** Detalle del trámite "Tu Empresa en un Día" (Constitución de Sociedades).
2. **Blog de Nexbu:** Guía paso a paso sobre cómo constituir una empresa en Chile de forma práctica.
3. **Lofwork:** Los 5 pasos fundamentales para la creación de empresas y consejos de gestión.

El agente utiliza un modelo de lenguaje de última generación combinando la recuperación de documentos de estas fuentes para ofrecer respuestas precisas, contextualizadas y seguras, reduciendo la posibilidad de alucinación mediante instrucciones de sistema estrictas.

---

## 🛠️ Arquitectura y Estructura del Código

El proyecto sigue una arquitectura limpia adaptada para Next.js, separando rigurosamente la lógica del servidor (RAG y LangChain) de la interfaz de usuario interactiva (Client Component):

- 📂 **`src/lib/ragAgent.ts`**: Contiene la lógica central del agente.
  - Implementa un **Vector Store en memoria (`MemoryVectorStore`)** con inicialización perezosa (Lazy Initialization). Los documentos se descargan mediante `CheerioWebBaseLoader` y se indexan una única vez al recibir la primera consulta, optimizando los tiempos de compilación (`next build`).
  - Utiliza los embeddings `text-embedding-3-large` de OpenAI y el modelo `gpt-4o-mini` para procesar el agente.
  - Define la herramienta `retrieve` que busca similitud semántica y la inyecta al agente de LangChain.
- 📂 **`src/actions/chat.ts`**: Server Action (`sendMessageAction`) que actúa como endpoint seguro del servidor. Recibe el historial de conversación, invoca al agente RAG y retorna una respuesta estructurada `{ success, data, error }`.
- 📂 **`src/sections/ChatClient.tsx`**: Componente cliente (`"use client"`) que maneja el estado de la conversación (mensajes, estados de carga y redimensionado de entrada) y renderiza la interfaz al estilo ChatGPT.
- 📂 **`src/app/page.tsx`**: Server Component limpio de la ruta raíz que define los metadatos SEO y renderiza al cliente de chat.

---

## ✨ Características y Funcionalidad

1. **Diseño Visual Premium (Estilo ChatGPT):**
   - Interfaz minimalista optimizada para modo claro y modo oscuro de forma nativa.
   - Panel lateral (Sidebar) interactivo que detalla las fuentes oficiales indexadas con enlaces externos y proporciona un botón rápido para limpiar el chat.
   - Burbujas de chat diferenciadas mediante avatares y degradados modernos para el usuario y el asistente.
2. **Persistencia Local de Conversaciones:**
   - El historial de chat se guarda automáticamente en el `localStorage` del navegador.
   - Cuenta con una salvaguarda de hidratación de React 19 para evitar parpadeos o errores de inconsistencia del servidor durante el renderizado estático.
3. **Experiencia de Usuario Interactiva (UX):**
   - **Preguntas Sugeridas:** Se muestran tarjetas de sugerencias al iniciar una conversación para facilitar la interacción al usuario.
   - **Indicador de Carga Animado:** Un indicador de "escribiendo..." de tipo burbuja rebota suavemente mientras el backend procesa la solicitud del agente.
   - **Auto-Scroll:** Desplazamiento automático fluido hacia el último mensaje enviado o recibido.
   - **Caja de Entrada Inteligente:** Entrada basada en `textarea` que se expande verticalmente según el texto ingresado, soportando salto de línea con `Shift+Enter` y envío con `Enter`.

---

## 🚀 Tecnologías Utilizadas

- **Framework:** Next.js 16.2.6 (React 19, App Router)
- **RAG & IA Framework:** LangChain.js
- **Modelos IA:** OpenAI (GPT-4o-mini & Text-Embedding-3-Large)
- **Scraping y Parseo:** Cheerio
- **Estilos:** Tailwind CSS v4
- **Validaciones:** Zod
- **Utilidades:** clsx, tailwind-merge

---

## 💻 Instalación y Configuración

### Prerrequisitos

- Node.js 18.0.0 o superior.
- Gestor de paquetes `pnpm` (recomendado), `npm` o `yarn`.

### Pasos

1. **Clonar e instalar dependencias:**
   ```bash
   pnpm install
   ```

2. **Configurar Variables de Entorno:**
   Crea un archivo `.env` en la raíz del proyecto y agrega tu API Key de OpenAI:
   ```env
   OPENAI_API_KEY="tu-api-key-de-openai-aqui"
   ```

3. **Ejecutar en modo Desarrollo:**
   ```bash
   pnpm dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para interactuar con la aplicación.

4. **Compilar para Producción:**
   ```bash
   pnpm build
   ```



