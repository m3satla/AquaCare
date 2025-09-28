import React, { useEffect, useState } from 'react';
import {
  Paper, 
  Typography, 
  Box, 
  Chip, 
  CircularProgress, 
  Button,
  Card,
  CardContent,
  Alert,
  Stack,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Save,
  Refresh,
  Settings,
  Water,
  Shower,
  HotTub,
  Accessibility,
  Lightbulb,
  MusicNote,
  Thermostat,
  Warning
} from '@mui/icons-material';
import { getFacilityStatus, updateFacilityStatus, logActivity } from '../services/api';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../context/AuthContext';

interface FacilityData {
  waterJetsOn: boolean;
  hotShowersOn: boolean;
  jacuzziOn: boolean;
  liftActive: boolean;
  softLightingOn: boolean;
  calmingMusicOn: boolean;
  temperaturePanelOn: boolean;
  antiSlipFloorOn: boolean;
}

const FacilityStatus: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [facilities, setFacilities] = useState<FacilityData | null>(null);
  const [originalFacilities, setOriginalFacilities] = useState<FacilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSave, setLastSave] = useState<string | null>(null);

  // בדיקת הרשאות מנהל
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  // שלוף poolId מהמשתמש המחובר
  const getPoolId = () => {
    const stored = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (!stored) return null;
    const user = JSON.parse(stored);
    return user?.poolId || null;
  };

  const poolId = getPoolId();

  // שליפת סטטוס מהשרת
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (!poolId) throw new Error("אין poolId");
        const status = await getFacilityStatus(poolId);
        setFacilities(status);
        setOriginalFacilities(status);
      } catch (err) {
        console.error(t('facilityStatus.errorLoadingStatus'), err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [poolId]);

  // שינוי סטטוס מקומי
  const toggleStatus = async (key: keyof FacilityData, facilityName: string) => {
    if (!facilities || !isAdmin) return;
    
    const newStatus = !facilities[key];
    setFacilities((prev: FacilityData | null) => prev ? ({
      ...prev,
      [key]: newStatus
    }) : null);

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
      if (currentUser._id && currentUser.email && currentUser.poolId) {
        await logActivity(
          currentUser._id,
          currentUser.email,
          `${newStatus ? t('facility.activated') : t('facility.deactivated')} ${facilityName}`,
          "update",
          currentUser.poolId,
          `${t('facility.facility')} ${facilityName} ${newStatus ? t('facility.activated') : t('facility.deactivated')}`
        );
        console.log(`✅ Activity logged: ${facilityName} ${newStatus ? 'activated' : 'deactivated'}`);
      }
    } catch (logError) {
      console.error("❌ Error logging facility change:", logError);
    }
  };

  // שמירת שינויים לשרת
  const saveChanges = async () => {
    if (!isAdmin) return;
    
    try {
      setSaving(true);
      await updateFacilityStatus(poolId, facilities);
      setOriginalFacilities(facilities);
      setLastSave(t('facility.changesSaved'));
      console.log("✅ סטטוס נשמר בהצלחה");

      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
        if (currentUser._id && currentUser.email && currentUser.poolId) {
          await logActivity(
            currentUser._id,
            currentUser.email,
            t('facility.savingChanges'),
            "update",
            currentUser.poolId,
            t('facility.changesSavedSuccessfully')
          );
        }
      } catch (logError) {
        console.error("❌ Error logging facility save:", logError);
      }
    } catch (err) {
      console.error("❌ שגיאה בשמירת סטטוס:", err);
    } finally {
      setSaving(false);
    }
  };

  const facilityConfig = [
    {
      key: 'waterJetsOn' as keyof FacilityData,
      name: t('facility.waterJets'),
      icon: <Water />,
      description: t('facility.waterJetsDesc')
    },
    {
      key: 'hotShowersOn' as keyof FacilityData,
      name: t('facility.hotShowers'),
      icon: <Shower />,
      description: t('facility.hotShowersDesc')
    },
    {
      key: 'jacuzziOn' as keyof FacilityData,
      name: t('facility.jacuzzi'),
      icon: <HotTub />,
      description: t('facility.jacuzziDesc')
    },
    {
      key: 'liftActive' as keyof FacilityData,
      name: t('facility.waterLift'),
      icon: <Accessibility />,
      description: t('facility.waterLiftDesc')
    },
    {
      key: 'softLightingOn' as keyof FacilityData,
      name: t('facility.softLighting'),
      icon: <Lightbulb />,
      description: t('facility.softLightingDesc')
    },
    {
      key: 'calmingMusicOn' as keyof FacilityData,
      name: t('facility.calmingMusic'),
      icon: <MusicNote />,
      description: t('facility.calmingMusicDesc')
    },
    {
      key: 'temperaturePanelOn' as keyof FacilityData,
      name: t('facility.temperaturePanel'),
      icon: <Thermostat />,
      description: t('facility.temperaturePanelDesc')
    },
    {
      key: 'antiSlipFloorOn' as keyof FacilityData,
      name: t('facility.antiSlipFloor'),
      icon: <Settings />,
      description: t('facility.antiSlipFloorDesc')
    }
  ];

  const hasChanges = JSON.stringify(facilities) !== JSON.stringify(originalFacilities);

  // בדיקת הרשאות - אם לא מנהל, הצג הודעת שגיאה
  if (!isAdmin) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {t('facility.adminOnly', 'רק מנהלים יכולים לגשת לדף זה')}
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!facilities) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {t('facility.noStatusFound')}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Settings color="primary" />
        {t('facility.title')} - {t('facility.adminOnly', 'ניהול מנהל')}
      </Typography>

      {lastSave && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {lastSave}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Facility Status Cards */}
        <Box sx={{ flex: { md: 2 } }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                {t('facility.currentStatus')}
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2 
              }}>
                {facilityConfig.map((facility) => (
                    <Card 
                    key={facility.key}
                      variant="outlined" 
                      sx={{ 
                      cursor: isAdmin ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                        transform: isAdmin ? 'translateY(-2px)' : 'none',
                        boxShadow: isAdmin ? 2 : 1
                        }
                      }}
                    onClick={() => isAdmin && toggleStatus(facility.key, facility.name)}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Box sx={{ mb: 1 }}>
                          {React.cloneElement(facility.icon, { 
                            color: facilities[facility.key] ? "primary" : "disabled",
                            sx: { fontSize: 40 }
                          })}
                        </Box>
                        
                        <Typography variant="h6" gutterBottom>
                          {facility.name}
                        </Typography>
                        
                        <Chip
                          icon={facilities[facility.key] ? <CheckCircle /> : <Cancel />}
                          label={facilities[facility.key] ? t('facility.active') : t('facility.inactive')}
                          color={facilities[facility.key] ? 'success' : 'error'}
                          variant="outlined"
                          size="small"
                        />
                        
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          {facility.description}
                        </Typography>
                      </CardContent>
                    </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Actions Panel */}
        <Box sx={{ flex: { md: 1 } }}>
          <Card elevation={3} sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('facility.actions')}
              </Typography>
              
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={saveChanges}
                  disabled={!hasChanges || saving || !isAdmin}
                  startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                  fullWidth
                >
                  {saving ? t('facility.saving') : t('facility.saveChanges')}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => window.location.reload()}
                  startIcon={<Refresh />}
                  fullWidth
                >
                  {t('buttons.refresh')}
                </Button>
              </Stack>

              {hasChanges && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {t('facility.unsavedChanges')}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default FacilityStatus;
