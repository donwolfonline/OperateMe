import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';

interface Notification {
  type: 'NEW_DRIVER' | 'NEW_ORDER' | 'NEW_PDF' | 'VEHICLE_REGISTERED' | 'CONNECTION_STATUS';
  message: string;
  timestamp: Date;
  data?: any;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;

    const connectWebSocket = () => {
      if (!user || user.role !== 'admin') return;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/notifications/ws`;

      try {
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('WebSocket Connected');
          setIsConnected(true);
        };

        socket.onclose = () => {
          console.log('WebSocket Disconnected');
          setIsConnected(false);

          // Attempt to reconnect after 5 seconds
          if (reconnectTimer) clearTimeout(reconnectTimer);
          reconnectTimer = setTimeout(connectWebSocket, 5000);
        };

        socket.onmessage = (event) => {
          try {
            const notification: Notification = JSON.parse(event.data);

            if (notification.type === 'CONNECTION_STATUS') {
              toast({
                title: 'Notification Service',
                description: notification.message,
              });
              return;
            }

            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(count => count + 1);

            toast({
              title: notification.type.split('_').join(' ').toLowerCase(),
              description: notification.message,
            });
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
          toast({
            title: 'Connection Error',
            description: 'Failed to connect to notification service',
            variant: 'destructive',
          });
        };
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [user, toast]);

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleNotifications}
        className="relative"
      >
        <Bell className={`h-5 w-5 ${isConnected ? 'text-primary' : 'text-muted-foreground'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-background border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearNotifications}
              >
                Clear all
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">
                        {notification.type.split('_').join(' ').toLowerCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(notification.timestamp), 'HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}