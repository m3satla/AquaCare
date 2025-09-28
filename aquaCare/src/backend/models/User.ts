export interface User {
  _id: string; // מזהה של MongoDB
  id: string;  // מזהה נוסף – חייב להיות גם string אם מגיע ממונגו

  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'Admin' | 'normal' | 'therapist' | 'patient';
  dateOfBirth: string;
  password: string;

  tempPassword?: string;
  gender: 'male' | 'female';
  profilePicture?: string;
  poolId?: string;
  therapyPool?: string;
  language?: string;
  accessibility?: boolean;
  highContrast?: boolean;
  textSize?: "small" | "medium" | "large";
  notifications?: boolean;
  isPresent?: boolean;

  therapist?: any; // אם אתה משתמש בזה – השאר, אחרת מומלץ להסיר
}
