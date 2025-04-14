import api from "@/config/axios";
import type { RegistroDiario } from "@/domain/entities/registro-diario/RegistroDiario";
import type { IRegistroDiarioRepository } from "@/domain/interface/registro-diario/IRegistroDiarioRepository";
import { handleApiResponse } from "@/utils/api";

const apiUrl = "https://localhost:7159/RegistroDiario";

export class RegistroDiarioRepository implements IRegistroDiarioRepository {
  async getAll(): Promise<RegistroDiario[]> {
    return await handleApiResponse<RegistroDiario[]>(api.get(apiUrl));
  }

  async getById(idRegistro: number): Promise<RegistroDiario> {
    const data = await handleApiResponse<RegistroDiario>(api.get(`${apiUrl}/${idRegistro}`));

    return data;
  }

  async getRelatorioFromObraid(idObra: number): Promise<RegistroDiario[]> {
    return await handleApiResponse<RegistroDiario[]>(
      api.get(`${apiUrl}/get-relatorio-from-obra/${idObra}`),
    );
  }

  async gerarPdf(idRegistro: number, idObra: number): Promise<void> {
    try {
      const response = await api.get(`${apiUrl}/relatorios/${idObra}/${idRegistro}/pdf`, {
        responseType: "blob", // Isso é importante para receber arquivos binários
      });

      // Criar um link temporário para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `relatorio-diario-${idRegistro}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Limpeza
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      throw error;
    }
  }

  async create(registroDiario: RegistroDiario): Promise<any> {
    return await handleApiResponse(api.post(apiUrl, registroDiario));
  }

  async update(registroDiario: RegistroDiario): Promise<any> {
    return await handleApiResponse(api.put(`${apiUrl}/${registroDiario.id}`, registroDiario));
  }

  async delete(id: number): Promise<void> {
    await handleApiResponse(api.delete(`${apiUrl}/${id}`));
  }

  async put(registroDiario: RegistroDiario): Promise<void> {
    await handleApiResponse(api.put(`${apiUrl}/${registroDiario.id}`, registroDiario));
  }
}
