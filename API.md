# Interview Questions API Documentation

## Base URL
- Production: `https://interview-nextjs-phi.vercel.app`
- Worker: `https://interview-questions-api.dyan79.workers.dev`

## Public Endpoints

### Get Questions by Topic
```
GET /api/questions/:topic
```

**Parameters:**
- `topic`: spring-boot | oracle | aws | angular | kafka | java | redis

**Response:**
```json
[
  {
    "id": 1,
    "text": "Question text?",
    "level": "basic",
    "answer": "Answer here"
  }
]
```

### Get All Topics
```
GET /api/topics
```

**Response:**
```json
[
  {
    "id": "spring-boot",
    "count": 30
  }
]
```

### Submit New Question
```
POST /api/questions/submit
```

**Body:**
```json
{
  "topic": "redis",
  "text": "What is Redis?",
  "level": "basic",
  "answer": "Redis is...",
  "submittedBy": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Question submitted successfully!",
  "questionId": "pending-1234567890-abc123"
}
```

## Admin Endpoints

### Get Pending Questions
```
GET /api/admin/pending
```

**Response:**
```json
[
  {
    "id": "pending-123",
    "topic": "redis",
    "text": "Question?",
    "level": "intermediate",
    "answer": "Answer",
    "submittedBy": "User",
    "submittedAt": "2026-03-31T12:00:00Z",
    "status": "pending"
  }
]
```

### Approve Question
```
POST /api/admin/questions/:id/approve
```

**Response:**
```json
{
  "success": true,
  "message": "Question approved successfully"
}
```

### Reject Question
```
POST /api/admin/questions/:id/reject
```

**Body:**
```json
{
  "reason": "Duplicate question"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Question rejected successfully"
}
```

### Bulk Approve
```
POST /api/admin/questions/bulk-approve
```

**Body:**
```json
{
  "questionIds": ["pending-1", "pending-2", "pending-3"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "3 questions approved successfully",
  "count": 3
}
```

### Bulk Reject
```
POST /api/admin/questions/bulk-reject
```

**Body:**
```json
{
  "questionIds": ["pending-4", "pending-5"],
  "reason": "Low quality"
}
```

**Response:**
```json
{
  "success": true,
  "message": "2 questions rejected successfully",
  "count": 2
}
```

## Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Status Codes
- `200` - Success
- `400` - Bad Request
- `500` - Internal Server Error

## Notes
- All endpoints return JSON
- CORS enabled for all origins
- No authentication required for public endpoints
- Admin endpoints should be protected (TODO: Add auth)
