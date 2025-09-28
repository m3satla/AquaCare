import mongoose from 'mongoose';
import { autoIncrementMiddleware } from '../middleware/autoIncrement';

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Auto-incremented numeric ID
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'normal', 'therapist', 'patient'], default: 'normal' },
  dateOfBirth: { type: String, required: true },
  password: { type: String, required: true },
  tempPassword: { type: String },
  phone: { type: String }, // Optional phone field
  gender: { type: String, enum: ['male', 'female'], required: true },
  profilePicture: { type: String },
  poolId: { type: String },
  therapyPool: { type: String },
  isPresent: { type: Boolean, default: false }, // חדש
  
  // 🧷 Account security & recovery
  failedLoginAttempts: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
  lockUntil: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },

  // 🟢 הגדרות משתמש (UserSettings)
  language: { type: String, enum: ['he', 'en'], default: 'he' },
  accessibility: { type: Boolean, default: false },
  highContrast: { type: Boolean, default: false },
  darkMode: { type: Boolean, default: false },
  textSize: { type: String, default: 'medium' } // שונה מ-Boolean לערך כמו 'small'/'medium'/'large'

}, { timestamps: true });

// Add auto-increment middleware for User IDs
userSchema.pre('save', autoIncrementMiddleware('users'));

// Ensure virtual fields are included when converting to JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    const { __v, ...rest } = ret;
    // Ensure _id is included and converted to string
    return {
      ...rest,
      _id: ret._id ? ret._id.toString() : ret._id
    };
  }
});

// user interface
export interface User {
  _id: string | any; // MongoDB ObjectId or string
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  dateOfBirth: string;
  password: string;
  tempPassword: string;
  phone?: string; // Optional phone field
  gender: string;
  profilePicture: string;
  poolId: string;
  therapyPool: string;
  isPresent: boolean; // חדש
  language: string;
  accessibility: boolean;
  highContrast: boolean;
  textSize: string;
  
  // Account security & recovery
  failedLoginAttempts: number;
  isLocked: boolean;
  lockUntil: Date | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
}

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
