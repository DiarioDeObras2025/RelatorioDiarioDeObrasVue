import { Obra } from "@/domain/entities/obra/Obra";

export interface IObraRepository {
  getAll(): Promise<Obra[]>;
  getById(id: number): Promise<Obra>;
  create(obra: Obra): Promise<Obra>;
  update(obra: Obra): Promise<void>;
  delete(id: number): Promise<void>;
  put(obra: Obra): Promise<void>;
}
