import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { enqueueAction } from '@/lib/offline-queue';

interface UserState {
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'user';
    level: number;
    levelName: string;
    xp: number;
    xpToNext: number;
    isAuthenticated: boolean;
    login: (email: string) => void;
    logout: () => void;
    addXp: (amount: number) => void;
}

const LEVELS = [
    { name: 'Matrose', min: 0 },
    { name: 'Steuermann', min: 200 },
    { name: 'Kapitän', min: 700 },
    { name: 'Kommandant', min: 1500 },
    { name: 'Flottenkapitän', min: 3000 },
    { name: 'Kommodore', min: 5000 },
    { name: 'Admiral', min: 8000 },
];

function getLevel(xp: number) {
    let lvl = 0;
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (xp >= LEVELS[i].min) { lvl = i; break; }
    }
    return {
        level: lvl + 1,
        levelName: LEVELS[lvl].name,
        xpToNext: lvl < LEVELS.length - 1 ? LEVELS[lvl + 1].min : LEVELS[lvl].min,
    };
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            name: 'Max Mustermann',
            email: 'm.mustermann@autohaus.de',
            role: 'user',
            level: 2,
            levelName: 'Steuermann',
            xp: 300,
            xpToNext: 700,
            isAuthenticated: false,

            login: (email: string) =>
                set({ isAuthenticated: true, email, name: email.split('@')[0] }),

            logout: () =>
                set({ isAuthenticated: false }),

            addXp: (amount: number) =>
                set((state) => {
                    const newXp = state.xp + amount;
                    const { level, levelName, xpToNext } = getLevel(newXp);

                    // Event für Offline-Synchronisierung eintragen
                    enqueueAction('ADD_XP', { amount, previousXp: state.xp, newXp, timestamp: Date.now() });

                    return { xp: newXp, level, levelName, xpToNext };
                }),
        }),
        {
            name: 'thitronik-user-storage',
            skipHydration: true,
        }
    )
);
