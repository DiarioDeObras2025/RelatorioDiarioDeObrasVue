import type { RegistroDiario } from "@/domain/entities/registro-diario/RegistroDiario";

export interface IRegistroDiarioRepository {
  getAll(): Promise<RegistroDiario[]>;
  getById(id: number): Promise<RegistroDiario>;
  update(obra: RegistroDiario): Promise<void>;
  delete(id: number): Promise<void>;
  put(obra: RegistroDiario): Promise<void>;
  getRelatorioFromObraid(idObra: number): Promise<RegistroDiario[]> 
}
