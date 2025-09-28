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

const WaterQualityMonitor = () => {
  const { t, currentLanguage } = useTranslation();
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
      
      // נסה לטעון היסטוריה ספציפית לחיישן טמפרטורת מים
      const response = await axios.get("http://localhost:5001/api/sensors/history/waterTemp");
      
      if (response.data.success && response.data.history && response.data.history.length > 0) {
        const convertedHistory = response.data.history.map((sensor: any) => ({
          _id: sensor._id || sensor.id,
          time: new Date(sensor.createdAt || sensor.readingTime).toLocaleString(currentLanguage === 'en' ? "en-US" : "he-IL"),
          value: sensor.temperature?.toString() || sensor.value || "0",
          label: t('sensors.waterTemp', 'Water Temperature'),
          sensorType: "waterTemp",
          createdAt: sensor.createdAt || sensor.readingTime
        }));
        
        setHistory(convertedHistory);
      } else {
        // אם אין היסטוריה ספציפית, נטען את כל החיישנים
        const allSensorsResponse = await axios.get("http://localhost:5001/api/sensors");
        const allSensors = allSensorsResponse.data;
        
        if (Array.isArray(allSensors) && allSensors.length > 0) {
          // נמיר את הנתונים לפורמט המתאים
          const convertedHistory = allSensors
            .filter((sensor: any) => sensor.temperature || sensor.sensorType === "waterTemp")
            .map((sensor: any) => ({
              _id: sensor._id || sensor.id,
              time: new Date(sensor.createdAt || sensor.readingTime).toLocaleString(currentLanguage === 'en' ? "en-US" : "he-IL"),
              value: sensor.temperature?.toString() || sensor.value || "0",
              label: t('sensors.waterTemp', 'Water Temperature'),
              sensorType: "waterTemp",
              createdAt: sensor.createdAt || sensor.readingTime
            }));
          
          setHistory(convertedHistory);
        } else {
          // אם אין נתונים, ניצור נתונים לדוגמה
          const mockData = [
            {
              _id: "1",
              time: new Date(Date.now() - 3600000).toLocaleString(currentLanguage === 'en' ? "en-US" : "he-IL"),
              value: "36.2",
              label: t('sensors.waterTemp', 'Water Temperature'),
              sensorType: "waterTemp",
              createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
              _id: "2", 
              time: new Date(Date.now() - 7200000).toLocaleString(currentLanguage === 'en' ? "en-US" : "he-IL"),
              value: "35.8",
              label: t('sensors.waterTemp', 'Water Temperature'),
              sensorType: "waterTemp",
              createdAt: new Date(Date.now() - 7200000).toISOString()
            }
          ];
          setHistory(mockData);
        }
      }
    } catch (err: any) {
      console.error("❌ Error loading sensor history:", err);
      setError(t('sensors.errorLoadingHistory', 'Error loading sensor history'));
      
      // אם יש שגיאה, ניצור נתונים לדוגמה
      const mockData = [
        {
          _id: "1",
          time: new Date(Date.now() - 3600000).toLocaleString(currentLanguage === 'en' ? "en-US" : "he-IL"),
          value: "36.2",
          label: t('sensors.waterTemp', 'Water Temperature'),
          sensorType: "waterTemp",
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          _id: "2",
          time: new Date(Date.now() - 7200000).toLocaleString(currentLanguage === 'en' ? "en-US" : "he-IL"),
          value: "35.8",
          label: t('sensors.waterTemp', 'Water Temperature'),
          sensorType: "waterTemp",
          createdAt: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      setHistory(mockData);
    } finally {
      setLoading(false);
    }
  };

  const checkSensor = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const value = (Math.random() * (38 - 34) + 34).toFixed(1);
      const now = new Date().toLocaleString(currentLanguage === 'en' ? "en-US" : "he-IL");
      const label = t('sensors.waterTemp', 'Water Temperature');
      
      // שמירה במסד הנתונים
      const sensorData = {
        id: Date.now(), // מזהה ייחודי
        name: "Water Temperature Sensor",
        temperature: parseFloat(value),
        chlorine: 2.5,
        showerTemp: 38,
        acidity: 7.2,
        sensorType: "waterTemp",
        readingTime: now,
        label: label
      };

      const response = await axios.post("http://localhost:5001/api/sensors", sensorData);
      
      if (response.data.success) {
        setResult(value + " °C");
        
        // הוספה להיסטוריה המקומית
        const newReading: SensorReading = {
          _id: response.data.sensor?._id || Date.now().toString(),
          time: now,
          value,
          label,
          sensorType: "waterTemp",
          createdAt: response.data.sensor?.createdAt || new Date().toISOString()
        };
        
        setHistory(prev => [newReading, ...prev]);
      } else {
        // אם השמירה נכשלה, נוסיף את הנתונים להיסטוריה המקומית בלבד
        setResult(value + " °C");
        
        const newReading: SensorReading = {
          _id: Date.now().toString(),
          time: now,
          value,
          label,
          sensorType: "waterTemp",
          createdAt: new Date().toISOString()
        };
        
        setHistory(prev => [newReading, ...prev]);
      }
    } catch (err: any) {
      console.error("❌ Error saving sensor reading:", err);
      
      // גם אם יש שגיאה, נוסיף נתונים לדוגמה
      const value = (Math.random() * (38 - 34) + 34).toFixed(1);
      const now = new Date().toLocaleString(currentLanguage === 'en' ? "en-US" : "he-IL");
      const label = t('sensors.waterTemp', 'Water Temperature');
      
      setResult(value + " °C");
      
      const newReading: SensorReading = {
        _id: Date.now().toString(),
        time: now,
        value,
        label,
        sensorType: "waterTemp",
        createdAt: new Date().toISOString()
      };
      
      setHistory(prev => [newReading, ...prev]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {t('sensors.waterTemp', 'Water Temperature')}
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
              {t('sensors.saving', 'Saving...')}
            </>
          ) : (
            t('sensors.performCheck', 'Perform Check')
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
          {t('sensors.currentResult', 'Current Result')}: {result}
        </Typography>
      )}

      <Paper elevation={3} sx={{ mt: 4 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            {t('sensors.history', 'Test History')}
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
                <TableCell>{t('sensors.result', 'Result')}</TableCell>
                <TableCell>{t('sensors.testType', 'Test Type')}</TableCell>
                <TableCell>{t('sensors.dateTime', 'Date & Time')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    {t('sensors.noHistory', 'No test history')}
                  </TableCell>
                </TableRow>
              ) : (
                history.map((entry) => (
                  <TableRow key={entry._id}>
                    <TableCell>{entry.value} °C</TableCell>
                    <TableCell>{entry.label}</TableCell>
                    <TableCell>{entry.time}</TableCell>
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

export default WaterQualityMonitor;
