# Frontend Integration Guide

This document details the changes made to the frontend to integrate it with the existing MongoDB backend.

## Overview
The frontend was refactored to bypass its internal Express/Postgres server and instead proxy requests to the existing backend running on `http://localhost:5000`.

## Key Changes

### 1. Vite Proxy Configuration
**File:** `frontend/vite.config.ts`

- Configured a proxy server to forward all requests starting with `/api` to `http://localhost:5000`.
- This resolves CORS issues and allows the frontend to communicate directly with the backend API.

### 2. Global Data Normalization
**File:** `frontend/client/src/lib/queryClient.ts`

Implemented a global interceptor that automatically handles data discrepancies between the frontend expectations and the backend response:
- **ID Mapping**: Automatically maps MongoDB's `_id` field to `id` for all objects.
- **Job Skills Normalization**: Converts the backend's string-array format for skills (e.g., `["Java", "Python"]`) into the object format expected by the UI (e.g., `[{ id: "...", name: "Java" }, ...]`).

### 3. API Endpoint Updates
Refactored frontend pages to match the backend's API routes:

- **Dashboard (`/dashboard`)**:
  - Profile: `/api/users/profile` → `/api/users/me`
  - Matches: `/api/matching/jobs` → `/api/matching/`

- **Skills (`/skills`)**:
  - Endpoint: `/api/users/profile` → `/api/users/me`
  - **Logic Update**: The backend expects a `PUT` request with the *entire list* of skill IDs to update a user's skills. The frontend logic was updated to:
    1. Get current skills.
    2. Add/Remove the target skill locally.
    3. Send the new full list to `/api/users/skills`.

- **Matching (`/matching`)**:
  - Endpoint: `/api/matching/jobs` → `/api/matching/`

### 4. Authentication Flow
- **Login**: Updated to fetch the user profile (`/api/users/me`) immediately after receiving the auth token, as the login endpoint only returns the token.
- **Register**: Updated to automatically log the user in (call login endpoint) after successful registration, then fetch the profile.

## How to Run

1.  **Start the Backend**:
    ```bash
    cd backend
    npm start
    ```
    *Ensure your MongoDB is running.*

2.  **Start the Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```
    *This runs `vite` directly on port 5173.*

3.  **Access the App**:
    Open [http://localhost:5173](http://localhost:5173) in your browser.
