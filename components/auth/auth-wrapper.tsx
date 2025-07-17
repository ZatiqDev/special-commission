"use client";

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Login } from '@/components/auth/login';
import Index from '@/app/_components';

export const AuthWrapper = () => {
  const { user, isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-32 sm:w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return <Index />;
};
