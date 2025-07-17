"use client";

import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/auth-context';

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleGuard = ({ allowedRoles, children, fallback = null }: RoleGuardProps) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
