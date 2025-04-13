import { AuthService } from "@/services/AuthService";

export function isAuthenticated(): boolean {
  return !!AuthService.getToken();
}
