@echo off
setlocal enabledelayedexpansion

set "verbose=0"
if "%1"=="-v" set "verbose=1"
if "%1"=="--verbose" set "verbose=1"

REM Check if .env file exists
if not exist ".env" (
    echo Error: .env file not found.
    echo Please create a .env file with your OpenAI API key set to the variable OPENAI_API_KEY.
    exit /b 1
)

REM Check OpenAI API key
set "default_key=your-opena-api-key-here"
for /f "tokens=2 delims==" %%a in ('type .env ^| findstr /i "OPENAI_API_KEY"') do set "api_key=%%a"
set "api_key=!api_key: =!"

if "!api_key!"=="" (
    echo Error: OPENAI_API_KEY not found in .env file.
    exit /b 1
)

if "!api_key!"=="!default_key!" (
    echo Error: Please replace the default OpenAI API key in .env file with your actual key.
    exit /b 1
)

if %verbose%==1 (
    echo Starting ZyberTrain Docker containers...
    docker compose up --build --force-recreate --remove-orphans
) else (
    docker compose up --build --force-recreate --remove-orphans --quiet-pull
)

if %verbose%==1 (
    echo.
    echo Cleaning up ZyberTrain Docker resources...
    docker compose down --rmi all --volumes --remove-orphans
) else (
    docker compose down --rmi all --volumes --remove-orphans > nul 2>&1
)

if %verbose%==1 pause
