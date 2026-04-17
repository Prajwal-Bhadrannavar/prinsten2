# Heart Disease Awareness System

A comprehensive full-stack web application for heart disease awareness, risk assessment, and health tracking. This system provides educational resources, risk assessment tools, and lifestyle tracking features to help users monitor and improve their cardiovascular health.

## Quick Start

**One-Word Setup:** `setup`

### Fast Setup Commands

```bash
# Backend Setup
cd heart-disease-awareness-backend
npm install
npm run dev

# Frontend Setup (in new terminal)
cd heart-disease-awareness  
npm install
npm start
```

That's it! The app will be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Features

### Core Features
- **Homepage**: Clean, modern UI with heart health awareness content
- **Akinator-Style Risk Assessment**: Interactive questionnaire to evaluate heart disease risk
- **User Authentication**: Secure JWT-based login and registration system
- **Personal Dashboard**: Track assessment history and health insights
- **Educational Content**: Articles on diet, exercise, and heart health
- **Emergency Guide**: Critical information for heart emergencies
- **Lifestyle Tracker**: Monitor daily steps, water intake, sleep, and exercise
- **Doctor Directory**: Find nearby cardiologists and heart specialists

### Technical Features
- **Responsive Design**: Mobile-friendly interface
- **Interactive Charts**: Visualize health trends and risk scores
- **Real-time Validation**: Form validation and error handling
- **Secure Backend**: JWT authentication and data protection
- **MongoDB Integration**: Scalable data storage

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Chart.js** for data visualization
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## Project Structure

```
heart-disease-awareness/
frontend/
  src/
    components/     # Reusable UI components
    contexts/       # React contexts (Auth)
    pages/          # Page components
    services/       # API service layer
    utils/          # Utility functions
    App.tsx         # Main app component
    index.css       # Global styles with Tailwind

backend/
  src/
    controllers/    # Route controllers
    middleware/     # Custom middleware
    models/         # MongoDB models
    routes/         # API routes
    utils/          # Utility functions
    index.ts        # Server entry point
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd heart-disease-awareness-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend root:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/heart-disease-awareness
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd heart-disease-awareness
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the frontend root:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the frontend development server:**
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## Usage Guide

### 1. User Registration and Login
- Visit the homepage and click "Sign Up"
- Fill in your username, email, and password
- After registration, you'll be automatically logged in
- Use the login page for subsequent visits

### 2. Risk Assessment
- Click "Start Risk Assessment" from the homepage
- Answer yes/no questions about your health and lifestyle
- Receive a risk score (Low/Moderate/High) with personalized recommendations
- Results are saved to your profile for future reference

### 3. Lifestyle Tracking
- Navigate to the Lifestyle Tracker from your dashboard
- Enter daily metrics: steps, water intake, sleep hours, exercise minutes
- View health insights based on your 30-day averages
- Track progress over time with visual charts

### 4. Educational Resources
- Browse articles on heart health, diet, and exercise
- Learn about common heart conditions
- Access emergency response guidelines

### 5. Find Specialists
- Search for cardiologists and heart specialists in your area
- Filter by specialty and availability
- View ratings, specialties, and contact information

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Assessment
- `GET /api/assessment/questions` - Get assessment questions
- `POST /api/assessment/calculate` - Calculate risk score
- `POST /api/assessment/save` - Save assessment results
- `GET /api/assessment/history` - Get user's assessment history

### User Data
- `POST /api/user/lifestyle` - Save lifestyle data
- `GET /api/user/lifestyle` - Get lifestyle data
- `GET /api/user/insights` - Get health insights

## Risk Assessment Algorithm

The risk assessment uses a weighted scoring system:

### Positive Risk Factors (Increase Score):
- Chest pain during activity: +3
- High blood pressure: +3
- Shortness of breath: +2
- Smoking: +4
- Diabetes: +3
- BMI > 30: +2
- High cholesterol: +2
- Frequent fatigue: +1
- Age > 65: +1
- Family history: +2
- Heavy alcohol use: +2

### Protective Factors (Decrease Score):
- Regular exercise: -2

### Risk Levels:
- **Low Risk**: 0-30 points
- **Moderate Risk**: 31-60 points
- **High Risk**: 61-100 points

## Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to your hosting platform
3. Set environment variables for the API URL

### Backend Deployment (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Deploy the backend application
3. Ensure MongoDB is accessible (MongoDB Atlas recommended)

## Security Considerations

- JWT tokens are used for authentication
- Passwords are hashed using bcryptjs
- CORS is configured for cross-origin requests
- Environment variables store sensitive data
- Input validation on both frontend and backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Medical Disclaimer

**Important**: This application is for educational and awareness purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## Support

For technical issues or questions about the application, please create an issue in the repository or contact the development team.

---

**Built with React, Node.js, and MongoDB**
