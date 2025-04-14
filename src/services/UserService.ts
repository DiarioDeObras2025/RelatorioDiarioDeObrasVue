import type { User } from "@/domain/entities/user/User";
import { HttpStatusCodeEnum } from "@/domain/enums/HttpStatusCode.enum";
import { UserRepository } from "@/domain/repositories/user/UserRepository";
import { useEmpresaStore } from "@/stores/Empresa";

export class UserService {
  constructor(private userRepository = new UserRepository()) {}

  async criarUsuario(user: User): Promise<{ success: boolean; message?: string; data?: any }> {
    const empresaStore = useEmpresaStore();

    const registrationToken =
      empresaStore.empresaAtual?.registrationToken ??
      (() => {
        throw new Error("Token de registro não disponível.");
      })();

    try {
      const response = await this.userRepository.createUser(user, registrationToken!);

      if (response.status === HttpStatusCodeEnum.Ok) {
        return { success: true, data: response.data };
      }

      return { success: false, message: `Erro inesperado: código ${response.status}` };
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === HttpStatusCodeEnum.InternalServerError) {
        return { success: false, message: error.response.data.message };
      }

      return { success: false, message: "Erro de conexão ou inesperado" };
    }
  }
}
