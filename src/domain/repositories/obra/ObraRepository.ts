import type { Obra } from "@/domain/entities/obra/Obra";
import type { IObraRepository } from "@/domain/interface/obra/IObraRepository";
import api from "@/config/axios";
import { HttpStatusCodeEnum } from "@/domain/enums/HttpStatusCode.enum";
import { handleApiResponse } from "@/utils/api";

const apiUrl = "https://localhost:7159/Obra";

export class ObraRepository implements IObraRepository {
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
    return await handleApiResponse(api.post(apiUrl, obra), HttpStatusCodeEnum.Created);
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
