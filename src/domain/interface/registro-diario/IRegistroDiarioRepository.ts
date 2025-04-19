import type { ListRelatorioGeral } from "@/domain/entities/registro-diario/ListRelatorioGeral";
import type { RegistroDiario } from "@/domain/entities/registro-diario/RegistroDiario";

export interface IRegistroDiarioRepository {
  getAll(): Promise<RegistroDiario[]>;
  getById(idRegistro: number): Promise<RegistroDiario>;
  update(obra: RegistroDiario): Promise<void>;
  delete(id: number): Promise<void>;
  put(obra: RegistroDiario): Promise<void>;
  getRelatorioFromObraid(idObra: number): Promise<RegistroDiario[]>;
  gerarPdf(idRegistro: number, idObra: number): void;
  getRelatorioGeral(): Promise<ListRelatorioGeral[]>;
  duplicarRelatorio(idObra: number, idRegistro : number): Promise<RegistroDiario>;
}
