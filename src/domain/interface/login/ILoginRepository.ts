import type { Login } from "@/domain/entities/login/Login";

export interface ILoginRepository {
  logar(login: Login): Promise<any>;
}
