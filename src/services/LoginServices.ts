import type { Login } from "@/domain/entities/login/Login";
import { LoginRepository } from "@/domain/repositories/login/LoginRepository";
import { AuthService } from "./AuthService";
import { useUserStore } from "@/stores/User";

export class LoginService {
  private loginRepository = new LoginRepository();

  async logar(login: Login): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const data = await this.loginRepository.logar(login);
      const userStore = useUserStore();
      userStore.setUserAtual(data.nomeUser, data.email);
      const { token, refreshToken, expiration } = data;
      AuthService.login({ token, refreshToken, expiration });
      return { success: true, data };
    } catch {
      return { success: false, message: "Falha ao realizar o login, entre em contato!" };
    }
  }
}
