# TaskFlow ⚡

> A Trello/Linear-inspired project management SaaS — built as a full-stack portfolio project.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)
![Zustand](https://img.shields.io/badge/Zustand-global_state-orange)
![Firebase](https://img.shields.io/badge/Firebase-Auth-ffca28?logo=firebase)
![React Router](https://img.shields.io/badge/React_Router-v6-ca4245?logo=reactrouter)

---

## Live Features

| Feature | Details |
|---|---|
| **Auth** | Firebase Auth (Google + Email/Password) + Demo mode (no config needed) |
| **Projects** | Create, list, delete projects with color coding and progress tracking |
| **Tasks** | Kanban board view + list view, full CRUD, status/priority/due date |
| **Task Detail** | Slide-in panel with inline editing, metadata fields, comment thread |
| **Global Search** | Real-time task search across all projects in the topbar |
| **Filtering & Sorting** | Filter by status/priority, sort by 6 criteria |
| **Dashboard** | Stats cards, recent tasks, project progress overview |
| **Dark / Light Mode** | Persistent theme toggle |
| **Notifications** | Toast system + notifications page |
| **Profile** | Edit display name, title, bio — with activity stats |
| **Settings** | Theme, notification prefs, danger zone |
| **Responsive** | Collapses properly on mobile |

---

## Tech Stack

- **React 19** + **Vite 8**
- **Zustand** — global state (auth, projects, tasks, UI)
- **React Router v7** — client-side routing + protected routes
- **Firebase Auth** — Google OAuth + Email/Password
- **lucide-react** — icon system
- **date-fns** — date formatting
- **localStorage** — persisted API service layer (swap for real backend)

---

## Project Structure

```
src/
├── components/
│   ├── auth/          # ProtectedRoute
│   ├── dashboard/     # StatCard, RecentTasksList
│   ├── layout/        # AppLayout, Sidebar, Topbar
│   ├── projects/      # ProjectCard, CreateProjectModal
│   ├── tasks/         # TaskCard, TaskDetailPanel, CreateTaskModal, FilterBar
│   └── ui/            # Modal, Badge, Avatar, Spinner, Toast, EmptyState, ConfirmDialog
├── hooks/             # useRequireAuth, useAsync, useDebounce, useClickOutside, useDocumentTitle
├── lib/               # firebase.js
├── pages/
│   ├── Auth/          # LoginPage
│   ├── Dashboard/     # DashboardPage
│   ├── Notifications/ # NotificationsPage
│   ├── NotFound/      # NotFoundPage
│   ├── Profile/       # ProfilePage
│   ├── Projects/      # ProjectsPage, ProjectDetailPage
│   ├── Settings/      # SettingsPage
│   └── Tasks/         # MyTasksPage
├── services/          # api.js (mock API layer)
├── store/             # authStore, projectStore, taskStore, uiStore
└── utils/             # constants.js, helpers.js
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run (Demo mode — no config needed)
```bash
npm run dev
```
Open http://localhost:5173 and click **"Try Demo"** — no account required.

### 3. Enable Firebase Auth (optional)
```bash
cp .env.example .env.local
# Fill in your Firebase project credentials
```

---

## Git Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Stable, production-ready |
| `feature/auth` | Firebase auth integration |
| `feature/board-view` | Kanban board |
| `feature/task-detail` | Task detail panel + comments |
| `feature/dark-mode` | Theme system |

---

## Interview Talking Points

- **Component architecture**: 30+ components split by domain (`ui/`, `layout/`, `tasks/`, `projects/`, `dashboard/`)
- **Global state**: 4 Zustand stores — auth, projects, tasks, UI — each with clear responsibilities
- **Protected routes**: `ProtectedRoute` wrapper + `onAuthStateChanged` listener in store init
- **Service layer**: `api.js` abstracts all data access — swap localStorage for Supabase/Firebase Firestore with zero component changes
- **Custom hooks**: `useRequireAuth`, `useAsync`, `useDebounce`, `useClickOutside`, `useDocumentTitle`
- **Performance**: Debounced search, optimistic UI updates, per-project task maps
- **UX patterns**: Toasts, modals, empty states, loading skeletons, overdue indicators, confirmation dialogs
