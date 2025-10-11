import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import authService from './authService';

const AuthContext = createContext();

/**
 * Authentication Context Provider
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  /**
   * Initialize authentication
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        await authService.initialize();

        // Handle logout callback first
        if (authService.isLogoutCallback()) {
          console.log('Handling logout callback...');
          await authService.handleLogoutCallback();
          setUser(null);
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        // Handle login callback
        else if (authService.isLoginCallback()) {
          console.log('Handling login callback...');
          const user = await authService.handleLoginCallback();
          setUser(user);
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          // Check for existing session
          const user = await authService.getUser();
          if (user && !user.expired) {
            setUser(user);
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Update derived state when user changes
   */
  useEffect(() => {
    if (user) {
      // Extract user info
      const info = {
        id: user.profile?.sub,
        name: user.profile?.name,
        email: user.profile?.email,
        profile: user.profile,
      };
      setUserInfo(info);
      setAccessToken(user.access_token || null);
    } else {
      setUserInfo(null);
      setAccessToken(null);
    }
  }, [user]);

  /**
   * Login
   */
  const login = useCallback(async () => {
    try {
      setError(null);
      await authService.login();
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message);
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setError(error.message);
      // Clear user anyway
      setUser(null);
    }
  }, []);

  /**
   * Get user info
   */
  const getUserInfo = useCallback(async () => {
    return await authService.getUserInfo();
  }, []);

  /**
   * Get access token
   */
  const getAccessToken = useCallback(async () => {
    return await authService.getAccessToken();
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: user !== null && !user?.expired,
    isLoading,
    error,
    login,
    logout,
    getUserInfo,
    getAccessToken,
    clearError,
    userInfo,
    accessToken,
  }), [user, isLoading, error, login, logout, getUserInfo, getAccessToken, clearError, userInfo, accessToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 * Provides a clean interface for auth-related functionality
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Return context with computed properties
  return {
    // State
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    error: context.error,
    
    // Actions
    login: context.login,
    logout: context.logout,
    clearError: context.clearError,
    
    // Data (async functions)
    getUserInfo: context.getUserInfo,
    getAccessToken: context.getAccessToken,
    
    // Computed properties (direct values)
    userInfo: context.userInfo,
    accessToken: context.accessToken,
    isLoggedIn: context.isAuthenticated && !context.isLoading
  };
};

export default AuthContext;
