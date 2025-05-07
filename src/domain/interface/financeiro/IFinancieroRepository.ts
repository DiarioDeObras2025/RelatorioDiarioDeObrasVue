import { CustoObra } from "@/domain/entities/financeiro-obra/CustoObra";

export interface IFinanceiroRepository {
  criarCusto(custo: CustoObra): Promise<void>;
  listarCustosPorObra(obraId: number): Promise<CustoObra[]>;
  removerCusto(custoId: number): Promise<void>;
}
