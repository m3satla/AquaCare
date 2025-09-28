import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import {
  Thermostat,
  WaterDrop,
  Lightbulb,
  AutoFixHigh,
  Refresh,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Info,
  Pool
} from "@mui/icons-material";
import { logActivity } from "../services/api";
import { useTranslation } from "../hooks/useTranslation";
import axios from "axios";

interface SensorData {
  _id: string;
  name: string;
  temperature: number;
  chlorine: number;
  acidity: number;
  showerTemp: number;
}

interface OptimizationData {
  poolId: string;
  poolTemperature: number;
  chlorineLevel: number;
  acidityLevel: number;
  showerTemperature: number;
  lightingStatus: boolean;
  heaterStatus: boolean;
}

const OptimizationManager = () => {
  const { t, currentLanguage } = useTranslation();
  const [data, setData] = useState<OptimizationData | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [poolId, setPoolId] = useState<string | null>(null);
  const [lastOptimization, setLastOptimization] = useState<string | null>(null);
  
  // State for sensor data
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [selectedSensorId, setSelectedSensorId] = useState<string>("");
  const [lightingStatus, setLightingStatus] = useState(false);
  const [heaterStatus, setHeaterStatus] = useState(false);
  
  // State for optimized data (separate from original sensor data)
  const [optimizedData, setOptimizedData] = useState<OptimizationData | null>(null);
  const [isOptimized, setIsOptimized] = useState(false);

  // שליפת poolId מהמשתמש המחובר (בעת טעינה)
  useEffect(() => {
    const stored = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (stored) {
      const user = JSON.parse(stored);
      setPoolId(user?.poolId || null);
    } else {
      setPoolId(null);
    }
  }, []);

  // שליפת נתוני חיישנים כאשר poolId מוכן
  useEffect(() => {
    if (poolId) {
      console.log("🔍 poolId =", poolId);
      fetchSensorData();
    }
  }, [poolId]);

  // עדכון המלצות כאשר השפה משתנה
  useEffect(() => {
    if (data) {
      console.log("🌐 Language changed to:", currentLanguage);
      generateRecommendations(data);
    }
  }, [currentLanguage, data]);

  // עדכון המלצות כאשר הנתונים האופטימליים משתנים
  useEffect(() => {
    if (optimizedData && isOptimized) {
      console.log("🔄 Optimized data changed, updating recommendations");
      generateRecommendations(optimizedData);
    }
  }, [currentLanguage, optimizedData, isOptimized]);

  // עדכון המלצות כאשר סטטוס התאורה או הדוד משתנה
  useEffect(() => {
    if (data) {
      const updatedData = { ...data, lightingStatus, heaterStatus };
      generateRecommendations(updatedData);
    }
  }, [currentLanguage, lightingStatus, heaterStatus, data]);

  // עדכון המלצות כאשר החיישן הנבחר משתנה
  useEffect(() => {
    if (selectedSensorId && sensorData.length > 0) {
      const selectedSensor = sensorData.find(s => s._id === selectedSensorId);
      if (selectedSensor) {
        updateOptimizationData(selectedSensor);
      }
    }
  }, [currentLanguage, selectedSensorId, sensorData]);

  const fetchSensorData = async () => {
    try {
      console.log("📡 שולח בקשה ל:", `api/sensors`);
      const response = await axios.get("http://localhost:5001/api/sensors");
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`📊 Found ${response.data.length} sensors`);
        setSensorData(response.data);

        // בחירת הסימולציה הראשונה כברירת מחדל
        if (response.data.length > 0) {
          const defaultSensor = response.data[0];
          setSelectedSensorId(defaultSensor._id);
          updateOptimizationData(defaultSensor);
        }
      }
    } catch (error) {
      console.error(t('optimization.errorLoadingSensorData'), error);
    } finally {
      setLoading(false);
    }
  };

  const updateOptimizationData = (sensor: SensorData) => {
    const optimizationData: OptimizationData = {
      poolId: poolId || "",
      poolTemperature: sensor.temperature,
      chlorineLevel: sensor.chlorine,
      acidityLevel: sensor.acidity,
      showerTemperature: sensor.showerTemp,
      lightingStatus: lightingStatus,
      heaterStatus: heaterStatus
    };
    
    setData(optimizationData);
    generateRecommendations(optimizationData);
  };

  const generateRecommendations = (data: OptimizationData) => {
    console.log("🔄 Generating recommendations for language:", currentLanguage);
    const recs: string[] = [];

    // בדיקת טמפרטורת מים
    if (data.poolTemperature > 30) {
      recs.push(t('optimization.temperatureHigh'));
    }
    if (data.poolTemperature < 25) {
      recs.push(t('optimization.temperatureLow'));
    }

    // בדיקת רמת כלור
    if (data.chlorineLevel < 1) {
      recs.push(t('optimization.chlorineLow'));
    }
    if (data.chlorineLevel > 3) {
      recs.push(t('optimization.chlorineHigh'));
    }

    // בדיקת רמת חומציות
    if (data.acidityLevel < 6.5) {
      recs.push(t('optimization.acidityLow'));
    }
    if (data.acidityLevel > 8) {
      recs.push(t('optimization.acidityHigh'));
    }

    // בדיקת טמפרטורת מקלחת
    if (data.showerTemperature > 45) {
      recs.push(t('optimization.showerHigh'));
    }

    // המלצות לתאורה ודוד
    if (!data.lightingStatus) {
      recs.push(t('optimization.lightingOff'));
    }
    if (!data.heaterStatus && data.poolTemperature < 25) {
      recs.push(t('optimization.heaterOn'));
    }

    if (recs.length === 0) {
      recs.push(t('optimization.allOptimal'));
    }

    console.log("📋 Final recommendations:", recs);
    setRecommendations(recs);
  };

  const generateSmartOptimization = () => {
    if (!data) return {};

    const optimizations: any = {};
    const changes: string[] = [];

    // אופטימיזציה חכמה לטמפרטורה
    if (data.poolTemperature > 30) {
      const tempReduction = Math.min(2, data.poolTemperature - 28); // הפחתה עד 28°C
      optimizations.poolTemperature = data.poolTemperature - tempReduction;
      changes.push(t('optimization.temperatureReduced'));
    } else if (data.poolTemperature < 25) {
      const tempIncrease = Math.min(2, 27 - data.poolTemperature); // העלאה עד 27°C
      optimizations.poolTemperature = data.poolTemperature + tempIncrease;
      changes.push(t('optimization.temperatureIncreased'));
    }

    // אופטימיזציה חכמה לכלור
    if (data.chlorineLevel < 1) {
      const chlorineIncrease = Math.min(0.5, 1.5 - data.chlorineLevel);
      optimizations.chlorineLevel = data.chlorineLevel + chlorineIncrease;
      changes.push(t('optimization.chlorineIncreased'));
    } else if (data.chlorineLevel > 3) {
      const chlorineReduction = Math.min(0.5, data.chlorineLevel - 2.5);
      optimizations.chlorineLevel = data.chlorineLevel - chlorineReduction;
      changes.push(t('optimization.chlorineReduced'));
    }

    // אופטימיזציה חכמה לחומציות
    if (data.acidityLevel < 6.5) {
      const acidityIncrease = Math.min(0.3, 7.0 - data.acidityLevel);
      optimizations.acidityLevel = data.acidityLevel + acidityIncrease;
      changes.push(t('optimization.pHIncreased'));
    } else if (data.acidityLevel > 8) {
      const acidityReduction = Math.min(0.3, data.acidityLevel - 7.5);
      optimizations.acidityLevel = data.acidityLevel - acidityReduction;
      changes.push(t('optimization.pHReduced'));
    }

    // אופטימיזציה חכמה לתאורה
    const currentHour = new Date().getHours();
    if (currentHour >= 18 || currentHour <= 6) { // ערב או בוקר מוקדם
      if (!data.lightingStatus) {
        optimizations.lightingStatus = true;
        changes.push(t('optimization.poolLightingOn'));
      }
    } else {
      if (data.lightingStatus) {
        optimizations.lightingStatus = false;
        changes.push(t('optimization.poolLightingOff'));
      }
    }

    // אופטימיזציה חכמה לדוד
    if (data.poolTemperature < 25 && !data.heaterStatus) {
      optimizations.heaterStatus = true;
      changes.push(t('optimization.poolHeaterOn'));
    } else if (data.poolTemperature > 28 && data.heaterStatus) {
      optimizations.heaterStatus = false;
      changes.push(t('optimization.poolHeaterOff'));
    }

    if (changes.length === 0) {
      changes.push(t('optimization.noOptimizationsNeeded'));
    }

    return { optimizations, changes };
  };



  const handleOptimize = async () => {
    try {
      if (!poolId || !data) return;

      setOptimizing(true);
      const { optimizations, changes } = generateSmartOptimization();
      
      if (Object.keys(optimizations).length === 0) {
        setLastOptimization(t('optimization.alreadyOptimal'));
        return;
      }

      // יצירת נתונים אופטימליים נפרדים (לא משנה את הסימולציה המקורית)
      const optimizedDataCopy = { ...data };
      
      if (optimizations.poolTemperature !== undefined) {
        optimizedDataCopy.poolTemperature = optimizations.poolTemperature;
      }
      if (optimizations.chlorineLevel !== undefined) {
        optimizedDataCopy.chlorineLevel = optimizations.chlorineLevel;
      }
      if (optimizations.acidityLevel !== undefined) {
        optimizedDataCopy.acidityLevel = optimizations.acidityLevel;
      }
      if (optimizations.lightingStatus !== undefined) {
        optimizedDataCopy.lightingStatus = optimizations.lightingStatus;
        setLightingStatus(optimizations.lightingStatus);
      }
      if (optimizations.heaterStatus !== undefined) {
        optimizedDataCopy.heaterStatus = optimizations.heaterStatus;
        setHeaterStatus(optimizations.heaterStatus);
      }
      
      // שמירת הנתונים האופטימליים בנפרד
      setOptimizedData(optimizedDataCopy);
      setIsOptimized(true);
      
      const changesText = changes?.join(', ') || '';
      setLastOptimization(changesText);

      // ✅ Log optimization activity
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
        if (currentUser._id && currentUser.email && currentUser.poolId) {
          await logActivity(
            currentUser._id,
            currentUser.email,
            t('optimization.smartOptimizationPerformed'),
            "update",
            currentUser.poolId,
            `${t('optimization.smartOptimizationPerformed')}: ${changesText}`
          );
          console.log("✅ Activity logged: Smart optimization performed");
        }
      } catch (logError) {
        console.error("❌ Error logging optimization:", logError);
      }

      // רענון ההמלצות עם הנתונים האופטימליים
      generateRecommendations(optimizedDataCopy);
    } catch (error) {
      console.error("❌ שגיאה בעת ביצוע אופטימיזציה:", error);
    } finally {
      setOptimizing(false);
    }
  };

  const handleRefresh = async () => {
    try {
      if (!poolId) return;

      setLoading(true);
      await fetchSensorData();
      
      // איפוס האופטימיזציה
      setOptimizedData(null);
      setIsOptimized(false);
      setLastOptimization(t('optimization.dataRefreshed'));
      
      console.log("✅ Sensor data refreshed");
    } catch (error) {
      console.error("❌ Error refreshing sensor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp < 25) return { color: 'warning' as const, icon: <TrendingDown /> };
    if (temp > 30) return { color: 'error' as const, icon: <TrendingUp /> };
    return { color: 'success' as const, icon: <CheckCircle /> };
  };

  const getChlorineStatus = (chlorine: number) => {
    if (chlorine < 1) return { color: 'error' as const, icon: <Warning /> };
    if (chlorine > 3) return { color: 'warning' as const, icon: <Warning /> };
    return { color: 'success' as const, icon: <CheckCircle /> };
  };

  const getAcidityStatus = (acidity: number) => {
    if (acidity < 6.5 || acidity > 8) return { color: 'error' as const, icon: <Warning /> };
    return { color: 'success' as const, icon: <CheckCircle /> };
  };

  const getShowerStatus = (showerTemp: number) => {
    if (showerTemp > 45) return { color: 'error' as const, icon: <Warning /> };
    return { color: 'success' as const, icon: <CheckCircle /> };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!data) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {t('optimization.noDataFound')}
      </Alert>
    );
  }

  // בחירת הנתונים להצגה - אופטימליים או מקוריים
  const displayData = isOptimized && optimizedData ? optimizedData : data;
  
  const tempStatus = getTemperatureStatus(displayData.poolTemperature);
  const chlorineStatus = getChlorineStatus(displayData.chlorineLevel);
  const acidityStatus = getAcidityStatus(displayData.acidityLevel);
  const showerStatus = getShowerStatus(displayData.showerTemperature);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoFixHigh color="primary" />
        {t('optimization.poolOptimizationManager')}
      </Typography>

      {/* Sensor Selection */}
      {sensorData.length > 0 && (
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Pool color="primary" />
              {t('optimization.selectSensorData')}
            </Typography>
            
            <FormControl fullWidth>
              <InputLabel>{t('optimization.sensorSimulation')}</InputLabel>
              <Select
                value={selectedSensorId}
                onChange={(e) => {
                  const sensorId = e.target.value;
                  setSelectedSensorId(sensorId);
                  const selectedSensor = sensorData.find(s => s._id === sensorId);
                  if (selectedSensor) {
                    updateOptimizationData(selectedSensor);
                  }
                }}
                label={t('optimization.sensorSimulation')}
              >
                {sensorData.map((sensor) => (
                  <MenuItem key={sensor._id} value={sensor._id}>
                    {sensor.name} - {sensor.temperature}°C, {sensor.chlorine}ppm
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      )}

      {poolId && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('optimization.poolId')}: {poolId}
        </Alert>
      )}

      {isOptimized && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('optimization.showingOptimizedValues')}
        </Alert>
      )}

      {lastOptimization && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {t('optimization.lastOptimization')}: {lastOptimization}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        {/* Current Status Cards */}
        <Box>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info color="primary" />
                {t('optimization.currentStatus')}
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2 }}>
                <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Thermostat color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" color="primary">
                    {displayData.poolTemperature}°C
                  </Typography>
                  <Chip 
                    label={t('optimization.temperature')}
                    color={tempStatus.color}
                    icon={tempStatus.icon}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
                
                <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <WaterDrop color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" color="primary">
                    {displayData.chlorineLevel} ppm
                  </Typography>
                  <Chip 
                    label={t('optimization.chlorine')}
                    color={chlorineStatus.color}
                    icon={chlorineStatus.icon}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
                
                <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <WaterDrop color="info" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" color="info.main">
                    {displayData.acidityLevel} pH
                  </Typography>
                  <Chip 
                    label={t('optimization.acidity')}
                    color={acidityStatus.color}
                    icon={acidityStatus.icon}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
                
                <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Thermostat color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" color="secondary.main">
                    {displayData.showerTemperature}°C
                  </Typography>
                  <Chip 
                    label={t('optimization.shower')}
                    color={showerStatus.color}
                    icon={showerStatus.icon}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
                
                <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Lightbulb color={displayData.lightingStatus ? "warning" : "disabled"} sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" color={displayData.lightingStatus ? "warning.main" : "text.secondary"}>
                    {displayData.lightingStatus ? t('optimization.on') : t('optimization.off')}
                  </Typography>
                  <Chip 
                    label={t('optimization.lighting')}
                    color={displayData.lightingStatus ? "warning" : "default"}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Optimization Button */}
        <Box>
          <Card elevation={3} sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('optimization.actions')}
              </Typography>
              
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleOptimize}
                  disabled={optimizing}
                  startIcon={optimizing ? <CircularProgress size={20} /> : <AutoFixHigh />}
                  fullWidth
                >
                  {optimizing ? t('optimization.optimizing') : t('optimization.optimize')}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  startIcon={<Refresh />}
                  fullWidth
                >
                  {t('optimization.refresh')}
                </Button>
                
                {isOptimized && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setOptimizedData(null);
                      setIsOptimized(false);
                      setLastOptimization(null);
                    }}
                    fullWidth
                  >
                    {t('optimization.showOriginalData')}
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Recommendations */}
      <Box sx={{ mt: 3 }}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info color="info" />
              {t('optimization.recommendations')}
            </Typography>
            
            <List>
              {recommendations.map((rec, idx) => (
                <React.Fragment key={idx}>
                  <ListItem>
                    <ListItemText 
                      primary={rec}
                      primaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                  {idx < recommendations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default OptimizationManager;
