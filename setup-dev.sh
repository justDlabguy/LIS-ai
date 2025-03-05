#!/bin/bash

# Create necessary directories if they don't exist
mkdir -p ai-service/models

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
echo "Backend dependencies installed."

# Set up database
echo "Setting up database..."
npx prisma generate
npx prisma migrate dev --name init
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Set up AI service
echo "Setting up AI service..."
cd ai-service
python -m venv venv
source venv/bin/activate  # On Windows use: .\venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo "Setup complete! You can now start the services:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
echo "3. AI Service: cd ai-service && uvicorn main:app --reload --port 5000" 