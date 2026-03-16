import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'manager' | 'user';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    company: string;
    dealerId: string;
    role: UserRole;
    region: string;
    avatar?: string;
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isDemoMode: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    setUser: (user: AuthUser | null) => void;
}

interface RegisterData {
    email: string;
    password: string;
    name: string;
    company: string;
    dealerId: string;
    region: string;
}

// Demo users for testing without Supabase
const DEMO_USERS: Record<string, AuthUser & { password: string }> = {
    'admin@thitronik.de': {
        id: 'demo-admin-001',
        email: 'admin@thitronik.de',
        name: 'Anna Thitronik',
        company: 'THITRONIK GmbH',
        dealerId: 'TH-ADMIN',
        role: 'admin',
        region: 'DACH',
        password: 'admin',
    },
    'manager@autohaus.de': {
        id: 'demo-manager-001',
        email: 'manager@autohaus.de',
        name: 'Frank Weber',
        company: 'Caravan Center Kiel',
        dealerId: 'TH-DE-0312',
        role: 'manager',
        region: 'Deutschland Nord',
        password: 'manager',
    },
    'max@autohaus.de': {
        id: 'demo-user-001',
        email: 'max@autohaus.de',
        name: 'Max Mustermann',
        company: 'Autohaus Mustermann GmbH',
        dealerId: 'TH-DE-0849',
        role: 'user',
        region: 'Deutschland Nord',
        password: 'demo',
    },
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => {
            const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
            const defaultUser: AuthUser | null = null; // Don't force a user on load

            return {
                user: defaultUser,
                isAuthenticated: !!defaultUser, // Only authenticated if defaultUser is set (which is null in demo mode initially now)
                isLoading: false,
                isDemoMode: isDemo,

                login: async (email: string, password: string) => {
                    set({ isLoading: true });

                    // Demo mode: check against local demo users
                    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
                        await new Promise((r) => setTimeout(r, 800)); // Simulate network
                        const demoUser = DEMO_USERS[email.toLowerCase()];
                        if (demoUser && demoUser.password === password) {
                            const { password: _, ...user } = demoUser;
                            set({ user, isAuthenticated: true, isLoading: false });
                            return { success: true };
                        }
                        set({ isLoading: false });
                        return { success: false, error: 'Ungültige Zugangsdaten. Demo-Accounts: admin@thitronik.de / max@autohaus.de' };
                    }

                    // Real Supabase Auth
                    try {
                        const { createClient } = await import('@/lib/supabase/client');
                        const supabase = createClient();
                        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                        if (error) {
                            set({ isLoading: false });
                            return { success: false, error: error.message };
                        }
                        // Fetch user profile from custom users table
                        const { data: profile } = await supabase
                            .from('users')
                            .select('*')
                            .eq('auth_id', data.user.id)
                            .single();

                        const user: AuthUser = {
                            id: data.user.id,
                            email: data.user.email || email,
                            name: profile?.full_name || email.split('@')[0],
                            company: profile?.company || '',
                            dealerId: profile?.dealer_id || '',
                            role: profile?.role || 'user',
                            region: profile?.region || 'DACH',
                        };
                        set({ user, isAuthenticated: true, isLoading: false });
                        return { success: true };
                    } catch (err) {
                        set({ isLoading: false });
                        return { success: false, error: 'Verbindungsfehler. Bitte versuchen Sie es erneut.' };
                    }
                },

                register: async (data: RegisterData) => {
                    set({ isLoading: true });

                    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
                        await new Promise((r) => setTimeout(r, 1000));
                        const user: AuthUser = {
                            id: `demo-${Date.now()}`,
                            email: data.email,
                            name: data.name,
                            company: data.company,
                            dealerId: data.dealerId,
                            role: 'user',
                            region: data.region,
                        };
                        set({ user, isAuthenticated: true, isLoading: false });
                        return { success: true };
                    }

                    try {
                        const { createClient } = await import('@/lib/supabase/client');
                        const supabase = createClient();
                        const { error } = await supabase.auth.signUp({
                            email: data.email,
                            password: data.password,
                            options: { data: { full_name: data.name, company: data.company, dealer_id: data.dealerId, region: data.region } },
                        });
                        if (error) {
                            set({ isLoading: false });
                            return { success: false, error: error.message };
                        }
                        set({ isLoading: false });
                        return { success: true };
                    } catch {
                        set({ isLoading: false });
                        return { success: false, error: 'Registrierung fehlgeschlagen.' };
                    }
                },

                logout: () => {
                    set({ user: null, isAuthenticated: false });
                    if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
                        import('@/lib/supabase/client').then(({ createClient }) => {
                            createClient().auth.signOut();
                        });
                    }
                },

                setUser: (user) => set({ user, isAuthenticated: !!user }),
            };
        },
        { name: 'campus-auth', partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }) }
    )
);

// Role check helpers
export const isAdmin = (user: AuthUser | null) => user?.role === 'admin';
export const isManager = (user: AuthUser | null) => user?.role === 'manager' || user?.role === 'admin';
export const hasRole = (user: AuthUser | null, role: UserRole) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'manager' && role !== 'admin') return true;
    return user.role === role;
};
