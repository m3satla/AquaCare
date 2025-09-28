import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Badge,
  Alert,
  CircularProgress,
  Grid
} from "@mui/material";
import {
  Send,
  Inbox,
  Delete,
  MarkEmailRead,
  PriorityHigh,
  Person
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import {
  Message,
  createMessage,
  getInboxMessages,
  getSentMessages,
  getMessageStats,
  markMessageAsRead,
  deleteMessage
} from "../services/api/messages";
import { getUsersByPool } from "../services/api/users";

const InternalMessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');

  const [composeForm, setComposeForm] = useState({
    receiverId: "",
    subject: "",
    content: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent"
  });

  useEffect(() => {
    if (user) {
      loadData();
      loadUsers();
    }
  }, [user, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'inbox') {
        const data = await getInboxMessages();
        setMessages(data.messages);
      } else {
        const data = await getSentMessages();
        setMessages(data.messages);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      if (user?.poolId) {
        const usersData = await getUsersByPool(user.poolId);
        setUsers(usersData || []);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const handleComposeMessage = async () => {
    try {
      await createMessage(composeForm);
      setComposeOpen(false);
      setComposeForm({ receiverId: "", subject: "", content: "", priority: "medium" });
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markMessageAsRead(messageId);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom color="primary">
        {t('internalMessages.title')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={() => setComposeOpen(true)}
          sx={{ mr: 2 }}
        >
          {t('internalMessages.compose')}
        </Button>
        <Button
          variant={activeTab === 'inbox' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('inbox')}
          sx={{ mr: 1 }}
        >
          {t('internalMessages.inbox')}
        </Button>
        <Button
          variant={activeTab === 'sent' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('sent')}
        >
          {t('internalMessages.sent')}
        </Button>
      </Box>

      <List>
        {messages.map((message) => (
          <Card key={message._id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar>
                  <Person />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">
                    {typeof message.senderId === 'object' 
                      ? `${message.senderId.firstName} ${message.senderId.lastName}`
                      : 'Unknown User'
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {message.subject}
                  </Typography>
                  <Typography variant="body2">
                    {message.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(message.createdAt).toLocaleString('he-IL')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {!message.isRead && activeTab === 'inbox' && (
                    <IconButton onClick={() => handleMarkAsRead(message._id)}>
                      <MarkEmailRead />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDeleteMessage(message._id)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </List>

      <Dialog open={composeOpen} onClose={() => setComposeOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('internalMessages.compose')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>{t('internalMessages.recipient')}</InputLabel>
              <Select
                value={composeForm.receiverId}
                onChange={(e) => setComposeForm({ ...composeForm, receiverId: e.target.value })}
                label={t('internalMessages.recipient')}
              >
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.firstName} {user.lastName} ({user.role})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={t('internalMessages.subject')}
              value={composeForm.subject}
              onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
              fullWidth
            />

            <TextField
              label={t('internalMessages.message')}
              value={composeForm.content}
              onChange={(e) => setComposeForm({ ...composeForm, content: e.target.value })}
              multiline
              rows={6}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComposeOpen(false)}>
            {t('buttons.cancel')}
          </Button>
          <Button onClick={handleComposeMessage} variant="contained">
            {t('buttons.send')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InternalMessagesPage;




