import { createContext, useContext, useState } from 'react';
import type { FC, PropsWithChildren } from 'react';

export interface AuthUser {
  name: string;
  email: string;
  avatar: string;
}

interface IAuthContext {
  user: AuthUser | null;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
  isSignInOpen: boolean;
  signInRedirect: string | null;
  openSignIn: (redirectPath?: string) => void;
  closeSignIn: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuthContext = (): IAuthContext => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [signInRedirect, setSignInRedirect] = useState<string | null>(null);

  const signIn = (u: AuthUser) => setUser(u);
  const signOut = () => setUser(null);
  const openSignIn = (redirectPath?: string) => {
    setSignInRedirect(redirectPath ?? null);
    setIsSignInOpen(true);
  };
  const closeSignIn = () => {
    setIsSignInOpen(false);
    setSignInRedirect(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isSignInOpen, signInRedirect, openSignIn, closeSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
