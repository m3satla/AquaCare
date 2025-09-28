import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  InputAdornment
} from '@mui/material';
import {
  Search,
  Filter,
  Download,
  Clear
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

interface ActionHistoryItem {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  user: string;
  category: string;
  status: 'completed' | 'pending' | 'failed';
}

const ActionHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const { t, tp, isRTL, direction, currentLanguage } = useTranslation();
  
  // Debug translations
  console.log("🔍 Current language:", currentLanguage);
  console.log("🔍 Translation function:", t);
  console.log("🔍 Test translation:", t('navigation.home'));
  const [actionHistory, setActionHistory] = useState<ActionHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ActionHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // React to language changes
  useEffect(() => {
    console.log("🔄 Language changed to:", currentLanguage);
    console.log("🔍 Translation test - title:", t('activityLog.activityLog'));
    console.log("🔍 Translation test - subtitle:", t('activityLog.activityDescription'));
    console.log("🔍 Translation test - export:", t('general.export'));
    console.log("🔍 Translation test - resultsFound:", tp('activityLog.filteredActivities', { count: 5 }));
    console.log("🔍 Translation test - userRegistered:", t('activityLog.userRegistered'));
    console.log("🔍 Translation test - optimizationPerformed:", t('activityLog.optimizationPerformed'));
    console.log("🔍 Translation test - remindersSent:", t('activityLog.remindersSent'));
    console.log("🔍 Translation test - response:", t('activityLog.response'));
    console.log("🔍 Translation test - login:", t('activityLog.login'));
    
    // Check if translations are loaded
    const title = t('activityLog.activityLog');
    if (title === 'activityLog.activityLog') {
      console.error("❌ Translation not loaded for activityLog.activityLog");
    }
    
    // Test simple keys
    console.log("🔍 Test simple key - navigation.home:", t('navigation.home'));
    console.log("🔍 Test simple key - buttons.submit:", t('buttons.submit'));
  }, [currentLanguage, t, tp]);

  // Update mock data when language changes
  const mockData = useMemo(() => {
    console.log("🔄 Updating mock data with language:", currentLanguage);
    return [
      {
        id: '1',
        action: t('activityLog.userRegistered') || 'User Registered',
        description: t('activityLog.userRegistered') || 'User Registered',
        timestamp: '2024-01-15T10:30:00Z',
        user: user?.email || t('general.unknownUser') || 'Unknown User',
        category: t('appointments.title') || 'Appointments',
        status: 'completed'
      },
      {
        id: '2',
        action: t('activityLog.optimizationPerformed') || 'Optimization Performed',
        description: t('activityLog.optimizationPerformed') || 'Optimization Performed',
        timestamp: '2024-01-15T09:15:00Z',
        user: user?.email || t('general.unknownUser') || 'Unknown User',
        category: t('general.actions') || 'Actions',
        status: 'completed'
      },
      {
        id: '3',
        action: t('activityLog.remindersSent') || 'Reminders Sent',
        description: t('activityLog.remindersSent') || 'Reminders Sent',
        timestamp: '2024-01-14T16:45:00Z',
        user: user?.email || t('general.unknownUser') || 'Unknown User',
        category: t('general.actions') || 'Actions',
        status: 'completed'
      },
      {
        id: '4',
        action: t('activityLog.response') || 'Response',
        description: t('activityLog.response') || 'Response',
        timestamp: '2024-01-14T14:20:00Z',
        user: user?.email || t('general.unknownUser') || 'Unknown User',
        category: t('general.actions') || 'Actions',
        status: 'completed'
      },
      {
        id: '5',
        action: t('activityLog.login') || 'Login',
        description: t('activityLog.login') || 'Login',
        timestamp: '2024-01-13T11:00:00Z',
        user: user?.email || t('general.unknownUser') || 'Unknown User',
        category: t('general.actions') || 'Actions',
        status: 'pending'
      }
    ];
  }, [t, user, currentLanguage]);

  useEffect(() => {
    setActionHistory(mockData);
    setFilteredHistory(mockData);
  }, [mockData]);

  // Filter logic
  useEffect(() => {
    let filtered = actionHistory;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      // Translate the category filter to match the translated categories
      if (categoryFilter === 'appointments') {
        const translatedCategory = t('appointments.title');
        filtered = filtered.filter(item => item.category === translatedCategory);
      } else if (categoryFilter === 'actions') {
        const translatedCategory = t('general.actions');
        filtered = filtered.filter(item => item.category === translatedCategory);
      }
    }

    if (statusFilter !== 'all') {
      // Translate the status filter to match the translated statuses
      const translatedStatus = t(`appointments.status.${statusFilter}`);
      filtered = filtered.filter(item => {
        const itemStatus = t(`appointments.status.${item.status}`);
        return itemStatus === translatedStatus;
      });
    }

    if (dateFilter) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
        return itemDate === dateFilter;
      });
    }

    setFilteredHistory(filtered);
  }, [actionHistory, searchTerm, categoryFilter, statusFilter, dateFilter, t]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setDateFilter('');
  };

  // Export to CSV
  const exportToCSV = useMemo(() => () => {
    const headers = [
      t('general.actions') || 'Actions',
      t('general.description') || 'Description',
      t('appointments.date') || 'Date',
      t('general.user') || 'User',
      t('general.category') || 'Category',
      t('appointments.status.completed') || 'Status'
    ];
    const csvContent = [
      headers.join(','),
      ...filteredHistory.map(item => [
        item.action,
        item.description,
        new Date(item.timestamp).toLocaleDateString(),
        item.user,
        item.category,
        t(`appointments.status.${item.status}`) || item.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `activity_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredHistory, t]);

  // Get status chip
  const getStatusChip = useMemo(() => (status: string) => {
    const statusConfig = {
      completed: { color: 'success' as const, label: t('appointments.status.completed') || 'Completed' },
      pending: { color: 'warning' as const, label: t('appointments.status.pending') || 'Pending' },
      cancelled: { color: 'error' as const, label: t('appointments.status.cancelled') || 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed;
    return <Chip label={config.label} color={config.color} size="small" />;
  }, [t]);

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h6" color="warning.main" align="center">
          {t('general.loginRequired') || 'You must be logged in to view this page'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Debug: Current language is {currentLanguage}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
              <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            {t('activityLog.activityLog') || 'Activity Log'}
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
          >
            {t('activityLog.activityDescription') || 'View activity history of all users in your pool'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Debug: Language: {currentLanguage} | Title: {t('activityLog.activityLog')} | Subtitle: {t('activityLog.activityDescription')}
          </Typography>
        </Box>

      {/* Export Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                  <Button 
            variant="contained" 
            startIcon={<Download />}
            onClick={exportToCSV}
            sx={{ minWidth: 150 }}
          >
            {t('general.export') || 'Export'}
          </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Filter sx={{ mr: 1 }} />
          <Typography variant="h6">
            {t('general.filter') || 'Filter'}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                      <TextField
              label={t('general.search') || 'Search'}
              placeholder={t('activityLog.searchPlaceholder') || 'Search by user, action or details...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />

                      <FormControl fullWidth>
              <InputLabel>{t('general.category') || 'Category'}</InputLabel>
              <Select
                value={categoryFilter}
                label={t('general.category') || 'Category'}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">{t('general.all') || 'All'}</MenuItem>
                <MenuItem value="appointments">{t('appointments.title') || 'Appointments'}</MenuItem>
                <MenuItem value="actions">{t('general.actions') || 'Actions'}</MenuItem>
              </Select>
            </FormControl>

                      <FormControl fullWidth>
              <InputLabel>{t('appointments.status.completed') || 'Status'}</InputLabel>
              <Select
                value={statusFilter}
                label={t('appointments.status.completed') || 'Status'}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">{t('general.all') || 'All'}</MenuItem>
                <MenuItem value="completed">{t('appointments.status.completed') || 'Completed'}</MenuItem>
                <MenuItem value="pending">{t('appointments.status.pending') || 'Pending'}</MenuItem>
                <MenuItem value="cancelled">{t('appointments.status.cancelled') || 'Cancelled'}</MenuItem>
              </Select>
            </FormControl>

                      <TextField
              label={t('appointments.date') || 'Date'}
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
        </Box>
      </Paper>

      {/* Results Summary */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="body1" color="text.secondary">
            {tp('activityLog.filteredActivities', { count: filteredHistory.length }) || `Found ${filteredHistory.length} activities`}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={clearFilters}
          >
            {t('activityLog.clearFilters') || 'Clear Filters'}
          </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                    {t('general.actions') || 'Actions'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {t('general.description') || 'Description'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {t('appointments.date') || 'Date'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {t('general.user') || 'User'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {t('general.category') || 'Category'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {t('appointments.status.completed') || 'Status'}
                  </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Typography variant="body1" color="text.secondary">
                    {t('activityLog.noResultsFound') || 'No results found'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.action}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{item.user}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    {getStatusChip(item.status)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ActionHistoryPage;
