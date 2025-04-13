import api from "@/config/axios";
import type { RegistroDiario } from "@/domain/entities/registro-diario/RegistroDiario";
import type { IRegistroDiarioRepository } from "@/domain/interface/registro-diario/IRegistroDiarioRepository";
import { handleApiResponse } from "@/utils/api";

const apiUrl = "https://localhost:7159/RegistroDiario";

export class RegistroDiarioRepository implements IRegistroDiarioRepository {
  async getAll(): Promise<RegistroDiario[]> {
    return await handleApiResponse<RegistroDiario[]>(api.get(apiUrl));
  }

  async getById(id: number): Promise<RegistroDiario> {
    throw "erro" +id;
  }

  async getRelatorioFromObraid(idObra: number): Promise<RegistroDiario[]> {
      return await handleApiResponse<RegistroDiario[]>(api.get(`${apiUrl}/get-relatorio-from-obra/${idObra}`));
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
