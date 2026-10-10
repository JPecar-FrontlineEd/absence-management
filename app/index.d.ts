interface AuthStore {
  signinRedirect: (options: any) => void;
  authCallback: (location: string) => Promise<any>;
  signoutRedirect: () => void;
  getAccountSettingsUrl: (returnUrl: string, supportImpersonation: boolean) => string;
  getToken: () => string;
  getUser: () => Promise<any>;
}

interface UserStore {
  isAuthenticated: boolean;
  userContext: {
    user: any;
  }
}


export function initializeApplication(authStore: AuthStore, userStore: UserStore): Promise<void>;

