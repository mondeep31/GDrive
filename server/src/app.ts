import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
// import { CORS_CONFIG } from './config/config';
import session from 'express-session'
import authRouter from './routes/auth';
import './config/passport';
import passport from 'passport';
import fileRoutes from './routes/fileRoutes';
import { CORS_CONFIG } from './config/config';

dotenv.config();


const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}))

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
// console.log("app.ts FE URL", FRONTEND_URL)

app.set('trust proxy', 1);


app.use(express.json())
app.use(express.urlencoded({ extended: true }));





app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {

        secure: true,
        httpOnly: true,
        sameSite: 'none'
    }
  }));
  
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/files', fileRoutes)
app.use('/auth', authRouter);



// Home page
app.get("/", (req, res) => {
    res.send(`
        <h1>This is the backend</h1>
    `);
});

app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json({ user: req.user });
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });
  



app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect(`${FRONTEND_URL}/dashboard`);
    }
    res.send(`
        <h1>Login</h1>
        <a href="/auth/google">Login with Google</a>
    `);
});



export default app;