import dotenv from 'dotenv'

dotenv.config();

export const PORT = process.env.PORT || 5000;

const FRONTEND_URL = process.env.FRONTEND_URL;

export const CORS_CONFIG = {
    origin: ["http://localhost:5173", FRONTEND_URL].filter(Boolean) as string[],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}