

export interface User {
    email: string;
    name: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loginTime: string | null;
}

export interface AuthState {
    user: User | null;
    loginTime: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}