# Task Master

Task Master is an all-in-one productivity tool combining task management, AI assistance, and time tracking.

## Technologies

- Vite (Build Tool)
- React (UI Framework)
- React Router (Routing)
- Tailwind CSS (Styling)
- MUI Icons (Icons Library)
- GitHub Pages (Deployment)

## Key Features

- **Task Management**: Create, edit, and delete tasks with ease
- **AI Chat Assistant**: Natural language chat with one-click task generation
- **Customizable Timer**: Set timer from tasks or manually input custom duration
- **Status Tracking**: Monitor daily productivity
- **Responsive Design**: Seamless experience on both desktop and mobile
- **Local Storage**: Task and timer data persists between sessions
- **Toast Notifications**: Instant feedback for user actions

## Getting Started

1. Copy the environment file and add your OpenAI API key:

   ```bash
   cp .env.example .env
   ```

   Then open `.env` and add your OpenAI API key:

   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run development server:

   ```bash
   npm run dev
   ```
