import { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { toast } from 'sonner';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  priority: 'normale' | 'haute' | 'critique';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export const useNotifications = () => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Afficher un toast selon la priorité
      if (notification.priority === 'critique') {
        toast.error(notification.title, { description: notification.message });
      } else if (notification.priority === 'haute') {
        toast.warning(notification.title, { description: notification.message });
      } else {
        toast.info(notification.title, { description: notification.message });
      }
    };

    socket.on('notification', handleNotification);
    socket.on('alert', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
      socket.off('alert', handleNotification);
    };
  }, [socket]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead };
};
