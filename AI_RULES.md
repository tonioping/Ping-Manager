# AI Development Rules - PingManager

## Tech Stack
- **React 18 & TypeScript**: Core framework for building a type-safe, component-based UI.
- **Tailwind CSS**: Utility-first styling for rapid, responsive, and consistent design.
- **Lucide React**: Standard library for all iconography across the application.
- **Recharts**: Used for all data visualizations, specifically Radar and Line charts for player progression.
- **Google Gemini AI**: Integration via `@google/genai` for intelligent coaching assistance and planning.
- **Supabase**: Backend-as-a-Service for authentication and PostgreSQL database management.
- **Vite**: Modern build tool for fast development and optimized production builds.
- **ESM.sh**: Dependency management via import maps in `index.html` for browser-native module loading.

## Development Rules & Library Usage

### 1. Styling & Design
- **Tailwind Only**: Use Tailwind CSS classes for all styling. Avoid writing custom CSS in `index.css` unless it's for global resets or complex animations.
- **Design System**: Follow the established "PingManager" aesthetic:
  - Use `rounded-[2.5rem]` or `rounded-[3rem]` for main cards.
  - Primary color: `slate-900` (`#0f172a`).
  - Accent color: `orange-500` (`#f97316`).
  - Use `italic font-black uppercase tracking-tighter` for headings.

### 2. Component Architecture
- **Atomic Components**: Keep components small (under 100 lines). Extract reusable UI elements into `src/components/`.
- **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` for performance optimization, especially in views with complex lists or charts.
- **Props Typing**: Always define strict TypeScript interfaces for component props.

### 3. Icons & Visuals
- **Lucide React**: Use `lucide-react` for all icons. Maintain consistent sizing (usually `size={18}` or `size={20}`).
- **Info Bubbles**: Use the `InfoBubble` component for providing contextual help to the user.

### 4. Data & State
- **Supabase Client**: Always use the singleton client from `src/lib/supabase.ts`. Check `isSupabaseConfigured()` before making calls.
- **Local State**: Prefer standard React hooks for state management. Avoid adding complex state libraries unless the app scale requires it.

### 5. AI Integration
- **Service Wrapper**: All AI calls must go through `src/services/geminiService.ts`.
- **Model Selection**: 
  - Use `gemini-3-flash-preview` for simple text tasks.
  - Use `gemini-3-pro-preview` for complex reasoning like cycle planning.
- **JSON Safety**: Always use the `cleanJSON` helper when parsing AI responses.

### 6. Charts
- **Recharts**: Use `ResponsiveContainer` to ensure charts are mobile-friendly. Follow the existing styling for tooltips and axes to match the dark/orange theme.