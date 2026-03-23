"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations, useFormatter } from "next-intl";
import { useNotificationStore } from "@/store/notification-store";

export function NotificationDropdown() {
    const t = useTranslations("Notifications");
    const format = useFormatter();
    const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 outline-none">
                    <span className="text-lg">🔔</span>
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-red text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-brand-navy">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 mt-2 p-0">
                <div className="p-3 border-b text-sm font-bold bg-muted/50">
                    {t("header")}
                </div>
                <div className="max-h-[300px] overflow-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Keine Benachrichtigungen
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => markAsRead(n.id)}
                                className={`p-3 border-b hover:bg-muted/50 cursor-pointer transition-colors relative ${!n.read ? 'bg-white/5' : ''}`}
                            >
                                {!n.read && <div className="w-2 h-2 rounded-full bg-brand-red absolute top-4 left-2" />}
                                <div className="pl-3">
                                    <p className="text-sm font-medium">{t(n.titleKey)}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{t(n.descriptionKey)}</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        {format.relativeTime(new Date(n.timestamp))}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-2 text-center border-t">
                    <Button 
                        variant="ghost" 
                        onClick={() => markAllAsRead()}
                        disabled={unreadCount === 0}
                        className="w-full text-xs h-8 text-brand-sky"
                    >
                        {t("mark_all_read")}
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
