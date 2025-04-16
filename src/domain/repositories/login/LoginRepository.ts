import api from "@/config/axios";
import type { Login } from "@/domain/entities/login/Login";
import type { ILoginRepository } from "@/domain/interface/login/ILoginRepository";
import { handleApiResponse } from "@/utils/api";

const apiUrl = `${import.meta.env.VITE_API_URL}/auth/login`;

export class LoginRepository implements ILoginRepository {
  async logar(login: Login): Promise<any> {
    return await handleApiResponse(api.post(apiUrl, login));
  }
}
