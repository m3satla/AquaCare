import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { t } from '../services/translation';

interface Instructor {
  id: number;
  name: string;
  poolNumber: number;
  schedule: string;
}

const InstructorSchedule: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      axios.get<Instructor[]>('http://localhost:5001/api/instructors')
      .then(res => {
        setInstructors(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading instructors:", err);
        setLoading(false);
      });
  }, []);

  // מקבץ מדריכים לפי בריכה
  const groupByPool = () => {
    const grouped: { [key: number]: Instructor[] } = {};
    instructors.forEach(inst => {
      if (!grouped[inst.poolNumber]) {
        grouped[inst.poolNumber] = [];
      }
      grouped[inst.poolNumber].push(inst);
    });
    return grouped;
  };

  const groupedInstructors = groupByPool();

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
      <Typography variant="h6" gutterBottom>{t('statistics.instructorSchedule')}</Typography>
      {loading ? (
        <p>{t('statistics.loadingData')}</p>
      ) : (
        Object.keys(groupedInstructors).map(pool => (
          <Box key={pool} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              {t('statistics.poolNumber')} {pool}
            </Typography>
            <List>
              {groupedInstructors[Number(pool)].map(inst => (
                <ListItem key={inst.id} disablePadding>
                  <ListItemText primary={`${inst.name} - ${t('statistics.hours')}: ${inst.schedule}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        ))
      )}
    </Paper>
  );
};

export default InstructorSchedule;
