import type { User, UserResumido } from "@/domain/entities/user/User";

export interface IUserRepository {
  createUser(user: User, registrationToken: string): Promise<any>;
  ListUser(): Promise<UserResumido[]>;
}
