import axios from "axios";
import type { User } from "@/domain/entities/user/User";
import { HttpStatusCodeEnum } from "@/domain/enums/HttpStatusCode.enum";
import type { IUserRepository } from "@/domain/interface/user/IUserRepository";

export class UserRepository implements IUserRepository {
  private registerAxios = axios.create({
    baseURL: "https://localhost:7159",
    timeout: 10000, // 10 segundos
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
        // Erro retornado pelo servidor
        throw {
          status: error.response.status,
          message: error.response.data?.message || "Erro ao registrar usuário",
          errors: error.response.data?.errors,
        };
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        throw {
          status: HttpStatusCodeEnum.InternalServerError,
          message: "Sem resposta do servidor",
        };
      } else {
        // Erro ao configurar a requisição
        throw {
          status: HttpStatusCodeEnum.InternalServerError,
          message: error.message,
        };
      }
    }
  }
}
