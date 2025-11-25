# Resume Forge 🔨

AI-powered resume tailoring tool that helps you craft the perfect resume for any job posting.

## Features

- **AI-Powered Tailoring**: Uses LLM to analyze job descriptions and tailor your resume
- **Multiple LLM Providers**: Support for AWS Bedrock, Google Gemini, and OpenAI
- **PDF Generation**: Creates professional PDF resumes
- **PDF Parsing**: Extract resume content from existing PDFs
- **Beautiful UI**: Modern, animated interface with dark mode
- **User Authentication**: Secure login system

## Tech Stack

### Backend
- FastAPI
- Python 3.9+
- Multiple LLM providers (Bedrock/Gemini/OpenAI)
- PyPDF for PDF parsing
- LaTeX for PDF generation

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Playwright (E2E testing)

## Setup

### Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment:
```bash
cp .env.example .env
# Edit .env and configure your LLM provider
```

5. Run the server:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev -- -p 3000
```

## Usage

1. Open http://localhost:3000
2. Login with demo credentials: `admin` / `password`
3. Upload or paste your base resume
4. Enter job description
5. Click "Tailor Resume" to get AI-optimized version
6. Download as PDF

## LLM Provider Configuration

### AWS Bedrock
```bash
LLM_PROVIDER=bedrock
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
BEDROCK_MODEL=anthropic.claude-3-sonnet-20240229-v1:0
```

### Google Gemini
```bash
LLM_PROVIDER=gemini
GEMINI_API_KEY=your-api-key
GEMINI_MODEL=gemini-2.0-flash
```

### OpenAI
```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=your-api-key
OPENAI_MODEL=gpt-4-turbo-preview
```

## Testing

### Backend
```bash
cd backend
python verify_e2e.py
```

### Frontend E2E
```bash
cd frontend
npm run test:e2e
```

## Project Structure

```
resume_tailor/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Configuration
│   │   ├── models/       # Data models
│   │   └── services/     # Business logic
│   ├── main.py           # FastAPI app
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities
│   └── package.json
│
└── IMPLEMENTATION_PLAN.md  # Upcoming improvements
```

## Upcoming Improvements

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for planned security, modularity, and feature enhancements.

## License

MIT

## Author

Raghu Raj Sodani
