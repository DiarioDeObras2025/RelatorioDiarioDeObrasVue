import type { Obra } from "@/domain/entities/obra/Obra";
import type { IObraRepository } from "@/domain/interface/obra/IObraRepository";
import api from "@/config/axios";
import { handleApiResponse } from "@/utils/api";

const baseUrl = import.meta.env.VITE_API_URL;
const apiUrl = `${baseUrl}/Obra`;

export class ObraRepository implements IObraRepository {
  getTotalRegistro(): Promise<number> {
    return handleApiResponse<number>(api.get(`${baseUrl}/registroDiario/total`));
  }

  async getAll(): Promise<Obra[]> {
    return await handleApiResponse<Obra[]>(api.get(apiUrl));
  }

  async getById(id: number): Promise<Obra> {
    const data = await handleApiResponse<Obra>(api.get(`${apiUrl}/${id}`));

    return {
      ...data,
      dataInicio: new Date(data.dataInicio),
      dataTerminoPrevista: data.dataTerminoPrevista ? new Date(data.dataTerminoPrevista) : null,
      dataAtualizacao: data.dataAtualizacao ? new Date(data.dataAtualizacao) : null,
    };
  }

  async create(obra: Obra): Promise<any> {
    return await handleApiResponse(api.post(apiUrl, obra));
  }

  async update(obra: Obra): Promise<any> {
    return await handleApiResponse(api.put(`${apiUrl}/${obra.id}`, obra));
  }

  async delete(id: number): Promise<void> {
    await handleApiResponse(api.delete(`${apiUrl}/${id}`));
  }

  async put(obra: Obra): Promise<void> {
    await handleApiResponse(api.put(`${apiUrl}/${obra.id}`, obra));
  }
}
