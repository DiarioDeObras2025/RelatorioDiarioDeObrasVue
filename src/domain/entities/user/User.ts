export class User {
  constructor(
    public id: number | null = null,
    public userName: string,
    public password: string,
    public email: string,
    public phoneNumber: string,
    public empresaId: string,
  ) {}
}
