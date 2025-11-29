"use client";

import React, { useState, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Info, Trophy, BookOpen } from "lucide-react";
import { Button } from "../../../@/components/ui/button";
import { Card, CardContent } from "../../../@/components/ui/card";
import { ScrollArea } from "../../../@/components/ui/scroll-area";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications (in a real app, these would come from an API)
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: "achievement",
        title: "New Achievement Unlocked!",
        message: "You've earned the 'First Steps' achievement",
        time: "2 minutes ago",
        read: false,
        icon: <Trophy className="h-5 w-5 text-amber-500" />
      },
      {
        id: 2,
        type: "course",
        title: "Course Progress",
        message: "You're 50% through JavaScript Basics",
        time: "1 hour ago",
        read: false,
        icon: <BookOpen className="h-5 w-5 text-blue-500" />
      },
      {
        id: 3,
        type: "streak",
        title: "Keep It Up!",
        message: "You've maintained your learning streak for 5 days",
        time: "1 day ago",
        read: true,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      },
      {
        id: 4,
        type: "reminder",
        title: "Don't Forget!",
        message: "Your React Fundamentals course awaits",
        time: "2 days ago",
        read: true,
        icon: <AlertCircle className="h-5 w-5 text-red-500" />
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    setUnreadCount(notifications.filter(n => !n.read && n.id !== id).length);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => 
      ({ ...notification, read: true })
    ));
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full relative hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all as read
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-80">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Info className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No notifications</p>
                </div>
              ) : (
                <ul>
                  {notifications.map((notification) => (
                    <li 
                      key={notification.id} 
                      className={`border-b last:border-b-0 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            {notification.icon}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{notification.title}</p>
                              {!notification.read && (
                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 ml-2"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
            
            {notifications.length > 0 && (
              <div className="p-2 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={clearAll}
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationBell;