'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="space-y-2">
              <h1 className="text-6xl font-bold text-destructive">!</h1>
              <h2 className="text-2xl font-semibold tracking-tight">
                Application Error
              </h2>
              <p className="text-muted-foreground">
                A critical error has occurred. Please refresh the page or contact support.
              </p>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-muted p-3 rounded-md text-left">
                <p className="text-sm font-mono text-muted-foreground break-all">
                  {error.message}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <button
                onClick={reset}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition-colors"
              >
                Go back home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
