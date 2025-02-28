<p align="center" width="100%">
   <img width="128px" src="images/favicon.ico" alt="Zeztra">
</p>

# Zeztra - Transaction Processing System

## Docker Setup

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Application with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Build and start the containers:
   ```bash
   docker-compose up
   ```

   This will build and start three containers:
   - MongoDB database (port 27017)
   - Backend API (port 5000)
   - Frontend application (port 3000)

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

### Stopping the Application

To stop the containers:
```bash
docker-compose down
```

To stop the containers and remove volumes (this will delete the database data):
```bash
docker-compose down -v
```

### Environment Variables

The Docker setup uses the following environment variables:

#### Backend
- PORT: The port on which the backend server runs (default: 5000)
- MONGO_URI: The MongoDB connection string (default: mongodb://mongodb:27017/zeztra)
- NODE_ENV: The environment mode (default: production)

#### Frontend
- NEXT_PUBLIC_API_URL: The URL of the backend API (default: http://backend:5000/api)

### Volumes

The Docker setup uses the following volumes:
- mongodb_data: For persisting MongoDB data
- ./backend/uploads:/app/uploads: For persisting uploaded files
  

## How to Run the Project

### Prerequisites
- Node.js (v20 or higher)
- MongoDB (local or remote)

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the backend root directory with the following variables:
   ```sh
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/zeztra
   NODE_ENV=development
   ```

4. Start the server in development mode:
   ```sh
   yarn dev
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```

2. Install dependencies:
   ```sh
   yarn
   ```

3. Create a `.env.local` file in the frontend root directory with the following variables:
   ```sh
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```sh
   yarn dev
   ```

5. Access the application in your browser:
   ```sh
   http://localhost:3000
   ```

## Application Usage

1. On the homepage, click the button to select a transaction file (`.txt` format).
2. After uploading, the transactions will be processed and displayed in the table.
3. Use filters to search transactions by client name or date range.
4. Navigate between pages using pagination controls.

## Technologies Used

### Backend
- Node.js and Express
- TypeScript
- MongoDB with Mongoose
- Multer for file uploads

### Frontend
- Next.js
- React
- TypeScript
- Styled Components
- Axios for HTTP requests

## Architectural Decisions

### Backend
- Clear separation of concerns (controllers, use cases, models, routes, etc.)
- Line-by-line file processing for efficiency
- Data validation and error handling
- Pagination and filters implemented directly in MongoDB queries

### Frontend
- Componentization for reusability
- State management with React Hooks
- Styling with Tailwind CSS to avoid CSS-in-JS (Performance)
- API communication through centralized services