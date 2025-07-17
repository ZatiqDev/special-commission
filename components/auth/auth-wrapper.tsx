"use client";

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import Index from '@/app/_components';
import { LoginPage } from './login-page';

export const AuthWrapper = () => {
  const { user, isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-16 sm:w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  return <Index />;
};
