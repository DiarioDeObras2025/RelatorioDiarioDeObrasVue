import { CustoObra } from "@/domain/entities/financeiro-obra/CustoObra";
import type { IFinanceiroRepository } from "@/domain/interface/financeiro/IFinancieroRepository";
import api from "@/config/axios";
import { handleApiResponse } from "@/utils/api";

const baseUrl = import.meta.env.VITE_API_URL;
const apiUrl = `${baseUrl}/CustoObra`;

export class FinanceiroRepository implements IFinanceiroRepository {
  async criarCusto(custo: CustoObra): Promise<void> {
    await handleApiResponse(api.post(apiUrl, custo));
  }

  async listarCustosPorObra(obraId: number): Promise<CustoObra[]> {
    const response = await handleApiResponse<CustoObra[]>(api.get(`${apiUrl}/obra/${obraId}`));

    return response.map((item) => new CustoObra(
      item.id,
      item.obraId,
      item.categoria,
      item.descricao,
      item.valor,
      new Date(item.data),
      item.obra
    ));
  }

  async removerCusto(custoId: number): Promise<void> {
    await handleApiResponse(api.delete(`${apiUrl}/${custoId}`));
  }

  async atualizarCusto(custo: CustoObra): Promise<void> {
    await handleApiResponse(api.put(`${apiUrl}/${custo.id}`, custo))
  }
  
}
