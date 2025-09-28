export interface Appointment {
  id?: number; // אם זה מ־MongoDB, אולי זה בכלל `_id` מסוג string – עדיף להפוך לגמיש
  _id?: string; // מזהה Mongo
  clientId: string;
  employeeId: string;
  poolId: string;
  date: string;
  time: string;
  type: string;
  notes?: string;
  isConfirmed?: boolean;
  isCanceled?: boolean;
  isNoShow?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

import axios from "axios";

export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await axios.get<Appointment[]>("http://localhost:5001/api/appointments");
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};
