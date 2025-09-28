import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Snackbar,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Policy as PolicyIcon
} from '@mui/icons-material';
import { useTranslation } from '../hooks/useTranslation';

interface ConsentStatus {
  registration: {
    granted: boolean;
    timestamp?: string;
    version?: string;
    withdrawnAt?: string;
  };
  marketing: {
    granted: boolean;
    timestamp?: string;
    version?: string;
    withdrawnAt?: string;
  };
  analytics: {
    granted: boolean;
    timestamp?: string;
    version?: string;
    withdrawnAt?: string;
  };
  therapeutic: {
    granted: boolean;
    timestamp?: string;
    version?: string;
    withdrawnAt?: string;
  };
  data_sharing: {
    granted: boolean;
    timestamp?: string;
    version?: string;
    withdrawnAt?: string;
  };
}

interface ConsentManagerProps {
  userId: number;
  initialConsentStatus?: ConsentStatus;
  onConsentChange?: (consentType: string, granted: boolean) => void;
  showDetailsDialog?: boolean;
}

export const GDPRConsentManager: React.FC<ConsentManagerProps> = ({
  userId,
  initialConsentStatus,
  onConsentChange,
  showDetailsDialog = false
}) => {
  const { t } = useTranslation();
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>({
    registration: { granted: false },
    marketing: { granted: false },
    analytics: { granted: false },
    therapeutic: { granted: false },
    data_sharing: { granted: false }
  });
  
  const [detailsOpen, setDetailsOpen] = useState(showDetailsDialog);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const consentDefinitions = {
    registration: {
      title: 'gdpr.consent.registration.title',
      description: 'gdpr.consent.registration.description',
      purpose: 'gdpr.consent.registration.purpose',
      legalBasis: 'contract',
      required: true,
      icon: <SecurityIcon />
    },
    marketing: {
      title: 'gdpr.consent.marketing.title',
      description: 'gdpr.consent.marketing.description',
      purpose: 'gdpr.consent.marketing.purpose',
      legalBasis: 'consent',
      required: false,
      icon: <InfoIcon />
    },
    analytics: {
      title: 'gdpr.consent.analytics.title',
      description: 'gdpr.consent.analytics.description',
      purpose: 'gdpr.consent.analytics.purpose',
      legalBasis: 'legitimate_interests',
      required: false,
      icon: <InfoIcon />
    },
    therapeutic: {
      title: 'gdpr.consent.therapeutic.title',
      description: 'gdpr.consent.therapeutic.description',
      purpose: 'gdpr.consent.therapeutic.purpose',
      legalBasis: 'consent',
      required: false,
      icon: <PolicyIcon />
    },
    data_sharing: {
      title: 'gdpr.consent.sharing.title',
      description: 'gdpr.consent.sharing.description',
      purpose: 'gdpr.consent.sharing.purpose',
      legalBasis: 'consent',
      required: false,
      icon: <SecurityIcon />
    }
  };

  useEffect(() => {
    if (initialConsentStatus) {
      setConsentStatus(initialConsentStatus);
    } else {
      fetchConsentStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialConsentStatus]); // fetchConsentStatus not included to avoid infinite loop

  const fetchConsentStatus = async () => {
    try {
      const response = await fetch(`/api/gdpr/consent/${userId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setConsentStatus(data.consents);
      }
    } catch (error) {
      console.error('Failed to fetch consent status:', error);
    }
  };

  const handleConsentChange = async (consentType: string, granted: boolean) => {
    setLoading(true);
    
    try {
      const definition = consentDefinitions[consentType as keyof typeof consentDefinitions];
      
      if (granted) {
        // Record consent
        const response = await fetch('/api/gdpr/consent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            userId,
            consentType,
            purpose: t(definition.purpose),
            granted: true,
            legalBasis: definition.legalBasis
          })
        });

        if (!response.ok) {
          throw new Error('Failed to record consent');
        }
      } else {
        // Withdraw consent
        const response = await fetch('/api/gdpr/consent/withdraw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            userId,
            consentType
          })
        });

        if (!response.ok) {
          throw new Error('Failed to withdraw consent');
        }
      }

      // Update local state
      setConsentStatus(prev => ({
        ...prev,
        [consentType]: {
          ...prev[consentType as keyof ConsentStatus],
          granted,
          timestamp: granted ? new Date().toISOString() : prev[consentType as keyof ConsentStatus].timestamp,
          withdrawnAt: !granted ? new Date().toISOString() : undefined
        }
      }));

      setSnackbar({
        open: true,
        message: granted ? t('gdpr.consent.granted') : t('gdpr.consent.withdrawn'),
        severity: 'success'
      });

      onConsentChange?.(consentType, granted);

    } catch (error) {
      console.error('Error updating consent:', error);
      setSnackbar({
        open: true,
        message: t('gdpr.consent.error'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getLegalBasisText = (legalBasis: string) => {
    switch (legalBasis) {
      case 'consent': return t('gdpr.legal_basis.consent');
      case 'contract': return t('gdpr.legal_basis.contract');
      case 'legitimate_interests': return t('gdpr.legal_basis.legitimate_interests');
      case 'legal_obligation': return t('gdpr.legal_basis.legal_obligation');
      case 'vital_interests': return t('gdpr.legal_basis.vital_interests');
      case 'public_task': return t('gdpr.legal_basis.public_task');
      default: return legalBasis;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" gutterBottom>
              {t('gdpr.consent.title')}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setDetailsOpen(true)}
              startIcon={<InfoIcon />}
            >
              {t('gdpr.consent.details')}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={3}>
            {t('gdpr.consent.subtitle')}
          </Typography>

          {Object.entries(consentDefinitions).map(([key, definition]) => {
            const status = consentStatus[key as keyof ConsentStatus];
            
            return (
              <Box key={key} mb={2}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" flex={1}>
                    {definition.icon}
                    <Box ml={1} flex={1}>
                      <Typography variant="subtitle2">
                        {t(definition.title)}
                        {definition.required && (
                          <Chip
                            label={t('gdpr.consent.required')}
                            size="small"
                            color="error"
                            sx={{ ml: 1, height: 20 }}
                          />
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t(definition.description)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('gdpr.legal_basis.label')}: {getLegalBasisText(definition.legalBasis)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" alignItems="center">
                    {status.granted && status.timestamp && (
                      <Tooltip title={`${t('gdpr.consent.granted_at')}: ${formatDate(status.timestamp)}`}>
                        <Chip
                          label={t('gdpr.consent.active')}
                          color="success"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                      </Tooltip>
                    )}
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={status.granted}
                          onChange={(e) => handleConsentChange(key, e.target.checked)}
                          disabled={loading || (definition.required && status.granted)}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </Box>
                </Box>
              </Box>
            );
          })}
        </CardContent>
      </Card>

      {/* Detailed Consent Information Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {t('gdpr.consent.detailed_info')}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            {t('gdpr.consent.detailed_description')}
          </Alert>

          {Object.entries(consentDefinitions).map(([key, definition]) => {
            const status = consentStatus[key as keyof ConsentStatus];
            
            return (
              <Accordion key={key}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" width="100%">
                    {definition.icon}
                    <Box ml={1} flex={1}>
                      <Typography variant="subtitle1">
                        {t(definition.title)}
                      </Typography>
                    </Box>
                    <Chip
                      label={status.granted ? t('gdpr.consent.granted') : t('gdpr.consent.not_granted')}
                      color={status.granted ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Typography variant="body2" paragraph>
                      <strong>{t('gdpr.consent.purpose')}:</strong> {t(definition.purpose)}
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      <strong>{t('gdpr.legal_basis.label')}:</strong> {getLegalBasisText(definition.legalBasis)}
                    </Typography>

                    {status.timestamp && (
                      <Typography variant="body2" paragraph>
                        <strong>{t('gdpr.consent.granted_at')}:</strong> {formatDate(status.timestamp)}
                      </Typography>
                    )}

                    {status.withdrawnAt && (
                      <Typography variant="body2" paragraph>
                        <strong>{t('gdpr.consent.withdrawn_at')}:</strong> {formatDate(status.withdrawnAt)}
                      </Typography>
                    )}

                    <Typography variant="body2" color="text.secondary">
                      {t('gdpr.consent.withdrawal_note')}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>
            {t('buttons.close')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GDPRConsentManager; 