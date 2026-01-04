// Type declarations for path aliases
// This helps the TypeScript compiler recognize our @/* path aliases

declare module '@/*' {
  const value: any;
  export default value;
}

// Specific component declarations
declare module '@/components/HealthScoreCard' {
  import { ReactNode } from 'react';
  const HealthScoreCard: React.ComponentType<{ score: number; category: string }>;
  export default HealthScoreCard
}

declare module '@/components/AlertsPanel' {
  import { ReactNode } from 'react';
  const AlertsPanel: React.ComponentType<{ alerts: any[] }>;
  export default AlertsPanel;
}

// Context declarations
declare module '@/context/AuthContext' {
  export const useAuth: () => {
    user: any;
    loading: boolean;
    isAuthenticated: boolean;
    logout: () => void;
  };
}

// Utility declarations
declare module '@/utils/axiosClient' {
  const api: {
    get: (url: string) => Promise<any>;
    post: (url: string, data?: any) => Promise<any>;
    // Add other HTTP methods as needed
  };
  export default api;
}

// Generic wildcard declarations
declare module '@/components/*' {
  const value: any;
  export default value;
}

declare module '@/context/*' {
  const value: any;
  export default value;
}

declare module '@/utils/*' {
  const value: any;
  export default value;
}

declare module '@/hooks/*' {
  const value: any;
  export default value;
}

declare module '@/services/*' {
  const value: any;
  export default value;
}

declare module '@/styles/*' {
  const value: any;
  export default value;
}

declare module '@/data/*' {
  const value: any;
  export default value;
}