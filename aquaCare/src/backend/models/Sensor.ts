// types/Sensor.ts (או בתוך api.ts)
export interface Simulation {
  _id?: string;
  id?: string;
  name: string;
  temperature: number;
  chlorine: number;
  showerTemp: number;
  acidity: number;
}
