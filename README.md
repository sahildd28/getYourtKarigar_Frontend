# Frontend (Carpenter Project)

This is a Vite + React frontend using Tailwind (v4). It contains a public landing page, gallery, lead capture form, and an admin dashboard planned for later.

Quick start

1. Install dependencies

```powershell
cd frontend
npm install
```

2. Start dev server

```powershell
npm run dev
```

Notes / integration points

- Tailwind v4 is used; project includes `postcss.config.cjs` and `tailwind.config.cjs` but you mentioned you don't want changes in Tailwind files. Current setup should work with Vite/PostCSS.
- The lead form posts to `/leads` (POST). Expected payload (JSON):

```json
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "requirement": "Tables",
  "dimensions": "...",
  "material": "Plywood",
  "budget": 10000,
  "notes": "...",
  "status": "New",
  "timestamp": "..."
}
```

- Portfolio uploads should POST multipart/form-data to `/portfolio` with fields: `file`, `category`.
- Admin backend: planned as Spring Boot service with authentication; it should expose endpoints to list leads, update lead status, upload portfolio images, and manage testimonials.

Next steps

- Implement backend endpoints and wire them to the frontend services.
- Add admin dashboard pages (login, leads table, portfolio manager).
- Optional Phase 2: integrate React Three.js for 3D previews.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
