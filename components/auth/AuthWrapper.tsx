"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Login } from '@/components/auth/Login';
import Index from '@/app/_components';

export const AuthWrapper = () => {
  const { user, isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return <Index />;
};
