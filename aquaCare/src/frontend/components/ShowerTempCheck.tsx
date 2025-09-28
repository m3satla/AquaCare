import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useTranslation } from "../hooks/useTranslation";

interface SensorReading {
  _id: string;
  time: string;
  value: string;
  label: string;
  sensorType: string;
  createdAt: string;
}

const ShowerTempCheck = () => {
  const { t } = useTranslation();
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // טעינת היסטוריה ממסד הנתונים
  useEffect(() => {
    loadSensorHistory();
  }, []);

  const loadSensorHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // נסה לטעון היסטוריה ספציפית לחיישן טמפרטורת מקלחת
      const response = await axios.get("http://localhost:5001/api/sensors/history/showerTemp");
      
      if (response.data.success) {
        setHistory(response.data.history || []);
      } else {
        // אם אין היסטוריה ספציפית, נטען את כל החיישנים
        const allSensorsResponse = await axios.get("http://localhost:5001/api/sensors");
        const allSensors = allSensorsResponse.data;
        
        // נמיר את הנתונים לפורמט המתאים
        const convertedHistory = allSensors.map((sensor: any) => ({
          _id: sensor._id,
          time: new Date(sensor.createdAt).toLocaleString("he-IL"),
          value: sensor.showerTemp?.toString() || "0",
          label: "טמפ' מים במקלחות",
          sensorType: "showerTemp",
          createdAt: sensor.createdAt
        }));
        
        setHistory(convertedHistory);
      }
    } catch (err: any) {
      console.error("❌ Error loading sensor history:", err);
      setError(t('sensors.errorLoadingHistory', 'שגיאה בטעינת היסטוריית החיישן'));
    } finally {
      setLoading(false);
    }
  };

  const checkSensor = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const value = (Math.random() * (60 - 20) + 20).toFixed(1);
      const now = new Date().toLocaleString("he-IL");
      const label = "טמפ' מים במקלחות";
      
      // שמירה במסד הנתונים
      const sensorData = {
        id: Date.now(), // מזהה ייחודי
        name: "Shower Temperature Sensor",
        temperature: 34,
        chlorine: 2.5,
        showerTemp: parseFloat(value),
        acidity: 7.2,
        sensorType: "showerTemp",
        readingTime: now,
        label: label
      };

      const response = await axios.post("http://localhost:5001/api/sensors", sensorData);
      
      if (response.data.success) {
        setResult(value + " °C");
        
        // הוספה להיסטוריה המקומית
        const newReading: SensorReading = {
          _id: response.data.sensor._id,
          time: now,
          value,
          label,
          sensorType: "showerTemp",
          createdAt: response.data.sensor.createdAt
        };
        
        setHistory(prev => [newReading, ...prev]);
      } else {
        setError(t('sensors.errorSaving', 'שגיאה בשמירת הנתונים'));
      }
    } catch (err: any) {
      console.error("❌ Error saving sensor reading:", err);
      setError(t('sensors.errorSaving', 'שגיאה בשמירת הנתונים'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {t('sensors.showerTemp', 'טמפ\' מים במקלחות')}
      </Typography>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Button 
          variant="contained" 
          color="primary" 
          onClick={checkSensor}
          disabled={saving}
          sx={{ mb: 2 }}
        >
          {saving ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              {t('sensors.saving', 'שומר...')}
            </>
          ) : (
            t('sensors.performCheck', 'בצע בדיקה')
          )}
        </Button>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Typography variant="h5" color="secondary" mt={2}>
          {t('sensors.currentResult', 'תוצאה נוכחית')}: {result}
        </Typography>
      )}

      <Paper elevation={3} sx={{ mt: 4 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            {t('sensors.history', 'היסטוריית בדיקות')}
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('sensors.dateTime', 'תאריך ושעה')}</TableCell>
                <TableCell>{t('sensors.testType', 'על מה בוצע')}</TableCell>
                <TableCell>{t('sensors.result', 'תוצאה')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    {t('sensors.noHistory', 'אין היסטוריית בדיקות')}
                  </TableCell>
                </TableRow>
              ) : (
                history.map((entry) => (
                  <TableRow key={entry._id}>
                    <TableCell>{entry.time}</TableCell>
                    <TableCell>{entry.label}</TableCell>
                    <TableCell>{entry.value} °C</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default ShowerTempCheck;
