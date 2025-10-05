# Health & Diet Backend

Simple Express.js backend with Neon PostgreSQL database for storing healthcare and food diet records.

## Quick Start

1. **Navigate to server folder:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Server will run on:** `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /api/health` - Check if backend is running

### Healthcare Records
- `GET /api/healthcare?user_id=USER_ID` - Get all healthcare records
- `POST /api/healthcare` - Create new healthcare record
- `DELETE /api/healthcare/:id` - Delete healthcare record

### Food Diet Records
- `GET /api/food-diet?user_id=USER_ID` - Get all food diet records
- `POST /api/food-diet` - Create new food diet record
- `DELETE /api/food-diet/:id` - Delete food diet record

## Database Schema

### healthcare_records
- `id` (SERIAL PRIMARY KEY)
- `user_id` (VARCHAR)
- `type` (VARCHAR) - e.g., "weight", "blood_pressure", "heart_rate"
- `value` (VARCHAR) - the measurement value
- `unit` (VARCHAR) - e.g., "kg", "mmHg", "bpm"
- `notes` (TEXT)
- `created_at` (TIMESTAMP)

### food_diet_records
- `id` (SERIAL PRIMARY KEY)
- `user_id` (VARCHAR)
- `meal_type` (VARCHAR) - e.g., "breakfast", "lunch", "dinner", "snack"
- `food_name` (VARCHAR)
- `calories` (INTEGER)
- `protein` (DECIMAL)
- `carbs` (DECIMAL)
- `fat` (DECIMAL)
- `notes` (TEXT)
- `created_at` (TIMESTAMP)

## Frontend Integration

Use the `backendApiService` in your React components:

```typescript
import { backendApiService } from '../lib/backendApi';

// Create healthcare record
await backendApiService.createHealthcareRecord({
  type: 'weight',
  value: '70',
  unit: 'kg',
  notes: 'Morning weight'
});

// Create food record
await backendApiService.createFoodDietRecord({
  meal_type: 'breakfast',
  food_name: 'Oatmeal',
  calories: 300,
  protein: 10,
  carbs: 50,
  fat: 5
});
```

## Database Connection

The backend connects to your Neon database automatically. Tables are created on first startup if they don't exist.

## CORS

CORS is enabled for all origins to allow frontend connection during development.