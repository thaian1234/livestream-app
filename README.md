## Livestream App

A real-time livestreaming application built with modern web technologies.

[Watch Demo Video](https://youtu.be/5GEYaehK9HM)

## Tech Stack

### Frontend

-   NextJS - React framework for production
-   ShadcnUI - UI component library
-   React Query - Data fetching and state management

### Backend

-   HonoJS - Lightweight web framework
-   PostgreSQL - Relational database
-   DrizzleORM - TypeScript ORM

### Streaming

-   GetstreamIO - Real-time livestreaming infrastructure

## Features

### Authentication

-   Email/Password login with secure password hashing and salting
-   Google OAuth integration for seamless social login
-   Password reset functionality with secure token generation and email delivery
-   Email verification with time-limited verification links

### User Management

-   Profile management including bio, and social links
-   Username/email updates with duplicate checking and validation
-   Profile image handling using R2 storage
-   Advanced user search with filters for username, location, and interests

### Stream Features

-   Stream key generation with unique RTMP endpoints
-   Stream settings configuration including quality, privacy, and chat settings
-   Livestream room creation with customizable titles, descriptions, and tags
-   Recording management with Getstream cloud storage and webhook integration for video management

### Chat Features

-   Real-time chat functionality with StreamChat client
-   Private messaging between streamers and viewers
-   Chat settings like delay, followers-only mode, and enable/disable options

### Social Features

-   Follow/Unfollow system with real-time notifications
-   User blocking and unblocking
-   User search with filters for stream status, follower count, and categories
-   Pagination implementation for optimal performance

### Security

-   Session based authentication with secure cookie storage
-   Webhook verification using cryptographic signatures
-   CORS protection with configurable origin whitelist
-   Request validation using JSON schema validation

### API Features

-   RESTful endpoints
-   Error handling with detailed error codes and messages
-   Response standardization using consistent JSON structure

### AI Features

-   AI-powered content generation using Vercel AI SDK
-   Automated video title generation optimized for engagement
-   Stream title suggestions based on category and content
-   Smart description generation from stream context and images
-   Real-time text streaming with word-by-word delivery
-   Customizable AI prompts for different content types

## Getting Started

### Prerequisites

-   Node v20 (https://nodejs.org/en/download/package-manager)
-   Visual Studio Code
-   Make (https://community.chocolatey.org/packages/make)
-   Bun (https://bun.sh/docs/installation)
-   Docker (https://docs.docker.com/engine/install/)

### Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/thaian1234/livestream-app
cd livestream-app
```

2. Set up environment variables:

```bash
cp .env.example .env
# Fill in required environment variables
```

3. Install dependencies:

```bash
bun install
```

4. Set up database:

```bash
# Start Docker
make docker-up
# Check database status
make docker-status
# Generate database schema
bun run db:generate
# Run migrations
bun run db:migrate
```

5. Build and start the application:

```bash
# Build the project
bun run build
# Start the server
bun run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
