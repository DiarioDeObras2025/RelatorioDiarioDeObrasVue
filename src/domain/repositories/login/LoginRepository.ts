import api from "@/config/axios";
import type { Login } from "@/domain/entities/login/Login";
import type { ILoginRepository } from "@/domain/interface/login/ILoginRepository";
import { handleApiResponse } from "@/utils/api";
import axios from "axios";

const apiUrl = `${import.meta.env.VITE_API_URL}/auth/login`;
export class LoginRepository implements ILoginRepository {

  private registerAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });
  
  async logar(login: Login): Promise<any> {
    return await handleApiResponse(api.post(apiUrl, login));
  }

  async enviarLinkRecuperacaoSenha(email: string): Promise<any> {
    return await this.registerAxios.post(
      "/auth/forgot-password",
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  
}
