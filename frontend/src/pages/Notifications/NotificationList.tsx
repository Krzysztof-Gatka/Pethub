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
} from '@mui/material';
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
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleTestNotification = async () => {
    try {
      await axios.get(
        `http://localhost:3000/api/notifications/test-notifications?userId=${user?.userId}`
      );
      fetchNotifications();
    } catch (err) {
      console.error('Error triggering test notification:', err);
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

  return (
    <ShelterLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Powiadomienia
        </Typography>

  
        {/* Lista powiadomień */}
        <List sx={{ mt: 3 }}>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              button
              onClick={() => handleNotificationClick(notification)}
              sx={{
                border: '1px solid #ccc',
                borderRadius: '4px',
                marginBottom: '8px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <ListItemText
                primary={<Typography variant="h6">{notification.type}</Typography>}
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
