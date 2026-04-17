# Heart Disease Awareness System - Backend

The backend API for the Heart Disease Awareness System, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **Authentication**: JWT-based user registration and login
- **Risk Assessment**: Calculate heart disease risk scores based on user responses
- **Data Management**: Store and retrieve user assessments and lifestyle data
- **Health Insights**: Generate personalized health recommendations
- **Secure API**: Password hashing, CORS, and input validation

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd heart-disease-awareness-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/heart-disease-awareness
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (when implemented)

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### POST /api/auth/login
Authenticate a user and return a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Assessment

#### GET /api/assessment/questions
Get the list of risk assessment questions.

**Response:**
```json
[
  {
    "id": 1,
    "question": "Do you experience chest pain during physical activity?",
    "weight": 3
  },
  ...
]
```

#### POST /api/assessment/calculate
Calculate risk score based on user responses.

**Request Body:**
```json
{
  "responses": [
    {
      "questionId": 1,
      "answer": true
    },
    ...
  ]
}
```

**Response:**
```json
{
  "riskScore": 45,
  "riskLevel": "moderate",
  "recommendations": [
    "Consult with a healthcare provider",
    "Implement regular exercise routine"
  ],
  "disclaimer": "This is not a medical diagnosis..."
}
```

#### POST /api/assessment/save
Save assessment results to user profile (requires authentication).

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "responses": [...],
  "riskScore": 45,
  "riskLevel": "moderate",
  "recommendations": [...]
}
```

#### GET /api/assessment/history
Get user's assessment history (requires authentication).

**Response:**
```json
[
  {
    "_id": "assessment_id",
    "userId": "user_id",
    "responses": [...],
    "riskScore": 45,
    "riskLevel": "moderate",
    "recommendations": [...],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### User Data

#### POST /api/user/lifestyle
Save lifestyle data (requires authentication).

**Request Body:**
```json
{
  "date": "2024-01-01",
  "steps": 10000,
  "waterIntake": 8,
  "sleepHours": 7,
  "exerciseMinutes": 30
}
```

#### GET /api/user/lifestyle
Get lifestyle data with optional date range (requires authentication).

**Query Parameters:**
- `startDate` - Start date (ISO string)
- `endDate` - End date (ISO string)

**Response:**
```json
[
  {
    "_id": "data_id",
    "userId": "user_id",
    "date": "2024-01-01T00:00:00.000Z",
    "steps": 10000,
    "waterIntake": 8,
    "sleepHours": 7,
    "exerciseMinutes": 30,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /api/user/insights
Get health insights based on lifestyle data (requires authentication).

**Response:**
```json
{
  "averages": {
    "steps": 8500,
    "water": 7,
    "sleep": 7.5,
    "exercise": 25
  },
  "insights": [
    "Consider increasing your daily steps to 8000+",
    "Try to drink at least 8 glasses of water daily"
  ]
}
```

## Database Models

### User
```typescript
interface IUser {
  username: string;
  email: string;
  password: string; // Hashed
  createdAt: Date;
}
```

### Assessment
```typescript
interface IAssessment {
  userId: ObjectId;
  responses: { question: string; answer: string | number }[];
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  recommendations: string[];
  createdAt: Date;
}
```

### LifestyleData
```typescript
interface ILifestyleData {
  userId: ObjectId;
  date: Date;
  steps: number;
  waterIntake: number;
  sleepHours: number;
  exerciseMinutes: number;
  createdAt: Date;
}
```

## Risk Assessment Algorithm

The risk assessment uses a weighted scoring system:

### Risk Factors (Positive Points):
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

### Protective Factors (Negative Points):
- Regular exercise: -2

### Risk Levels:
- **Low Risk**: 0-30 points
- **Moderate Risk**: 31-60 points
- **High Risk**: 61-100 points

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Request validation and sanitization
- **CORS Configuration**: Cross-origin request security
- **Environment Variables**: Secure configuration management

## Error Handling

The API uses standard HTTP status codes and returns error messages in a consistent format:

```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Development

### Project Structure
```
src/
  controllers/    # Route handlers
  middleware/     # Custom middleware
  models/         # Database models
  routes/         # API routes
  utils/          # Utility functions
  index.ts        # Server entry point
```

### Adding New Endpoints

1. Create controller function in `controllers/`
2. Add route in `routes/`
3. Update middleware if needed
4. Add TypeScript types if required

### Database Operations

All database operations use Mongoose models with proper error handling and validation.

## Deployment

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heart-disease-awareness
JWT_SECRET=your-very-secure-production-secret
NODE_ENV=production
```

### Production Build
```bash
npm run build
npm start
```

## Monitoring and Logging

Consider implementing:
- Request logging
- Error tracking
- Performance monitoring
- Database query optimization

## License

This project is licensed under the MIT License.
