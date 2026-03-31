# Interview Questions API Documentation

## Base URL
- **Production:** `https://interview-nextjs-phi.vercel.app`
- **Worker:** `https://interview-questions-api.dyan79.workers.dev`

## Overview
RESTful API for managing interview questions across multiple topics. Supports question submission, admin review workflow, and public access to approved questions.

## Public Endpoints

### Get Questions by Topic
Retrieve all approved questions for a specific topic.

```http
GET /api/questions/:topic
```

**Parameters:**
- `topic` (required): One of `spring-boot`, `oracle`, `aws`, `angular`, `kafka`, `java`, `redis`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "text": "Redis là gì và tại sao nó nhanh?",
    "level": "basic",
    "answer": "Redis (Remote Dictionary Server) là in-memory key-value data store..."
  },
  {
    "id": 2,
    "text": "Redis hỗ trợ những data structures nào?",
    "level": "intermediate",
    "answer": "Strings, Lists, Sets, Sorted Sets, Hashes..."
  }
]
```

**Example:**
```bash
curl https://interview-nextjs-phi.vercel.app/api/questions/redis
```

---

### Get All Topics
Get list of all available topics with question counts.

```http
GET /api/topics
```

**Response:** `200 OK`
```json
[
  { "id": "spring-boot", "count": 30 },
  { "id": "oracle", "count": 12 },
  { "id": "aws", "count": 12 },
  { "id": "angular", "count": 12 },
  { "id": "kafka", "count": 10 },
  { "id": "java", "count": 8 },
  { "id": "redis", "count": 22 }
]
```

**Example:**
```bash
curl https://interview-nextjs-phi.vercel.app/api/topics
```

---

### Submit New Question
Submit a new question for admin review.

```http
POST /api/questions/submit
```

**Request Body:**
```json
{
  "topic": "redis",
  "text": "What is Redis Cluster?",
  "level": "advanced",
  "answer": "Redis Cluster is a distributed implementation...",
  "submittedBy": "John Doe"
}
```

**Fields:**
- `topic` (required): Topic ID
- `text` (required): Question text
- `level` (required): `basic`, `intermediate`, or `advanced`
- `answer` (required): Detailed answer
- `submittedBy` (optional): Submitter name (default: "Anonymous")

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Question submitted successfully! It will be reviewed by admin.",
  "questionId": "pending-1711891200000-abc123xyz"
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

**Example:**
```bash
curl -X POST https://interview-nextjs-phi.vercel.app/api/questions/submit \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "redis",
    "text": "What is Redis Sentinel?",
    "level": "advanced",
    "answer": "Redis Sentinel provides high availability...",
    "submittedBy": "Developer"
  }'
```

---

## Admin Endpoints

⚠️ **Note:** Admin endpoints should be protected with authentication in production.

### Get Pending Questions
Retrieve all questions awaiting review.

```http
GET /api/admin/pending
```

**Response:** `200 OK`
```json
[
  {
    "id": "pending-1711891200000-abc123",
    "topic": "redis",
    "text": "What is Redis Cluster?",
    "level": "advanced",
    "answer": "Redis Cluster is...",
    "submittedBy": "John Doe",
    "submittedAt": "2026-03-31T12:00:00.000Z",
    "status": "pending"
  }
]
```

**Example:**
```bash
curl https://interview-nextjs-phi.vercel.app/api/admin/pending
```

---

### Approve Question
Approve a pending question and move it to production.

```http
POST /api/admin/questions/:id/approve
```

**Parameters:**
- `id` (required): Question ID

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Question pending-123 approved successfully"
}
```

**Example:**
```bash
curl -X POST https://interview-nextjs-phi.vercel.app/api/admin/questions/pending-123/approve
```

---

### Reject Question
Reject a pending question with optional reason.

```http
POST /api/admin/questions/:id/reject
```

**Parameters:**
- `id` (required): Question ID

**Request Body:**
```json
{
  "reason": "Duplicate question"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Question pending-123 rejected successfully"
}
```

**Example:**
```bash
curl -X POST https://interview-nextjs-phi.vercel.app/api/admin/questions/pending-123/reject \
  -H "Content-Type: application/json" \
  -d '{"reason": "Duplicate question"}'
```

---

### Bulk Approve Questions
Approve multiple questions at once.

```http
POST /api/admin/questions/bulk-approve
```

**Request Body:**
```json
{
  "questionIds": [
    "pending-1",
    "pending-2",
    "pending-3"
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "3 questions approved successfully",
  "count": 3
}
```

**Example:**
```bash
curl -X POST https://interview-nextjs-phi.vercel.app/api/admin/questions/bulk-approve \
  -H "Content-Type: application/json" \
  -d '{"questionIds": ["pending-1", "pending-2", "pending-3"]}'
```

---

### Bulk Reject Questions
Reject multiple questions at once.

```http
POST /api/admin/questions/bulk-reject
```

**Request Body:**
```json
{
  "questionIds": ["pending-4", "pending-5"],
  "reason": "Low quality"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "2 questions rejected successfully",
  "count": 2
}
```

**Example:**
```bash
curl -X POST https://interview-nextjs-phi.vercel.app/api/admin/questions/bulk-reject \
  -H "Content-Type: application/json" \
  -d '{"questionIds": ["pending-4", "pending-5"], "reason": "Low quality"}'
```

---

## Error Responses

### 400 Bad Request
Invalid request parameters or missing required fields.

```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 500 Internal Server Error
Server-side error occurred.

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad Request - Invalid parameters |
| `500` | Internal Server Error |

---

## Data Models

### Question
```typescript
interface Question {
  id: number | string
  text: string
  level: 'basic' | 'intermediate' | 'advanced'
  answer: string
}
```

### Pending Question
```typescript
interface PendingQuestion extends Question {
  topic: string
  submittedBy: string
  submittedAt: string  // ISO 8601 timestamp
  status: 'pending' | 'approved' | 'rejected'
}
```

---

## Topics

| ID | Label | Questions | Icon |
|----|-------|-----------|------|
| `spring-boot` | Spring Boot | 30 | ☕ |
| `oracle` | Oracle DB | 12 | 🗄️ |
| `aws` | AWS Cloud | 12 | ☁️ |
| `angular` | Angular | 12 | 🅰️ |
| `kafka` | Kafka | 10 | 📨 |
| `java` | Java 21 | 8 | ☕ |
| `redis` | Redis | 22 | ⚡ |

---

## CORS

All endpoints support CORS with `Access-Control-Allow-Origin: *` for public access.

---

## Rate Limiting

Currently no rate limiting. Consider implementing rate limiting in production.

---

## Authentication

⚠️ **TODO:** Admin endpoints should be protected with authentication (NextAuth.js, JWT, etc.)

---

## Database

⚠️ **TODO:** Currently using in-memory storage. Integrate with:
- Vercel Postgres
- Supabase
- MongoDB Atlas
- Or any other database

---

## Deployment

- **Frontend:** Vercel (Next.js)
- **Worker:** Cloudflare Workers
- **Auto-deploy:** Push to `master` branch

---

## Contributing

To add new questions:
1. Submit via `/api/questions/submit`
2. Admin reviews at `/admin`
3. Approved questions appear in production

---

## Support

For issues or questions, contact: dyan071@gmail.com
