import { Router, Request, Response } from 'express';
import passport from 'passport';

const authRouter = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

authRouter.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: `${FRONTEND_URL}/dashboard`,
  })
);

authRouter.get('/me', (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated(), user: req.user });
});

authRouter.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed', error: err });
    res.json({ message: 'Logged out successfully' });
  });
});

export default authRouter;
