"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Header = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <header className="sticky top-0 left-0 right-0 border-b border-border bg-background py-2 px-6 z-10">
      <div className="container flex items-center justify-end">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{user?.name}</span>
            <span className="text-xs bg-muted px-2 py-1 rounded">
              {user?.role}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
