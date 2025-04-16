const apiUrl = `${import.meta.env.VITE_API_URL}`;
export class AuthService {
  private static TOKEN_KEY = "token";
  private static REFRESH_TOKEN_KEY = "refreshToken";
  private static EXPIRATION_KEY = "tokenExpiration";

  static login({
    token,
    refreshToken,
    expiration,
  }: {
    token: string;
    refreshToken: string;
    expiration: string;
  }) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.EXPIRATION_KEY, expiration);
  }

  static logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static isTokenExpired(): boolean {
    const expiration = localStorage.getItem(this.EXPIRATION_KEY);
    if (!expiration) return true;

    const expirationDate = new Date(expiration);
    const now = new Date();

    return now >= expirationDate;
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  static async refreshToken(): Promise<{
    token: string;
    refreshToken: string;
    expiration: string;
  }> {
    const accessToken = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new Error("Tokens ausentes");
    }

    const response = await fetch(`${apiUrl}/Auth/refresh-token`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken, refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Falha ao renovar token");
    }

    const data = await response.json();

    return {
      token: data.accessToken,
      refreshToken: data.refreshToken,
      expiration: this.getNewExpiration(), // Gera uma data de expiração estimada
    };
  }

  static getNewExpiration(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // ou o tempo que seu backend usa
    return now.toISOString();
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // (opcional) método futuro pra fazer refreshToken
  // static async refreshToken(): Promise<void> {
  //   const refresh = localStorage.getItem(this.REFRESH_TOKEN_KEY);
  //   // fazer chamada para API /auth/refresh
  // }
}
