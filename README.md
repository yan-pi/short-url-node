Certainly! Below is an example of a `README.md` file for your project in English:

---

# Short URL Node API

This is a simple API for shortening URLs and tracking click metrics.

## Technologies Used

- [Fastify](https://www.fastify.io/) - Fast and efficient web framework for Node.js.
- [Prisma](https://www.prisma.io/) - ORM for Node.js and TypeScript.
- [ioredis](https://github.com/luin/ioredis) - Redis client for Node.js.

## Requirements

- Node.js
- pnpm
- Docker and Docker Compose (to run Redis and Prisma locally)

## Installation

### Clone the repository

```bash
git clone https://github.com/yan-pi/short-url-node.git
cd short-url-node
```

### Install dependencies

```bash
pnpm install
```

### Set up environment variables

Create a `.env` file at the root of the project with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
REDIS_URL="redis://localhost:6379"
```

## Running the Project

### With Docker Compose

```bash
docker-compose up -d
```

# Run Prisma migrations
```bash
npx prisma migrate deploy
```

# Start the API
```bash
pnpm run dev
```

## Routes

### Shorten a URL

```
POST /api/links

Body:
{
  "code": "code",
  "url": "https://www.example.com"
}

Response:
{
  "shortLinkId": 1
}
```

### Get all shortened URLs

```
GET /api/links

Response:
[
  {
    "id": 1,
    "code": "code",
    "originalUrl": "https://www.example.com",
    "createdAt": "2022-04-01T00:00:00.000Z"
  }
]
```

### Access a shortened URL

```
GET /:code

Redirects to the original URL and increments the click metrics.
```

### Get click metrics

```
GET /api/metrics

Response:
[
  {
    "shortLinkId": 1,
    "clicks": 2
  }
]
```

## Closing the Connection

Connections to Prisma and Redis are automatically closed when the application is shut down.

## Contribution

Feel free to contribute with improvements, bug fixes, or new features!

---

Feel free to customize and expand the `README.md` as needed to meet the specifications and details of your project.