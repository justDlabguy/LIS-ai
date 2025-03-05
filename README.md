# Laboratory Information System (LIS)

A modern, full-stack Laboratory Information System with AI-powered analysis capabilities.

## Features

- 🔐 User Authentication & Authorization
- 📊 Dashboard with Statistics
- 🧪 Sample Management
- 📋 Test Results Management
- 🤖 AI-powered Test Analysis
- 📱 Responsive UI
- 🔄 Real-time Updates

## Tech Stack

### Frontend
- React with TypeScript
- Vite
- TailwindCSS
- Shadcn/ui Components
- React Query
- React Hook Form
- Zod Validation

### Backend
- Node.js with TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication

### AI Service
- FastAPI
- TensorFlow
- scikit-learn
- NumPy & Pandas

## Prerequisites

- Node.js (v16+)
- Python (v3.10+)
- PostgreSQL (v15+)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lis-system.git
   cd lis-system
   ```

2. Make the setup script executable:
   ```bash
   chmod +x setup-dev.sh
   ```

3. Run the setup script:
   ```bash
   ./setup-dev.sh
   ```

## Development

Start each service in a separate terminal:

1. Backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. AI Service:
   ```bash
   cd ai-service
   # On Windows:
   .\venv\Scripts\activate
   # On Unix/Mac:
   source venv/bin/activate
   uvicorn main:app --reload --port 5000
   ```

## Environment Variables

### Backend (.env)
```
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lis_db?schema=public"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"
AI_SERVICE_URL="http://localhost:5000"
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
VITE_AI_SERVICE_URL=http://localhost:5000
```

## API Documentation

- Backend API: http://localhost:3000/api-docs
- AI Service API: http://localhost:5000/docs

## Testing

Each component has its own test suite:

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test

# AI Service
cd ai-service
pytest
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 