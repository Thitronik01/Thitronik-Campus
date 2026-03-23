import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppNotification } from '@/types/notification';

interface NotificationState {
    notifications: AppNotification[];
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set) => ({
            notifications: [
                {
                    id: "1",
                    type: "info",
                    titleKey: "title_new_seminar",
                    descriptionKey: "body_new_seminar",
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                    read: false,
                },
                {
                    id: "2",
                    type: "success",
                    titleKey: "title_cert_unlocked",
                    descriptionKey: "body_cert_unlocked",
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
                    read: true,
                }
            ],
            
            addNotification: (notification) => set((state) => ({
                notifications: [
                    {
                        ...notification,
                        id: crypto.randomUUID(),
                        timestamp: new Date(),
                        read: false,
                    },
                    ...state.notifications
                ]
            })),
            
            markAsRead: (id) => set((state) => ({
                notifications: state.notifications.map((n) => 
                    n.id === id ? { ...n, read: true } : n
                )
            })),
            
            markAllAsRead: () => set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, read: true }))
            })),
            
            removeNotification: (id) => set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id)
            })),
            
            clearAll: () => set({ notifications: [] })
        }),
        {
            name: 'thitronik-notifications',
            // Only persist 'notifications' array
            partialize: (state) => ({ notifications: state.notifications }),
            // Deserialize dates properly
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.notifications = state.notifications.map(n => ({
                        ...n,
                        timestamp: new Date(n.timestamp)
                    }));
                }
            }
        }
    )
);
