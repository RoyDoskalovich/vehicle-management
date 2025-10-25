# Vehicle Management System

A full-stack vehicle fleet management application built with TypeScript, featuring comprehensive CRUD operations, status tracking, and business rule validations.

## Features

### Core Functionality
- **Full CRUD Operations**: Create, read, update, and delete vehicles
- **Status Management**: Track vehicle status (Available, InUse, Maintenance)
- **Advanced Filtering**: Filter by status, search by license plate
- **Sorting**: Sort by creation date or license plate (ascending/descending)
- **Pagination**: Navigate through large vehicle lists efficiently
- **Responsive UI**: Clean, modern interface that works on all devices

### Business Rules & Validations
- ✅ Vehicles in Maintenance can only transition to Available
- ✅ Vehicles that are InUse or Maintenance cannot be deleted
- ✅ Maximum 5% of total vehicles can be in Maintenance simultaneously
- ✅ License plate format validation
- ✅ Duplicate license plate prevention

### Technical Features
- **TypeScript**: End-to-end type safety
- **Monorepo Structure**: Shared types and validation between frontend and backend
- **Real-time Updates**: Optimistic UI updates for better UX
- **Error Handling**: Comprehensive error messages and loading states
- **Seed Data**: Pre-populated database with sample vehicles

## Project Structure
```
vehicle-management/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Data access layer
│   │   ├── db/            # Prisma client
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Helper functions
│   ├── tests/             # Backend unit tests
│   │   └── services.test.ts
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Database seeding
│   └── package.json
│
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   └── router/        # Route configuration
│   └── package.json
│
├── packages/
│   └── shared/            # Shared TypeScript code
│       ├── src/
│       │   ├── types.ts   # Shared type definitions
│       │   ├── validation.ts  # Zod schemas
│       │   └── rules.ts   # Business rule validators
│       ├── tests/         # Shared package tests
│       │   ├── rules.test.ts
│       │   └── validation.test.ts
│       └── package.json
│
└── package.json           # Root workspace config
```

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Validation**: Zod
- **Language**: TypeScript

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Language**: TypeScript

### Development
- **Package Manager**: npm workspaces
- **Module Bundler**: tsup (for shared package)
- **Dev Server**: ts-node-dev (backend), Vite (frontend)

## Prerequisites

- **Node.js**: v20.19+ or v22.12+ (required for Vite)
- **npm**: v10+ (for workspace support)

## Getting Started

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd vehicle-management

# Install all dependencies (root, backend, frontend, shared)
npm install
```

### 2. Database Setup

```bash
# Generate Prisma Client
npm run db:generate --workspace backend

# Run database migrations
npm run db:migrate --workspace backend

# Seed the database with sample data
npm run db:seed --workspace backend
```

### 3. Build Shared Package

```bash
# Build the shared types/validation package
npm run shared:build
```

### 4. Start Development Servers

```bash
# Start all services (shared build watch + backend + frontend)
npm run dev
```

This will start:
- **Backend API**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **Shared package**: Auto-rebuilds on changes

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Overview

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/vehicles` | Get paginated list of vehicles (with filtering, sorting, and search) |
| GET | `/vehicles/:id` | Get a single vehicle by ID |
| POST | `/vehicles` | Create a new vehicle |
| PUT | `/vehicles/:id` | Update vehicle details (license plate and/or status) |
| PATCH | `/vehicles/:id/status` | Update only the vehicle status |
| DELETE | `/vehicles/:id` | Delete a vehicle |

#### List Vehicles
```http
GET /vehicles?status={status}&search={query}&sort={field}&order={asc|desc}&page={n}&pageSize={n}
```
**Query Parameters:**
- `status` (optional): Filter by status (Available, InUse, Maintenance)
- `search` (optional): Search by license plate
- `sort` (optional): Sort field (createdAt, licensePlate)
- `order` (optional): Sort order (asc, desc)
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "licensePlate": "12-345-67",
      "status": "Available",
      "createdAt": "2025-10-25T10:00:00Z",
      "updatedAt": "2025-10-25T10:00:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "pageSize": 10
}
```

#### Get Single Vehicle
```http
GET /vehicles/:id
```

#### Create Vehicle
```http
POST /vehicles
Content-Type: application/json

