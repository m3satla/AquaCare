import { UserSettings } from "../models/UserSettings";

export interface SettingsComponentProps {
  userId: number;
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  handleSave: () => void;
}