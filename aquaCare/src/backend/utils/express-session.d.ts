// types/express-session.d.ts
import 'express-session';
import { User } from '../models/user';

declare module 'express-session' {
  interface SessionData {
    user?: Partial<User>;
  }
}