# Interview Questions Bulk Insert Tools

Quick tools để submit câu hỏi vào **pending queue** (cần admin approve).

## 🚀 Quick Start

### 1. Generate SQL từ Q&A text

```bash
# Tạo file questions.txt với format:
# Q: Question here?
# A: Answer here.

node generate-sql.js questions.txt spring-boot intermediate > output.sql
```

### 2. Submit vào pending queue

```bash
./add-questions.sh output.sql
```

### 3. Admin approve tại /admin

https://interview-nextjs-phi.vercel.app/admin

## 📝 Input Format

**Option 1: Simple Q&A**
```
Q: What is Spring Boot?
A: Spring Boot is a framework that simplifies Spring application development.

Q: What is @Autowired?
A: @Autowired enables automatic dependency injection.
```

**Option 2: Markdown**
```markdown
### Q1: What is Spring Boot?
Spring Boot is a framework...

### Q2: What is @Autowired?
@Autowired enables...
```

## 🛠️ Tools

### generate-sql.js
Convert Q&A text to SQL INSERT statements (pending_questions).

```bash
node generate-sql.js <input-file> <topic> <level> [submitted-by]

# Topics: spring-boot, oracle, aws, angular, java, kafka, redis, react, algorithms
# Levels: beginner, intermediate, advanced
# submitted-by: optional (default: bulk-import)

# Examples:
node generate-sql.js spring-questions.txt spring-boot intermediate > spring.sql
node generate-sql.js oracle-advanced.md oracle advanced "admin@example.com" > oracle.sql
```

### add-questions.sh
Upload SQL file to pending_questions table.

```bash
./add-questions.sh <sql-file>

# Example:
./add-questions.sh spring.sql
```

## 📊 Check Pending Queue

```bash
export CLOUDFLARE_API_TOKEN="cfut_lM8H8ovGsWlqRH053kIXKByELmXpDPaipdtW1hnd22c54421"

# Count pending by topic
npx wrangler d1 execute interview-questions-db --remote \
  --command "SELECT topic, COUNT(*) FROM pending_questions WHERE status='pending' GROUP BY topic"

# View recent submissions
npx wrangler d1 execute interview-questions-db --remote \
  --command "SELECT topic, text, submitted_by FROM pending_questions WHERE status='pending' ORDER BY submitted_at DESC LIMIT 10"
```

## 🎯 Complete Workflow

```bash
cd /root/.openclaw/workspace/tools/interview-nextjs

# 1. Create questions file
cat > new-questions.txt << 'EOF'
Q: What is RestClient in Spring Boot 3.2?
A: RestClient is a modern synchronous HTTP client that replaces RestTemplate.

Q: What is Micrometer Observation API?
A: Unified observability API for metrics, tracing, and logging.
EOF

# 2. Generate SQL (inserts to pending_questions)
node generate-sql.js new-questions.txt spring-boot advanced > new.sql

# 3. Submit to pending queue
./add-questions.sh new.sql

# 4. Admin approves at /admin
# https://interview-nextjs-phi.vercel.app/admin

# 5. Approved questions appear on main site
# https://interview-nextjs-phi.vercel.app
```

## 🔐 Admin Approval Flow

1. **Submit** → Questions go to `pending_questions` table
2. **Review** → Admin reviews at `/admin` page
3. **Approve** → Moves to `approved_questions` table
4. **Live** → Appears on main site immediately

## 📦 Database Schema

```sql
-- Pending questions (awaiting approval)
CREATE TABLE pending_questions (
  id TEXT PRIMARY KEY,           -- UUID
  topic TEXT NOT NULL,
  text TEXT NOT NULL,            -- Question text
  answer TEXT NOT NULL,
  level TEXT NOT NULL,           -- beginner, intermediate, advanced
  submitted_by TEXT NOT NULL,    -- Email or identifier
  submitted_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, approved, rejected
  rejection_reason TEXT,
  reviewed_at TEXT,
  reviewed_by TEXT
);

-- Approved questions (live on site)
CREATE TABLE approved_questions (
  id INTEGER PRIMARY KEY,
  topic TEXT NOT NULL,
  text TEXT NOT NULL,
  answer TEXT NOT NULL,
  level TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## 🌐 URLs

- **Main Site:** https://interview-nextjs-phi.vercel.app
- **Admin Panel:** https://interview-nextjs-phi.vercel.app/admin
- **Submit Form:** https://interview-nextjs-phi.vercel.app/submit

## 📝 Notes

- All new questions go to **pending queue** first
- Admin must approve before questions appear on site
- Use `submitted_by` to track who submitted questions
- Escape single quotes in text: `'` → `''`
- Generate UUIDs automatically for pending questions
- Status: `pending` → `approved` or `rejected`

## ⚠️ Important

**DO NOT insert directly into `approved_questions`!**

Always use pending queue workflow:
1. Generate SQL with `generate-sql.js`
2. Submit with `add-questions.sh`
3. Admin approves at `/admin`
