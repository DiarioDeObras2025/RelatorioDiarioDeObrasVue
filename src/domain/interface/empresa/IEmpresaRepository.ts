import type { Empresa } from "@/domain/entities/empresa/Empresa";

export interface IEmpresaRepository {
  createEmpresa(login: Empresa): Promise<any>;
}
