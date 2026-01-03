# Contact Manager Application

Full-stack Contact Management Application built with React, Node.js, Express, and MongoDB.

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Zod (validation)
- Helmet (security)

### Frontend
- React 19
- TypeScript
- Vite
- React Query (TanStack Query)
- React Hook Form
- Axios
- Zod (validation)

## Project Structure

```
C.M.W.A/
├── client/          # React frontend
├── server/          # Node.js backend
├── package.json     # Root package.json for monorepo
└── render.yaml      # Render deployment configuration
```

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Copy environment files:
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. Update environment variables in both `.env` files

4. Install all dependencies:
   ```bash
   npm run install:all
   ```

### Development

Run both client and server concurrently:
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Server
npm run dev:server

# Terminal 2 - Client
npm run dev:client
```

### Build

Build both client and server:
```bash
npm run build
```

### Production

```bash
npm start
```

## API Endpoints

### Base URL: `/api/v1`

- `GET /healthcheck` - Health check
- `GET /contacts` - Get all contacts (with pagination, search, filter)
- `GET /contacts/:id` - Get contact by ID
- `POST /contacts` - Create new contact
- `PUT /contacts/:id` - Update contact
- `DELETE /contacts/:id` - Delete contact
- `POST /contacts/bulk-delete` - Bulk delete contacts

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/contact-manager
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api/v1
```

## Deployment (Render)

1. Push code to GitHub
2. Create new Blueprint instance on Render
3. Point to your repository
4. Render will use `render.yaml` for configuration
5. Set environment variables in Render dashboard:
   - Server: `MONGODB_URI`, `CORS_ORIGIN`
   - Client: `VITE_API_URL`

## Features

- ✅ CRUD operations for contacts
- ✅ Pagination
- ✅ Search functionality
- ✅ Category filtering
- ✅ Bulk delete
- ✅ Client & Server-side validation with Zod
- ✅ Error handling
- ✅ TypeScript throughout
- ✅ Optimized MongoDB queries with aggregation
- ✅ React Query for data fetching
- ✅ Form validation with React Hook Form

## License

ISC
