import dotenv from 'dotenv'

dotenv.config();

export const PORT = process.env.PORT || 5000;

export const CORS_CONFIG = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}