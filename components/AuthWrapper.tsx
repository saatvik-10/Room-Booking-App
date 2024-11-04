'use client';

import { AuthProvider } from '@/context/authContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthProviderProps) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthWrapper;
