
import passport, {Profile} from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import User, { IUser } from '../models/User';
import { Request } from 'express';
import dotenv from 'dotenv'

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET){
    throw new Error('Missing Google OAuth credentials in environment variables')
}

if (!CALLBACK_URL){
    throw new Error('Missing Callback URL in environment variables')
}



passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: CALLBACK_URL,
  passReqToCallback: true,
},
  async function(request: Request, accessToken: string, refreshToken: string, profile: any, done: any) {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.email,
          name: profile.displayName,
          profilePicture: profile.picture
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize and deserialize user

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as IUser)._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
