export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'system';
  titleKey: string;
  descriptionKey: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}
