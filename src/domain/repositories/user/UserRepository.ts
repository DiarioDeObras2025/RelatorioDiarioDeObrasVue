import axios from "axios";
import type { User, UserResumido } from "@/domain/entities/user/User";
import { HttpStatusCodeEnum } from "@/domain/enums/HttpStatusCode.enum";
import type { IUserRepository } from "@/domain/interface/user/IUserRepository";
import { handleApiResponse } from "@/utils/api";
import api from "@/config/axios";

const baseUrl = import.meta.env.VITE_API_URL;
export class UserRepository implements IUserRepository {
  private registerAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
  });

  async createUser(user: User, registrationToken: string): Promise<any> {
    try {
      const response = await this.registerAxios.post(
        "/auth/register",
        {
          email: user.email,
          password: user.password,
          userName: user.userName,
          phoneNumber: user.phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${registrationToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data?.message || "Erro ao registrar usuário",
          errors: error.response.data?.errors,
        };
      } else if (error.request) {
        throw {
          status: HttpStatusCodeEnum.InternalServerError,
          message: "Sem resposta do servidor",
        };
      } else {
        throw {
          status: HttpStatusCodeEnum.InternalServerError,
          message: error.message,
        };
      }
    }
  }

  async ListUser(): Promise<UserResumido[]> {
    return await handleApiResponse<UserResumido[]>(api.get(`${baseUrl}/auth/get-users`));
  }

  async AtualizaUser(id: number, userResumido: UserResumido): Promise<UserResumido> {
    return await handleApiResponse<UserResumido>(
      api.put(`${baseUrl}/auth/atualizar-usuario/${id}`, userResumido),
    );
  }

  async CadastrarUsuarioInterno(user: User): Promise<any> {
    return await handleApiResponse(
      api.post(`${baseUrl}/auth/cadastrar-usuario`, {
        email: user.email,
        password: user.password,
        userName: user.userName,
        phoneNumber: user.phoneNumber,
      }),
    );
  }
}
