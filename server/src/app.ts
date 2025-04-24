import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { CORS_CONFIG } from './config/config';
import session from 'express-session'
import authRouter from './routes/auth';
import './config/passport';
import passport from 'passport';
import { isAuthenticated } from './middleware/isAuthenticated';

dotenv.config();

const app = express();

app.use(express.json())
app.use(cors(CORS_CONFIG));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret',
    resave: false,
    saveUninitialized: false,
  }));
  
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);

// Home page
app.get("/", (req, res) => {
    res.send(`
        <h1>Welcome to TwoSpoon Drive</h1>
        <div>
            ${req.isAuthenticated() 
                ? '<a href="/dashboard">Go to Dashboard</a><br><a href="/auth/logout">Logout</a>'
                : '<a href="/auth/google">Login with Google</a>'
            }
        </div>
    `);
});

app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.send(`
        <h1>Login</h1>
        <a href="/auth/google">Login with Google</a>
    `);
});

// Dashboard page (protected route)
app.get('/dashboard', isAuthenticated, (req, res) => {
    const user = req.user;
    res.send(`
        <h1>Welcome to your Dashboard</h1>
        <p>User: ${user?.name}</p>
        <p>Email: ${user?.email}</p>
        <div>
            <h2>Your Files</h2>
            <!-- Add file list here -->
            <p>File management features coming soon...</p>
        </div>
        <a href="/auth/logout">Logout</a>
    `);
});

// Protected route example
app.get('/protected', isAuthenticated, (req, res) => {
    res.send("This is the protected route");
});



export default app;