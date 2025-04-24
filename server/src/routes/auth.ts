import { Router, Request, Response } from 'express';
import passport from 'passport';

const authRouter = Router();

authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

authRouter.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/dashboard',
  })
);

authRouter.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed', error: err });
    res.redirect('/');
  });
});

export default authRouter;
