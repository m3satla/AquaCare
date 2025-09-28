import axios from "axios";

let emergencyMode = false;

export function enableEmergencyMode() {
  emergencyMode = true;
}

export function disableEmergencyMode() {
  emergencyMode = false;
}

export const isEmergencyMode = async (): Promise<boolean> => {
  const res = await axios.get<{ emergency: boolean }>("http://localhost:5001/api/emergency-status");
  return res.data.emergency;
};

export const setEmergencyMode = async (emergency: boolean): Promise<void> => {
  await axios.post("http://localhost:5001/api/emergency-status", { emergency });
};
