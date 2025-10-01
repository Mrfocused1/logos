export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
}

export class AuthService {
  private static readonly TOKEN_KEY = 'admin_token';
  private static readonly USER_KEY = 'admin_user';

  /**
   * Validate admin credentials
   */
  static async validateCredentials(credentials: LoginCredentials): Promise<AuthResponse> {
    const { username, password } = credentials;

    // Get credentials from environment variables
    const validUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Validate credentials
    if (username.trim() === validUsername && password === validPassword) {
      return { success: true };
    } else {
      return { success: false, error: 'Invalid username or password' };
    }
  }

  /**
   * Generate a simple token
   */
  static generateToken(username: string): string {
    const tokenData = {
      userId: 'admin_1',
      username,
      role: 'admin',
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    // Create a simple base64 encoded token (not secure, but sufficient for demo)
    return btoa(JSON.stringify({ header: 'fake' })) + '.' +
           btoa(JSON.stringify(tokenData)) + '.' +
           btoa(JSON.stringify({ signature: 'fake' }));
  }

  /**
   * Store authentication data
   */
  static storeAuthData(token: string, userData: any): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  /**
   * Clear authentication data
   */
  static clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Get stored token
   */
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored user data
   */
  static getUser(): any | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Check if token is valid and not expired
   */
  static isTokenValid(): boolean {
    try {
      const token = this.getToken();
      if (!token) return false;

      const tokenData = JSON.parse(atob(token.split('.')[1]));
      return tokenData.exp > Date.now();
    } catch {
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.isTokenValid() && this.getUser() !== null;
  }
}