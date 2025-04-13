import api from "@/config/axios";
import type { Login } from "@/domain/entities/login/Login";
import { HttpStatusCodeEnum } from "@/domain/enums/HttpStatusCode.enum";
import type { ILoginRepository } from "@/domain/interface/login/ILoginRepository";
import { handleApiResponse } from "@/utils/api";

const apiUrl = "https://localhost:7159/auth/login";

export class LoginRepository implements ILoginRepository {
  async logar(login: Login): Promise<any> {
    // return api.post(apiUrl, login);
    return await handleApiResponse(api.post(apiUrl, login), HttpStatusCodeEnum.Ok);
  }
}
