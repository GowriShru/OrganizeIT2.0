@echo off
REM OrganizeIT - Supabase Edge Function Deployment Script (Windows)
REM This script automates the deployment of the backend to Supabase

echo.
echo ========================================
echo  OrganizeIT - Supabase Deployment
echo ========================================
echo.

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Supabase CLI is not installed
    echo.
    echo Install it with:
    echo   npm install -g supabase
    echo.
    pause
    exit /b 1
)

echo [OK] Supabase CLI found
echo.

REM Check if project is linked
if not exist ".supabase\config.toml" (
    echo [WARNING] Project not linked to Supabase
    echo.
    set /p PROJECT_ID="Enter your Supabase Project ID: "
    
    if "%PROJECT_ID%"=="" (
        echo [ERROR] Project ID is required
        pause
        exit /b 1
    )
    
    echo Linking to project: %PROJECT_ID%
    supabase link --project-ref %PROJECT_ID%
)

echo [OK] Project linked
echo.

REM Deploy the Edge Function
echo Deploying Edge Function...
echo.

supabase functions deploy server

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  Deployment Successful!
    echo ========================================
    echo.
    echo Your Edge Function is now live!
    echo.
    echo Test it in your browser or with:
    echo   curl "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-efc8e70a/health"
    echo.
    echo View logs at:
    echo   https://supabase.com/dashboard
    echo.
    echo All done! Your platform should now be fully functional.
    echo.
) else (
    echo.
    echo [ERROR] Deployment failed
    echo Please check the error messages above
    echo.
)

pause