{
  "licensePlate": "12-345-67"
}
```

#### Update Vehicle
```http
PUT /vehicles/:id
Content-Type: application/json

{
  "licensePlate": "98-765-43",
  "status": "InUse"
}
```

#### Update Vehicle Status
```http
PATCH /vehicles/:id/status
Content-Type: application/json

{
  "status": "Available"
}
```

#### Delete Vehicle
```http
DELETE /vehicles/:id
```

### Error Responses

All endpoints return standardized error responses:

```json
{
  "error": "ErrorCode",
  "message": "Human-readable error message"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (business rule violation)
- `500` - Internal Server Error

## Running Tests

The project includes comprehensive unit tests for business logic and validation.

```bash
# Run all tests (shared + backend)
npm test

# Run tests in watch mode (auto-rerun on file changes).
npm run test:watch --workspace @vm/shared
npm run test:watch --workspace backend

# Run only shared package tests.
npm test --workspace @vm/shared

# Run only backend tests.
npm test --workspace backend
```

### Test Coverage

- **Shared Package Tests** (`packages/shared/tests/`)
   - ✅ Business rules validation (status transitions, deletion rules, maintenance cap)
   - ✅ Input validation schemas (license plate format, create/update data)

- **Backend Tests** (`backend/tests/`)
   - ✅ Service layer logic (CRUD operations, business rule enforcement)
   - ✅ Error handling (not found, conflicts, validation errors)

All tests use **Vitest** for fast, simple testing without complex setup.
```

## Building for Production

```bash
# Build all packages
npm run build

# Build individual packages
npm run backend:build
npm run frontend:build
npm run shared:build
```

## Seed Data

The database is seeded with 4 sample vehicles:

| License Plate | Status       |
|--------------|--------------|
| 12-345-67    | Available    |
| 89-XYZ-01    | InUse        |
| AB-123-CD    | Maintenance  |
| 77-777-77    | Available    |

To reset the database and re-seed:

```bash
# Delete the database
rm backend/prisma/dev.db

# Recreate and seed
npm run db:migrate --workspace backend
npm run db:seed --workspace backend
```

## Key Implementation Details

### Validation Rules

1. **Maintenance Transition Rule**
   - Vehicles in Maintenance can only move to Available status
   - Implemented in: `packages/shared/src/rules.ts`

2. **Deletion Restriction**
   - Vehicles with status InUse or Maintenance cannot be deleted
   - Enforced in: `backend/src/services/vehicles.service.ts`

3. **Maintenance Cap (5%)**
   - Maximum 5% of total vehicles can be in Maintenance
   - Calculated and enforced before status updates
   - Implemented in: `backend/src/services/vehicles.service.ts`

### Type Safety

The project uses a shared package (`@vm/shared`) that provides:
- Common TypeScript types
- Zod validation schemas
- Business rule functions

This ensures type consistency between frontend and backend.

### Data Flow

```
Frontend Component
    ↓
Custom Hook (useVehiclesList)
    ↓
API Client (VehiclesAPI)
    ↓
Backend Controller
    ↓
Service Layer (business logic)
    ↓
Repository Layer (data access)
    ↓
Prisma ORM
    ↓
SQLite Database
```

##    Troubleshooting

### Port Already in Use

If you see "Port 3000 already in use":
```bash
# Find and kill the process
npx kill-port 3000
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules packages/shared/node_modules
npm install
```

### TypeScript Errors After Changes

```bash
# Rebuild the shared package
npm run shared:build

# Restart the dev server
npm run dev
```

### Database Issues

```bash
# Reset the database
rm backend/prisma/dev.db
npm run db:migrate --workspace backend
npm run db:seed --workspace backend
```
