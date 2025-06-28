# TaskRadar

A modern task management application built with Next.js, NestJS, and shadcn/ui. TaskRadar helps you organize, track, and manage your tasks efficiently with a clean and intuitive interface.

## 🚀 Features

- **Task Management**: Create, update, and organize tasks with ease
- **Authentication**: Secure user authentication system
- **Real-time Updates**: Stay in sync with real-time task updates
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui for a beautiful, accessible interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication
- **Styling**: Tailwind CSS with CSS variables for theming

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fahimshahriyer/taskradar.git
   cd taskradar
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `apps/web` and `apps/api` directories
   - Update the environment variables with your configuration

4. Run database migrations:
   ```bash
   cd apps/web
   pnpm db:push
   ```

5. Start the development servers:
   ```bash
   # In the root directory
   pnpm dev
   ```

   This will start both the Next.js and NestJS servers in development mode.

## 📂 Project Structure

```
taskradar/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # NestJS backend
├── packages/
│   └── ui/               # Shared UI components
└── package.json          # Root package.json with workspaces
```

## 📝 Adding Components

To add new shadcn/ui components to your app:

```bash
cd apps/web
pnpm dlx shadcn@latest add [component-name]
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
