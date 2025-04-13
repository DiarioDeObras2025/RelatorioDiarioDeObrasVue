import api from "@/config/axios";
import type { Empresa } from "@/domain/entities/empresa/Empresa";
import type { IEmpresaRepository } from "@/domain/interface/empresa/IEmpresaRepository";

const apiUrl = "https://localhost:7159/empresa/create-empresa";

export class EmpresaRepository implements IEmpresaRepository {
  createEmpresa(empresa: Empresa): Promise<any> {
    return api.post(apiUrl, empresa);
  }
}
