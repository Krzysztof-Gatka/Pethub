import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import ShelterLayout from '../../layouts/ShelterLayout';

interface ShelterNotification {
  id: number;
  type: 'new_walk' | 'walk_cancelled' | 'adoption_request' | 'adoption_cancelled' | 
        'adoption_approved' | 'adoption_rejected' | 'daily_reminder' | 'adoption_status' | 'general';
  description: string;
  date: string;
  status: number;
  target_id: number | null;
}

const ShelterNotificationList: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<ShelterNotification[]>([]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/notifications?userId=${user?.userId}&ownerType=shelter`
      );
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleNotificationClick = async (notification: ShelterNotification) => {
    try {
      // Oznacz jako przeczytane
      if (notification.status === 0) {
        await axios.post('http://localhost:3000/api/notifications/read', {
          notificationId: notification.id,
        });
        
        // Aktualizuj stan lokalnie
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? {...n, status: 1} : n)
        );
      }

      // Przekieruj w zależności od typu
      if (notification.target_id) {
        switch (notification.type) {
          case 'adoption_request':
            window.location.href = `/adoptions/${notification.target_id}`;
            break;
          case 'new_walk':
            window.location.href = `/walks/${notification.target_id}`;
            break;
        }
      }
    } catch (err) {
      console.error('Error handling notification click:', err);
    }
  };

  const handleDeleteNotification = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Zapobiega wywołaniu handleNotificationClick
    try {
      await axios.delete('http://localhost:3000/api/notifications', {
        data: { notificationId: id },
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchNotifications();
    }
  }, [user]);

  const getNotificationStyle = (type: string, status: number) => {
    const baseStyle = {
      borderRadius: '8px',
      marginBottom: '8px',
      padding: '16px',
      cursor: 'pointer',
      opacity: status === 1 ? 0.7 : 1,
    };

    switch (type) {
      case 'adoption_request':
        return { ...baseStyle, border: '2px solid #2196f3', backgroundColor: '#e3f2fd' };
      case 'new_walk':
        return { ...baseStyle, border: '2px solid #4caf50', backgroundColor: '#e8f5e9' };
      case 'walk_cancelled':
      case 'adoption_cancelled':
        return { ...baseStyle, border: '2px solid #f44336', backgroundColor: '#ffebee' };
      default:
        return { ...baseStyle, border: '2px solid #9e9e9e', backgroundColor: '#f5f5f5' };
    }
  };

  const getNotificationTitle = (type: string): string => {
    switch (type) {
      case 'adoption_request':
        return 'Nowa prośba o adopcję';
      case 'new_walk':
        return 'Nowy spacer';
      case 'walk_cancelled':
        return 'Spacer anulowany';
      case 'adoption_cancelled':
        return 'Adopcja anulowana';
      case 'adoption_approved':
        return 'Adopcja zatwierdzona';
      case 'adoption_rejected':
        return 'Adopcja odrzucona';
      default:
        return 'Powiadomienie';
    }
  };

  const unreadCount = notifications.filter(n => n.status === 0).length;

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
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon fontSize="large" />
          </Badge>
          <Typography variant="h4">
            Powiadomienia
          </Typography>
        </Box>

        <List>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={getNotificationStyle(notification.type, notification.status)}
            >
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: notification.status === 0 ? 'bold' : 'normal' }}>
                      {getNotificationTitle(notification.type)}
                    </Typography>
                    <IconButton
                      onClick={(e) => handleDeleteNotification(notification.id, e)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body1" color="textPrimary" sx={{ my: 1 }}>
                      {notification.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(notification.date).toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
          {notifications.length === 0 && (
            <Typography variant="body1" textAlign="center" color="textSecondary">
              Brak powiadomień
            </Typography>
          )}
        </List>
      </Container>
    </ShelterLayout>
  );
};

export default ShelterNotificationList;