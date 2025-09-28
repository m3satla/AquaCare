import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';
import axios from 'axios';

interface Action {
  id: number;
  description: string;
  timestamp: string;
}

const ActionHistory: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
          axios.get('http://localhost:5001/api/actions')
      .then(response => {
        setActions(response.data as Action[]); // ✅ תיקון טיפוס
        setLoading(false);
      })
      .catch(error => {
        console.error(t('actionHistory.errorLoadingHistory'), error);
        setLoading(false);
      });
  }, [t]);

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
      <Typography variant="h6" gutterBottom>{t('actionHistory.title')}</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {actions.map(action => (
            <ListItem key={action.id} disablePadding>
              <ListItemText
                primary={action.description}
                secondary={new Date(action.timestamp).toLocaleString(isRTL ? 'he-IL' : 'en-US')}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default ActionHistory;
