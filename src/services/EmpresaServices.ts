import type { Empresa } from "@/domain/entities/empresa/Empresa";
import { HttpStatusCodeEnum } from "@/domain/enums/HttpStatusCode.enum";
import { EmpresaRepository } from "@/domain/repositories/empresa/EmpresaRepository";

export class EmpresaService {
  private empresaRepository = new EmpresaRepository();

  async createEmpresa(
    empresa: Empresa,
  ): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const response = await this.empresaRepository.createEmpresa(empresa);

      if (response.status === HttpStatusCodeEnum.Ok) {
        return { success: true, data: response.data };
      }

      return { success: false, message: `Erro inesperado: código ${response.status}` };
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === HttpStatusCodeEnum.Unauthorized) {
        return { success: false, message: "Usuário ou senha inválidos" };
      }

      if (status === HttpStatusCodeEnum.InternalServerError) {
        return { success: false, message: "Erro interno no servidor" };
      }

      return { success: false, message: "Erro de conexão ou inesperado" };
    }
  }
}
