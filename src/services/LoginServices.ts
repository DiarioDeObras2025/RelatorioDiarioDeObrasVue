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

  async enviarLinkRecuperacaoSenha(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.loginRepository.enviarLinkRecuperacaoSenha(email);
      return {
        success: true,
        message: response.data.message || "E-mail enviado com sucesso!",
      };
    } catch (error: any) {
      const message = error?.response?.data?.message || "Erro ao enviar e-mail de recuperação";
      return {
        success: false,
        message,
      };
    }
  }
  
}
