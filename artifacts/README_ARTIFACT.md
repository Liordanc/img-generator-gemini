# Gemini Image ChatBot: Artifacts System

This document describes the internal "Artifacts" system, which is responsible for managing, storing, and tracking all generated content within the application.

## 1. Data Structure and Flow

The system is designed around a clear data hierarchy:

1.  **Mode**: A high-level category for a type of generation (e.g., "Tech Infographic", "UI Simulation").
2.  **Prompt Template**: A pre-defined prompt structure within a Mode that contains placeholders (e.g., "Create a diagram of a {cloud_provider} architecture...").
3.  **Prompt-for-Image**: The final, complete prompt sent to the model after a template has been filled with user input.
4.  **ImageJob**: A record that tracks a specific request to the Gemini API. It includes the final prompt, status (`pending`, `completed`, `failed`), and links to the resulting artifact.
5.  **Artifact**: The final output of a job. This is typically an image file, along with its metadata, URL, and a link back to the job that created it. Artifacts can have parent-child relationships to track edit history.

The typical flow is:
`User selects Mode` → `Chooses Template` → `Fills in details` → `App creates Prompt-for-Image` → `API creates ImageJob` → `Gemini creates image` → `App saves file and creates Artifact record`.

## 2. Storage Locations

The application uses two primary locations for storing data:

*   **Database (via Prisma)**: All metadata is stored in a database (defaulting to SQLite). This includes records for modes, templates, jobs, artifacts, and chat history. The schema is defined in `/prisma/schema.prisma`.
*   **File System**: All generated image files (PNGs) are stored on the local file system at `/public/artifacts/`. They are named using their corresponding `jobId` (e.g., `/public/artifacts/{jobId}.png`). This makes them publicly accessible via a URL like `http://localhost:3000/artifacts/{jobId}.png`.

### Fallback Mechanism

In environments where a persistent database connection is not available, the application is designed to conceptually support an in-memory fallback. This mock database would persist its state to JSON files located in `/artifacts/data/` to maintain data across sessions during development or demonstration.

## 3. Environment Variables

To connect to the Gemini API, the following environment variable must be set in a `.env.local` file at the project root:

```
API_KEY="YOUR_GEMINI_API_KEY"
```

## 4. Local Development and Database

For local development, Prisma is configured to use an SQLite database. To set up and apply changes to the database schema, you would typically run:

```bash
# Install Prisma CLI if you haven't
npm install prisma --save-dev

# Generate the Prisma client based on your schema
npx prisma generate

# Apply schema changes to the database, creating it if it doesn't exist
npx prisma db push
```
**Note**: These commands are for a local development setup and cannot be run in the current cloud environment.
