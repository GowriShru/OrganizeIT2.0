#!/bin/bash

# OrganizeIT - Supabase Edge Function Deployment Script
# This script automates the deployment of the backend to Supabase

set -e  # Exit on any error

echo "🚀 OrganizeIT - Supabase Deployment Script"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
echo "📋 Checking prerequisites..."
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI is not installed${NC}"
    echo ""
    echo "Install it with:"
    echo "  npm install -g supabase"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Supabase CLI found${NC}"
echo ""

# Check if project is linked
echo "🔗 Checking project link..."
if [ ! -f ".supabase/config.toml" ]; then
    echo -e "${YELLOW}⚠️  Project not linked to Supabase${NC}"
    echo ""
    echo "Please run:"
    echo "  supabase link --project-ref YOUR_PROJECT_ID"
    echo ""
    read -p "Enter your Supabase Project ID: " PROJECT_ID
    
    if [ -z "$PROJECT_ID" ]; then
        echo -e "${RED}❌ Project ID is required${NC}"
        exit 1
    fi
    
    echo "Linking to project: $PROJECT_ID"
    supabase link --project-ref "$PROJECT_ID"
fi

echo -e "${GREEN}✅ Project linked${NC}"
echo ""

# Deploy the Edge Function
echo "📦 Deploying Edge Function..."
echo ""

supabase functions deploy server

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""

# Get project info
echo "📊 Getting project information..."
PROJECT_REF=$(grep 'project_id' .supabase/config.toml | cut -d '"' -f 2)

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "Your Edge Function is now live at:"
echo "  https://${PROJECT_REF}.supabase.co/functions/v1/make-server-efc8e70a"
echo ""
echo "Test it with:"
echo "  curl \"https://${PROJECT_REF}.supabase.co/functions/v1/make-server-efc8e70a/health\" \\"
echo "    -H \"Authorization: Bearer YOUR_ANON_KEY\""
echo ""
echo "View logs at:"
echo "  https://supabase.com/dashboard/project/${PROJECT_REF}/logs"
echo ""
echo -e "${GREEN}✅ All done! Your platform should now be fully functional.${NC}"
echo ""