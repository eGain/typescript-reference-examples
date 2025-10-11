import { UserManager } from "oidc-client-ts";
import { authConfig } from "./authConfig";

/**
 * Simple Authentication Service
 * Handles OIDC authentication with minimal complexity
 */
class AuthService {
  constructor() {
    this.userManager = null;
  }

  /**
   * Initialize the authentication service
   */
  async initialize() {
    if (this.userManager) {
      return this.userManager;
    }

    try {
      this.userManager = new UserManager(authConfig);
      return this.userManager;
    } catch (error) {
      console.error("Failed to initialize auth service:", error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  async getUser() {
    if (!this.userManager) {
      throw new Error("Auth service not initialized");
    }
    return await this.userManager.getUser();
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    try {
      const user = await this.getUser();
      return user !== null && !user.expired;
    } catch {
      return false;
    }
  }

  /**
   * Start login process (redirects to IdP)
   */
  async login() {
    if (!this.userManager) {
      throw new Error("Auth service not initialized");
    }
    await this.userManager.signinRedirect();
  }

  /**
   * Handle redirect callback after login
   */
  async handleLoginCallback() {
    if (!this.userManager) {
      throw new Error("Auth service not initialized");
    }
    
    try {
      const user = await this.userManager.signinRedirectCallback();
      return user;
    } catch (error) {
      console.error("Login callback failed:", error);
      throw error;
    }
  }

  /**
   * Logout user (redirects to IdP end session endpoint)
   */
  async logout() {
    if (!this.userManager) {
      throw new Error("Auth service not initialized");
    }

    try {
      const user = await this.getUser();
      
      // Mark that logout is in progress
      sessionStorage.setItem("logout_in_progress", "true");
      
      // Redirect to IdP logout endpoint
      // This will call end_session_endpoint and redirect back
      await this.userManager.signoutRedirect({
        id_token_hint: user?.id_token,
      });
    } catch (error) {
      console.error("Logout failed:", error);
      sessionStorage.removeItem("logout_in_progress");
      // Fallback to local logout if redirect fails
      await this.userManager.removeUser();
    }
  }

  /**
   * Handle redirect callback after logout
   */
  async handleLogoutCallback() {
    if (!this.userManager) {
      throw new Error("Auth service not initialized");
    }
    
    try {
      // Clear the logout marker
      sessionStorage.removeItem("logout_in_progress");
      
      await this.userManager.signoutRedirectCallback();
      console.log("Logout callback handled successfully");
    } catch (error) {
      console.error("Logout callback failed:", error);
      sessionStorage.removeItem("logout_in_progress");
      // Clear local session anyway
      await this.userManager.removeUser();
    }
  }

  /**
   * Check if current URL is a login callback
   */
  isLoginCallback() {
    const params = new URLSearchParams(window.location.search);
    return params.has("code") && params.has("state");
  }

  /**
   * Check if current URL is a logout callback
   */
  isLogoutCallback() {
    // After logout, IdP redirects back - usually with no params or specific logout params
    // We'll detect this by checking if there's no login callback and user is logged out
    const params = new URLSearchParams(window.location.search);
    const hasLoginParams = params.has("code") && params.has("state");
    
    // Check if we have a logout state marker
    return !hasLoginParams && params.has("state") && sessionStorage.getItem("logout_in_progress") === "true";
  }

  /**
   * Get user info in a simple format
   */
  async getUserInfo() {
    const user = await this.getUser();
    if (!user) return null;

    return {
      id: user.profile?.sub,
      name: user.profile?.name,
      email: user.profile?.email,
      profile: user.profile,
    };
  }

  /**
   * Get access token
   */
  async getAccessToken() {
    const user = await this.getUser();
    return user?.access_token || null;
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
