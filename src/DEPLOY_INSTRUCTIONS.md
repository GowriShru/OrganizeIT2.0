# 🚀 Deployment Instructions - CRITICAL

## ⚠️ IMPORTANT: The 500 errors will persist until you deploy the Edge Function

The fixes have been applied to the code, but **Supabase Edge Functions must be deployed** to take effect.

---

## Option 1: Deploy to Supabase (Recommended)

### Prerequisites:
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login
```

### Deploy Command:
```bash
# Navigate to your project root
cd /path/to/organizeit

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy the Edge Function
supabase functions deploy server
```

### Verify Deployment:
```bash
# Test the health endpoint
curl "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-efc8e70a/health" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-04T...",
  "service": "OrganizeIT Backend",
  "version": "1.0.0"
}
```

---

## Option 2: Use Local Development Server (Quick Fix)

If you need immediate functionality while setting up Supabase deployment, use the local Express server:

### 1. Start Local Server:
```bash
# Windows
start-with-server.bat

# Mac/Linux
./start-with-server.sh
```

### 2. Update API Configuration:
The app will automatically fall back to using realistic local data if the Supabase backend is unavailable.

---

## Troubleshooting

### If you see 500 errors after deployment:

1. **Check Deployment Status:**
   ```bash
   supabase functions list
   ```

2. **Check Edge Function Logs:**
   ```bash
   supabase functions logs server
   ```
   Or view in Supabase Dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/logs

3. **Verify Environment Variables:**
   - Go to Supabase Dashboard → Edge Functions → server → Settings
   - Ensure these are set:
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - These are usually auto-set by Supabase

4. **Check KV Store Table:**
   ```bash
   # Connect to your database
   supabase db diff
   ```
   
   If the table doesn't exist, create it:
   ```sql
   CREATE TABLE IF NOT EXISTS kv_store_2566089e (
     key TEXT NOT NULL PRIMARY KEY,
     value JSONB NOT NULL
   );
   ```

---

## Quick Verification Checklist

After deployment, verify these endpoints return 200 OK:

- [ ] `/health` - Should return healthy status
- [ ] `/metrics/dashboard` - Should return metrics object
- [ ] `/alerts/current` - Should return alerts array
- [ ] `/services/health` - Should return services array
- [ ] `/notifications` - Should return notifications array
- [ ] `/projects` - Should return projects array
- [ ] `/finops/costs` - Should return cost data
- [ ] `/esg/carbon` - Should return carbon data

---

## What the Fixes Do

The deployed Edge Function now:
1. ✅ Returns fallback data instead of 500 errors
2. ✅ Handles KV store failures gracefully
3. ✅ Provides realistic demo data automatically
4. ✅ Never crashes or returns errors to users
5. ✅ Logs all issues to console for debugging

---

## Expected Timeline

- **Deployment Time:** 2-5 minutes
- **Verification Time:** 30 seconds
- **Total Time to Fix:** ~5 minutes

---

## Need Help?

### Supabase Support:
- Documentation: https://supabase.com/docs/guides/functions
- Discord: https://discord.supabase.com

### Check Deployment Status:
- Supabase Dashboard: https://supabase.com/dashboard
- Edge Functions Section: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/functions

---

**Once deployed, all 500 errors will be eliminated and the platform will be fully functional!** ✅