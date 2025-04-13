import type { RegistroDiario } from "@/domain/entities/registro-diario/RegistroDiario";
import { HttpStatusCodeEnum } from "@/domain/enums/HttpStatusCode.enum";
import { RegistroDiarioRepository } from "@/domain/repositories/registro-diario/RegistroDiarioRepository";

export class RegistroDiarioService {
  constructor(private registroDiarioRepository = new RegistroDiarioRepository()) {}

  async criarRelatorio(
    registroDiario: RegistroDiario,
  ): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const response = await this.registroDiarioRepository.create(registroDiario);

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
