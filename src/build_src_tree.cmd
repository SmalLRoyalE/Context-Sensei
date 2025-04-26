@echo off
echo Creating folders and files inside the current src directory...

:: Assets
mkdir assets 2>nul
mkdir assets\images 2>nul
mkdir assets\styles 2>nul
if not exist assets\images\logo.svg echo. > assets\images\logo.svg
if not exist assets\styles\index.css echo. > assets\styles\index.css

:: Components
mkdir components 2>nul
mkdir components\common 2>nul
mkdir components\layout 2>nul
mkdir components\features 2>nul
mkdir components\features\transcript 2>nul
mkdir components\features\analysis 2>nul

for %%F in (
    Button.tsx FileUploader.tsx Navbar.tsx
) do if not exist components\common\%%F echo. > components\common\%%F

for %%F in (
    Footer.tsx PageContainer.tsx
) do if not exist components\layout\%%F echo. > components\layout\%%F

for %%F in (
    TranscriptEditor.tsx TranscriptViewer.tsx
) do if not exist components\features\transcript\%%F echo. > components\features\transcript\%%F

for %%F in (
    ActionItems.tsx KeyDecisions.tsx Summary.tsx
) do if not exist components\features\analysis\%%F echo. > components\features\analysis\%%F

:: Hooks
mkdir hooks 2>nul
if not exist hooks\useFileUpload.ts echo. > hooks\useFileUpload.ts
if not exist hooks\useTranscriptAnalysis.ts echo. > hooks\useTranscriptAnalysis.ts

:: Pages
mkdir pages 2>nul
for %%F in (
    Home.tsx Editor.tsx Results.tsx About.tsx FAQ.tsx
) do if not exist pages\%%F echo. > pages\%%F

:: Services
mkdir services 2>nul
mkdir services\api 2>nul
mkdir services\ai 2>nul
mkdir services\storage 2>nul
if not exist services\api\client.ts echo. > services\api\client.ts
if not exist services\api\endpoints.ts echo. > services\api\endpoints.ts
if not exist services\ai\nlpService.ts echo. > services\ai\nlpService.ts
if not exist services\storage\fileStorage.ts echo. > services\storage\fileStorage.ts

:: Stores
mkdir stores 2>nul
if not exist stores\transcriptStore.ts echo. > stores\transcriptStore.ts
if not exist stores\userStore.ts echo. > stores\userStore.ts

:: Types
mkdir types 2>nul
if not exist types\transcript.ts echo. > types\transcript.ts
if not exist types\analysis.ts echo. > types\analysis.ts

:: Utils
mkdir utils 2>nul
if not exist utils\fileHandlers.ts echo. > utils\fileHandlers.ts
if not exist utils\formatters.ts echo. > utils\formatters.ts

:: Root files in src/
if not exist App.tsx echo. > App.tsx
if not exist main.tsx echo. > main.tsx
if not exist vite-env.d.ts echo. > vite-env.d.ts

echo.
echo ✅ Structure completed. Existing files/folders were not modified.
pause
