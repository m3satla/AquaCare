import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Button, CircularProgress, TextField, Card, CardContent, Alert } from "@mui/material";
import { motion } from "framer-motion";
import {
  MdLightbulb,
  MdOpacity,
  MdThermostat,
  MdWaves,
  MdLocalFireDepartment,
  MdShower,
  MdCheckCircle,
  MdWarning
} from "react-icons/md";
import { useTranslation } from "../hooks/useTranslation";
import axios from "axios";
import "../Styles/SensorStatus.css";
import { Simulation } from "../services/models/Sensor";
import { logActivity, updateDeviceStatus } from "../services/api";

const SAFE_LIMITS = {
  temperature: { max: 39 },
  chlorine: { max: 3 },
  showerTemp: { max: 45 },
  acidity: { min: 6.5, max: 8 }
};

const SensorStatus: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL, direction, currentLanguage } = useTranslation();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [selectedSimulationId, setSelectedSimulationId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const [isLightOn, setIsLightOn] = useState(false);
  const [isHeaterOn, setIsHeaterOn] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  const [temperature, setTemperature] = useState(34);
  const [chlorine, setChlorine] = useState(2.5);
  const [showerTemp, setShowerTemp] = useState(38);
  const [acidity, setAcidity] = useState(7.2);

  // State for live simulation
  const [showLiveSimulation, setShowLiveSimulation] = useState(false);
  const [liveSimulationLoading, setLiveSimulationLoading] = useState(false);
  const [liveSimulationResult, setLiveSimulationResult] = useState<string | null>(null);
  const [liveSimulationError, setLiveSimulationError] = useState(false);
  
  // State for manual input values
  const [manualTemperature, setManualTemperature] = useState(25);
  const [manualChlorine, setManualChlorine] = useState(2);
  const [manualAcidity, setManualAcidity] = useState(7.4);
  const [manualShowerTemp, setManualShowerTemp] = useState(30);
  
  // State for animation effects
  const [isUpdating, setIsUpdating] = useState(false);
  const [telegramSent, setTelegramSent] = useState(false);

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    setCurrentDate(now.toLocaleDateString(isRTL ? "he-IL" : "en-US", options));
  }, [isRTL]);

  useEffect(() => {
    loadSensors();
  }, []);

  const loadSensors = async () => {
    try {
      console.log("🔍 Attempting to load sensors from http://localhost:5001/api/sensors");
      const response = await axios.get("http://localhost:5001/api/sensors");
      console.log("✅ Response received:", response.status, response.data);

      if (response.data && Array.isArray(response.data)) {
        console.log(`📊 Found ${response.data.length} sensors`);
        setSimulations(response.data);

        const defaultSim = response.data.find(
          (sim: { name: string }) => sim.name === "רגיל" || sim.name === "Normal"
        );

        if (defaultSim) {
          console.log("🎯 Found default simulation:", defaultSim.name);
          setSelectedSimulationId(defaultSim._id);
          setTemperature(defaultSim.temperature);
          setChlorine(defaultSim.chlorine);
          setShowerTemp(defaultSim.showerTemp);
          setAcidity(defaultSim.acidity);
        } else {
          console.log("⚠️ No default simulation found");
        }
      } else {
        console.log("⚠️ Response data is not an array:", response.data);
      }
    } catch (err: any) {
      console.error("❌ Error loading sensors:", err);
      console.error("❌ Error details:", err.response?.data || err.message);
    }
  };

  // ✅ Function to log activity and update device status
  const logDeviceActivity = async (action: string, deviceType: string, status: boolean) => {
    console.log("🔧 logDeviceActivity called with:", { action, deviceType, status });
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
      if (currentUser._id && currentUser.email && currentUser.poolId) {
        // לוג פעילות
        await logActivity(
          currentUser._id,
          currentUser.email,
          action,
          "update",
          currentUser.poolId,
          `${deviceType} ${status ? t('sensors.activated') : t('sensors.deactivated')}`
        );
        console.log(`✅ Activity logged: ${action}`);
        
        // עדכון מצב מכשיר במסד הנתונים
        let apiDeviceType;
        if (deviceType === "lighting" || deviceType === "Lighting" || deviceType === "תאורה") {
          apiDeviceType = "light";
        } else if (deviceType === "heater" || deviceType === "Heater" || deviceType === "דוד") {
          apiDeviceType = "heater";
        } else {
          console.error("❌ Unknown device type:", deviceType);
          return;
        }
        console.log("🔧 Calling updateDeviceStatus with:", { apiDeviceType, status, userId: currentUser._id, poolId: currentUser.poolId });
        await updateDeviceStatus(apiDeviceType as "light" | "heater", status, currentUser._id, currentUser.poolId);
        console.log(`✅ Device status updated: ${apiDeviceType} = ${status}`);
      }
    } catch (logError) {
      console.error("❌ Error logging device activity:", logError);
    }
  };

  const sendEmergencyTelegramAlert = async (reason: string) => {
    try {
      const timestamp = new Date().toLocaleString('he-IL');
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
      const userName = currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.email || 'משתמש';
      
      const message = `🚨 מצב חירום הופעל במערכת AquaCare! 🚨\n\n` +
        `זמן: ${timestamp}\n` +
        `משתמש: ${userName}\n` +
        `סיבה: ${reason}\n\n` +
        `נתוני חיישנים נוכחיים:\n` +
        `🌡️ טמפרטורת מים: ${temperature}°C\n` +
        `🧪 רמת כלור: ${chlorine}ppm\n` +
        `🌊 רמת חומציות: ${acidity}pH\n` +
        `🚿 טמפרטורת מקלחת: ${showerTemp}°C\n\n` +
        `⚠️ יש לבדוק את המערכת מיד ולנקוט בפעולה מתאימה!`;

      await fetch('http://localhost:5001/api/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });
      
      console.log('✅ Emergency Telegram alert sent');
    } catch (error) {
      console.error('❌ Error sending Emergency Telegram alert:', error);
    }
  };

  const triggerEmergency = async (reason: string) => {
    console.warn("🚨 Emergency mode activated!", reason);
    setIsLightOn(false);
    setIsHeaterOn(false);
    setTestResult(t('emergency.emergencyActivated'));
    setIsError(true);

    // ✅ Log emergency activation
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
      if (currentUser._id && currentUser.email && currentUser.poolId) {
        await logActivity(
          currentUser._id,
          currentUser.email,
          t('sensors.emergencyActivated'),
          "error",
          currentUser.poolId,
          `${t('sensors.emergencyActivated')}: ${reason}`
        );
      }
    } catch (logError) {
      console.error("❌ Error logging emergency:", logError);
    }

    try {
      // שליחת הודעה מפורטת לטלגרם
      await sendEmergencyTelegramAlert(reason);
      
      // עדכון מצב חירום במסד הנתונים
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
        await axios.post("http://localhost:5001/api/emergency-status", {
          emergency: true,
          source: "sensor",
          userId: currentUser._id || "system",
          sendNotification: false, // לא שולח התראה נוספת כי כבר שלחנו
          reason: reason
        });
        console.log("✅ Emergency status updated successfully in database");
      } catch (emergencyError) {
        console.warn("⚠️ Failed to update emergency status:", emergencyError);
      }
    } catch (err) {
      console.error("❌ Error in emergency trigger:", err);
    }
  };

  const handleSensorCheck = async () => {
    setLoading(true);
    setTestResult(null);
    setIsError(false);

    try {
      if (!selectedSimulationId) {
        setTestResult(t('sensors.noSimulationSelected'));
        setIsError(true);
        setLoading(false);
        return;
      }

      const sim = simulations.find(s => s._id === selectedSimulationId);
      if (sim) {
        setTemperature(sim.temperature);
        setChlorine(sim.chlorine);
        setShowerTemp(sim.showerTemp);
        setAcidity(sim.acidity);
        setTestResult(`${t('sensors.sensorsConfigured')} ${sim.name}`);

        // ✅ Log sensor check activity
        try {
          const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
          if (currentUser._id && currentUser.email && currentUser.poolId) {
            await logActivity(
              currentUser._id,
              currentUser.email,
              t('sensors.sensorCheck'),
              "view",
              currentUser.poolId,
              `${t('sensors.sensorCheck')} ${sim.name} - ${t('sensors.temp')}: ${sim.temperature}°C, ${t('sensors.chlorine')}: ${sim.chlorine}ppm, ${t('sensors.acidity')}: ${sim.acidity}pH`
            );
          }
        } catch (logError) {
          console.error("❌ Error logging sensor check:", logError);
        }

        if (sim.temperature > SAFE_LIMITS.temperature.max)
          return triggerEmergency(currentLanguage === 'en' ? 'High water temperature!' : 'טמפרטורת מים גבוהה!');
        if (sim.chlorine > SAFE_LIMITS.chlorine.max)
          return triggerEmergency(currentLanguage === 'en' ? 'High chlorine level!' : 'רמת כלור גבוהה!');
        if (sim.showerTemp > SAFE_LIMITS.showerTemp.max)
          return triggerEmergency(currentLanguage === 'en' ? 'High shower temperature!' : 'טמפרטורת מקלחת גבוהה!');
        if (sim.acidity < SAFE_LIMITS.acidity.min || sim.acidity > SAFE_LIMITS.acidity.max)
          return triggerEmergency(currentLanguage === 'en' ? 'Invalid acidity level!' : 'רמת חומציות לא תקינה!');
      } else {
        setTestResult(t('sensors.simulationNotFound'));
        setIsError(true);
      }
    } catch (err) {
      console.error("❌ Error during sensor check:", err);
      setTestResult(t('general.error'));
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לטיפול בסימולציה חייה
  const handleLiveSimulation = async () => {
    setLiveSimulationLoading(true);
    setLiveSimulationResult(null);
    setLiveSimulationError(false);

    try {
      // עדכון הנתונים בממשק בזמן אמת עם אנימציה
      setIsUpdating(true);
      setTimeout(() => {
        setTemperature(manualTemperature);
        setChlorine(manualChlorine);
        setAcidity(manualAcidity);
        setShowerTemp(manualShowerTemp);
        setIsUpdating(false);
      }, 500); // אנימציה קצרה לפני העדכון

      // בדיקת תקינות הנתונים הידניים
      const issues: string[] = [];
      
      if (manualTemperature > SAFE_LIMITS.temperature.max) {
        issues.push(currentLanguage === 'en' ? 'Water temperature out of range' : 'טמפרטורת מים מחוץ לטווח הבטוח');
      }
      
      if (manualChlorine > SAFE_LIMITS.chlorine.max) {
        issues.push(currentLanguage === 'en' ? 'Chlorine level out of range' : 'רמת כלור מחוץ לטווח הבטוח');
      }
      
      if (manualAcidity < SAFE_LIMITS.acidity.min || manualAcidity > SAFE_LIMITS.acidity.max) {
        issues.push(currentLanguage === 'en' ? 'Acidity level out of range' : 'רמת חומציות מחוץ לטווח הבטוח');
      }
      
      if (manualShowerTemp > SAFE_LIMITS.showerTemp.max) {
        issues.push(currentLanguage === 'en' ? 'Shower temperature out of range' : 'טמפרטורת מקלחת מחוץ לטווח הבטוח');
      }

      // לוג פעילות
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
      if (currentUser._id && currentUser.email && currentUser.poolId) {
        await logActivity(
          currentUser._id,
          currentUser.email,
          'Manual Sensor Input',
          "update",
          currentUser.poolId,
          `Manual sensor input: Temp: ${manualTemperature}°C, Chlorine: ${manualChlorine}ppm, Acidity: ${manualAcidity}pH, Shower: ${manualShowerTemp}°C`
        );
      }

      // שליחת הודעה לטלגרם - תמיד
      await sendTelegramUpdate(issues.length > 0, issues);
      
      // הודעה על שליחה לטלגרם
      console.log('✅ Data sent to Telegram successfully');
      setTelegramSent(true);
      setTimeout(() => setTelegramSent(false), 3000); // הסתר אחרי 3 שניות

      if (issues.length > 0) {
        // יש בעיות
        setLiveSimulationError(true);
        setLiveSimulationResult(currentLanguage === 'en' 
          ? `⚠️ Issues detected: ${issues.join(', ')}` 
          : `⚠️ זוהו בעיות: ${issues.join(', ')}`
        );
      } else {
        // הכל תקין
        setLiveSimulationError(false);
        setLiveSimulationResult(currentLanguage === 'en' 
          ? '✅ All sensor readings are within safe limits' 
          : '✅ כל קריאות החיישנים בטווח הבטוח'
        );
      }
    } catch (error) {
      console.error('Error in live simulation:', error);
      setLiveSimulationError(true);
      setLiveSimulationResult(currentLanguage === 'en' ? 'Error processing simulation' : 'שגיאה בעיבוד הסימולציה');
    } finally {
      setLiveSimulationLoading(false);
    }
  };

  const sendTelegramUpdate = async (hasIssues: boolean, issues: string[] = []) => {
    try {
      const timestamp = new Date().toLocaleString('he-IL');
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
      const userName = currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.email || 'משתמש';
      
      let message = '';
      
      if (hasIssues) {
        message = `🚨 התראת חיישנים - נתונים ידניים!\n\n` +
          `זמן: ${timestamp}\n` +
          `משתמש: ${userName}\n` +
          `נתונים שהוזנו:\n` +
          `🌡️ טמפרטורת מים: ${manualTemperature}°C\n` +
          `🧪 רמת כלור: ${manualChlorine}ppm\n` +
          `🌊 רמת חומציות: ${manualAcidity}pH\n` +
          `🚿 טמפרטורת מקלחת: ${manualShowerTemp}°C\n\n` +
          `⚠️ בעיות שזוהו:\n${issues.map(issue => `• ${issue}`).join('\n')}\n\n` +
          `יש לבדוק את המערכת מיד ולנקוט בפעולה מתאימה.`;
      } else {
        message = `✅ עדכון חיישנים - נתונים ידניים\n\n` +
          `זמן: ${timestamp}\n` +
          `משתמש: ${userName}\n` +
          `נתונים שהוזנו:\n` +
          `🌡️ טמפרטורת מים: ${manualTemperature}°C\n` +
          `🧪 רמת כלור: ${manualChlorine}ppm\n` +
          `🌊 רמת חומציות: ${manualAcidity}pH\n` +
          `🚿 טמפרטורת מקלחת: ${manualShowerTemp}°C\n\n` +
          `✅ כל הנתונים בטווח הבטוח\n` +
          `המערכת פועלת כרגיל.`;
      }

      await fetch('http://localhost:5001/api/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });
      
      console.log('✅ Telegram update sent');
    } catch (error) {
      console.error('❌ Error sending Telegram update:', error);
    }
  };

  const sendTelegramAlert = async (issues: string[]) => {
    try {
      const timestamp = new Date().toLocaleString('he-IL');
      const message = `🚨 התראת חיישנים - סימולציה חייה!\n\n` +
        `זמן: ${timestamp}\n` +
        `נתונים שהוזנו:\n` +
        `🌡️ טמפרטורת מים: ${manualTemperature}°C\n` +
        `🧪 רמת כלור: ${manualChlorine}ppm\n` +
        `🌊 רמת חומציות: ${manualAcidity}pH\n` +
        `🚿 טמפרטורת מקלחת: ${manualShowerTemp}°C\n\n` +
        `⚠️ בעיות שזוהו:\n${issues.map(issue => `• ${issue}`).join('\n')}\n\n` +
        `יש לבדוק את המערכת מיד ולנקוט בפעולה מתאימה.`;

      await fetch('http://localhost:5001/api/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });
      
      console.log('✅ Telegram alert sent');
    } catch (error) {
      console.error('❌ Error sending Telegram alert:', error);
    }
  };

  const toggleLiveSimulation = () => {
    setShowLiveSimulation(!showLiveSimulation);
    setLiveSimulationResult(null);
    setLiveSimulationError(false);
  };

  const resetManualValues = () => {
    setManualTemperature(25);
    setManualChlorine(2);
    setManualAcidity(7.4);
    setManualShowerTemp(30);
  };

  return (
    <Container className="sensor-container" sx={{ direction }}>
      <Typography variant="h6" className="sensor-date">{currentDate}</Typography>

      <Box className="sensor-grid">
        <SensorItem 
          icon={<MdThermostat />} 
          value={`${temperature.toFixed(1)}°C`} 
          label={t('sensors.waterTemp')} 
          sensorType="waterTemp" 
          isUpdating={isUpdating}
        />
        <SensorItem 
          icon={<MdOpacity />} 
          value={`${chlorine.toFixed(1)} ppm`} 
          label={t('sensors.chlorineLevel')} 
          sensorType="chlorine" 
          isUpdating={isUpdating}
        />
        <SensorItem 
          icon={<MdWaves />} 
          value={`${acidity.toFixed(1)} pH`} 
          label={t('sensors.acidityLevel')} 
          sensorType="acidity" 
          isUpdating={isUpdating}
        />
        <SensorItem 
          icon={<MdShower />} 
          value={`${showerTemp.toFixed(1)}°C`} 
          label={t('sensors.showerTemp')} 
          sensorType="showerTemp" 
          isUpdating={isUpdating}
        />
      </Box>
      
      <Typography variant="caption" sx={{ mt: 1, opacity: 0.7, display: 'block' }}>
        {t('sensors.clickForDetails', 'לחץ על חיישן לצפייה בפרטים אישיים')}
      </Typography>
      
      {isUpdating && (
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 1, 
            color: '#1976d2', 
            fontWeight: 'bold',
            textAlign: 'center',
            animation: 'fadeInOut 2s ease-in-out',
            '@keyframes fadeInOut': {
              '0%': { opacity: 0, transform: 'translateY(-10px)' },
              '50%': { opacity: 1, transform: 'translateY(0)' },
              '100%': { opacity: 0, transform: 'translateY(-10px)' }
            }
          }}
        >
          {currentLanguage === 'en' ? '🔄 Updating sensor values...' : '🔄 מעדכן ערכי חיישנים...'}
        </Typography>
      )}
      
      {telegramSent && (
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 1, 
            color: '#4caf50', 
            fontWeight: 'bold',
            textAlign: 'center',
            animation: 'slideIn 0.5s ease-out',
            '@keyframes slideIn': {
              '0%': { opacity: 0, transform: 'translateX(-20px)' },
              '100%': { opacity: 1, transform: 'translateX(0)' }
            }
          }}
        >
          {currentLanguage === 'en' ? '📱 Data sent to Telegram!' : '📱 הנתונים נשלחו לטלגרם!'}
        </Typography>
      )}

      <Box className="control-buttons">
        <ControlButton 
          icon={<MdLightbulb />} 
          label={isLightOn ? t('sensors.turnOffLight') : t('sensors.turnOnLight')} 
          isActive={isLightOn} 
          onClick={() => {
            const newStatus = !isLightOn;
            setIsLightOn(newStatus);
            logDeviceActivity(
              newStatus ? t('sensors.lightOn') : t('sensors.lightOff'),
              t('sensors.lighting'),
              newStatus
            );
          }} 
        />
        <ControlButton 
          icon={<MdLocalFireDepartment />} 
          label={isHeaterOn ? t('sensors.turnOffHeater') : t('sensors.turnOnHeater')} 
          isActive={isHeaterOn} 
          onClick={() => {
            const newStatus = !isHeaterOn;
            setIsHeaterOn(newStatus);
            logDeviceActivity(
              newStatus ? t('sensors.heaterOn') : t('sensors.heaterOff'),
              t('sensors.heater'),
              newStatus
            );
          }} 
        />
      </Box>

      <Box className="simulation-section" sx={{ mt: 4 }}>
        <Typography variant="subtitle1">{t('sensors.selectSimulation')}</Typography>
        <select
          value={selectedSimulationId}
          onChange={(e) => setSelectedSimulationId(e.target.value)}
          aria-label={t('sensors.selectSimulation')}
        >
          <option value="">{t('sensors.selectOption')}</option>
          {simulations.map(sim => (
            <option key={sim._id} value={sim._id}>{sim.name}</option>
          ))}
        </select>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleSensorCheck}
          disabled={loading}
          sx={{ mt: 2, fontSize: 16, fontWeight: "bold", textTransform: "none" }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : t('sensors.performTests')}
        </Button>

        {testResult && (
          <Typography
            variant="h6"
            sx={{ mt: 2, color: isError ? "red" : "green", display: "flex", alignItems: "center", gap: 1 }}
          >
            {isError ? <MdWarning size={24} /> : <MdCheckCircle size={24} />} {testResult}
          </Typography>
        )}

        {/* כפתור סימולציה חייה */}
        <Button
          variant="contained"
          color="primary"
          onClick={toggleLiveSimulation}
          sx={{ mt: 2, ml: 2, fontSize: 16, fontWeight: "bold", textTransform: "none" }}
        >
          {showLiveSimulation ? (currentLanguage === 'en' ? 'Hide Manual Input' : 'הסתר הזנה ידנית') : (currentLanguage === 'en' ? 'Manual Input' : 'הזנה ידנית')}
        </Button>

        {liveSimulationResult && (
          <Typography
            variant="h6"
            sx={{ mt: 2, color: liveSimulationError ? "red" : "green", display: "flex", alignItems: "center", gap: 1 }}
          >
            {liveSimulationError ? <MdWarning size={24} /> : <MdCheckCircle size={24} />} {liveSimulationResult}
          </Typography>
        )}

        {/* ממשק הזנה ידנית */}
        {showLiveSimulation && (
          <Card elevation={3} sx={{ mt: 3, p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {currentLanguage === 'en' ? 'Manual Sensor Input' : 'הזנת נתוני חיישנים ידנית'}
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MdThermostat size={24} style={{ marginRight: 8 }} />
                    <Typography variant="subtitle1">
                      {currentLanguage === 'en' ? 'Water Temperature' : 'טמפרטורת מים'} (°C)
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type="number"
                    value={manualTemperature}
                    onChange={(e) => setManualTemperature(Number(e.target.value))}
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                    helperText={`${currentLanguage === 'en' ? 'Safe range' : 'טווח בטוח'}: 20-${SAFE_LIMITS.temperature.max}°C`}
                  />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MdOpacity size={24} style={{ marginRight: 8 }} />
                    <Typography variant="subtitle1">
                      {currentLanguage === 'en' ? 'Chlorine Level' : 'רמת כלור'} (ppm)
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type="number"
                    value={manualChlorine}
                    onChange={(e) => setManualChlorine(Number(e.target.value))}
                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                    helperText={`${currentLanguage === 'en' ? 'Safe range' : 'טווח בטוח'}: 1-${SAFE_LIMITS.chlorine.max}ppm`}
                  />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MdWaves size={24} style={{ marginRight: 8 }} />
                    <Typography variant="subtitle1">
                      {currentLanguage === 'en' ? 'Acidity Level' : 'רמת חומציות'} (pH)
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type="number"
                    value={manualAcidity}
                    onChange={(e) => setManualAcidity(Number(e.target.value))}
                    inputProps={{ min: 0, max: 14, step: 0.1 }}
                    helperText={`${currentLanguage === 'en' ? 'Safe range' : 'טווח בטוח'}: ${SAFE_LIMITS.acidity.min}-${SAFE_LIMITS.acidity.max}pH`}
                  />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MdShower size={24} style={{ marginRight: 8 }} />
                    <Typography variant="subtitle1">
                      {currentLanguage === 'en' ? 'Shower Temperature' : 'טמפרטורת מקלחת'} (°C)
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type="number"
                    value={manualShowerTemp}
                    onChange={(e) => setManualShowerTemp(Number(e.target.value))}
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                    helperText={`${currentLanguage === 'en' ? 'Safe range' : 'טווח בטוח'}: 20-${SAFE_LIMITS.showerTemp.max}°C`}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLiveSimulation}
                  disabled={liveSimulationLoading}
                  size="large"
                  sx={{ minWidth: 150 }}
                >
                  {liveSimulationLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    currentLanguage === 'en' ? 'Run Simulation' : 'הפעל סימולציה'
                  )}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={resetManualValues}
                  disabled={liveSimulationLoading}
                  size="large"
                  sx={{ minWidth: 150 }}
                >
                  {currentLanguage === 'en' ? 'Reset' : 'אפס'}
                </Button>
              </Box>

              {liveSimulationResult && (
                <Alert 
                  severity={liveSimulationError ? "warning" : "success"}
                  sx={{ mt: 2 }}
                >
                  {liveSimulationResult}
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

const SensorItem: React.FC<{ icon: React.ReactNode; value: string; label: string; sensorType: string; isUpdating?: boolean }> = ({ icon, value, label, sensorType, isUpdating = false }) => {
  const navigate = useNavigate();
  
  const handleSensorClick = () => {
    switch (sensorType) {
      case 'waterTemp':
        navigate('/personal-sensors?type=waterTemp');
        break;
      case 'chlorine':
        navigate('/personal-sensors?type=chlorine');
        break;
      case 'acidity':
        navigate('/personal-sensors?type=acidity');
        break;
      case 'showerTemp':
        navigate('/personal-sensors?type=showerTemp');
        break;
      default:
        navigate('/personal-sensors');
    }
  };

  return (
    <motion.div 
      className="sensor-item" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      onClick={handleSensorClick}
      style={{ cursor: 'pointer', position: 'relative' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Box 
        className="sensor-icon"
        sx={{
          animation: isUpdating ? 'pulse 1s ease-in-out' : 'none',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', opacity: 1 },
            '50%': { transform: 'scale(1.1)', opacity: 0.8 },
            '100%': { transform: 'scale(1)', opacity: 1 }
          }
        }}
      >
        {icon}
      </Box>
      <Typography 
        className="sensor-value"
        sx={{
          color: isUpdating ? '#1976d2' : 'inherit',
          fontWeight: isUpdating ? 'bold' : 'normal',
          transition: 'all 0.3s ease'
        }}
      >
        {value}
      </Typography>
      <Typography className="sensor-label">{label}</Typography>
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 5, 
          right: 5, 
          fontSize: '12px', 
          opacity: 0.6,
          color: 'white'
        }}
      >
        👆
      </Box>
    </motion.div>
  );
};

const ControlButton: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({
  icon, label, isActive, onClick
}) => (
  <motion.div className="control-button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
    <Button variant={isActive ? "contained" : "outlined"} className="control-btn" onClick={onClick}>
      <span className="control-icon">{icon}</span>
      {label}
    </Button>
  </motion.div>
);

export default SensorStatus;


