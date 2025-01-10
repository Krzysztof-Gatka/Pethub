import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShelterLayout from '../../layouts/ShelterLayout';

interface Notification {
  id: number;
  type: string;
  description: string;
}

const NotificationList: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/notifications?userId=${user?.userId}`
      );
      console.log('Fetched notifications:', response.data);
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };
  

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
  };

  const handleDeleteNotification = async () => {
    if (!selectedNotification) return;

    try {
      await axios.delete('http://localhost:3000/api/notifications', {
        data: { notificationId: selectedNotification.id },
      });
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== selectedNotification.id)
      );
      setSelectedNotification(null);
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Styl obramowania w zależności od typu powiadomienia
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'adoption_approved':
        return { border: '2px solid green', backgroundColor: '#e8f5e9' };
      case 'walk_cancelled':
      case 'adoption_cancelled':
        return { border: '2px solid red', backgroundColor: '#ffebee' };
      default:
        return { border: '2px solid blue', backgroundColor: '#e3f2fd' };
    }
  };

  return (
    <ShelterLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          sx={{ mb: 4 }}
        >
          <NotificationsIcon fontSize="large" />
          <Typography variant="h4" gutterBottom>
            Powiadomienia
          </Typography>
        </Box>

        {/* Lista powiadomień */}
        <List>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              button
              onClick={() => handleNotificationClick(notification)}
              sx={{
                borderRadius: '8px',
                marginBottom: '8px',
                padding: '16px',
                ...getNotificationStyle(notification.type),
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {notification.type}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {notification.description}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Container>

      {/* Dialog usuwania powiadomienia */}
      <Dialog
        open={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
      >
        <DialogTitle>Usuń Powiadomienie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć to powiadomienie?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedNotification(null)}>Anuluj</Button>
          <Button color="error" onClick={handleDeleteNotification}>
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </ShelterLayout>
  );
};

export default NotificationList;
