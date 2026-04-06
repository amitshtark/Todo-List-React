# Todo List React

A React-based task management application implementing local state persistence and remote cloud synchronization.

## Features

- **User Interface:** Clean, structured layout utilizing centralized CSS variables.
- **Local Storage Management:** 
  - Browser-level state persistence.
  - CRUD operations (Create, Read, Update, Delete) for local tasks.
  - Inline editing functionality.
- **Cloud Backend Synchronization:**
  - **GET:** Retrieves task data from the remote endpoint upon initialization.
  - **POST:** Synchronizes new client-side tasks to the remote cloud database.
  - **PUT:** Propagates state changes (text edits and completion toggles) to the remote endpoint.
  - **DELETE:** Removes specified task entries from the remote backend.

## Getting Started

### Prerequisites
- Node.js installed

### Installation and Execution

1. Clone this repository.
2. Navigate to the project directory:
   ```bash
   cd Todo-List-React
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- **Framework:** React + Vite
- **Styling:** Vanilla CSS
- **Remote Database:** MockAPI
