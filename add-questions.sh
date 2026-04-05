#!/bin/bash
# Script to add questions to pending queue (requires admin approval)

set -e

CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-cfut_lM8H8ovGsWlqRH053kIXKByELmXpDPaipdtW1hnd22c54421}"
DB_NAME="interview-questions-db"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Interview Questions Submission Tool ===${NC}\n"

# Check if SQL file provided
if [ -z "$1" ]; then
    echo -e "${RED}Usage: $0 <sql-file>${NC}"
    echo "Example: $0 new-questions.sql"
    exit 1
fi

SQL_FILE="$1"

if [ ! -f "$SQL_FILE" ]; then
    echo -e "${RED}Error: File $SQL_FILE not found${NC}"
    exit 1
fi

echo -e "${BLUE}📄 SQL File:${NC} $SQL_FILE"
echo -e "${BLUE}🗄️  Database:${NC} $DB_NAME"
echo -e "${YELLOW}⏳ Target:${NC} pending_questions (requires admin approval)"
echo ""

# Count INSERT statements
INSERT_COUNT=$(grep -c "^INSERT INTO" "$SQL_FILE" || true)
echo -e "${BLUE}📊 Found ${INSERT_COUNT} INSERT statements${NC}\n"

# Execute
echo -e "${BLUE}🚀 Uploading to Cloudflare D1...${NC}"
export CLOUDFLARE_API_TOKEN
npx wrangler d1 execute "$DB_NAME" --remote --file="$SQL_FILE"

echo ""
echo -e "${GREEN}✅ Questions submitted to pending queue!${NC}\n"

# Show pending count
echo -e "${BLUE}📊 Pending questions by topic:${NC}"
npx wrangler d1 execute "$DB_NAME" --remote --command "SELECT topic, COUNT(*) as count FROM pending_questions WHERE status='pending' GROUP BY topic ORDER BY topic"

echo ""
echo -e "${YELLOW}⚠️  Admin action required:${NC}"
echo -e "   1. Go to ${BLUE}https://interview-nextjs-phi.vercel.app/admin${NC}"
echo -e "   2. Review and approve/reject questions"
echo -e "   3. Approved questions will appear on main site"
