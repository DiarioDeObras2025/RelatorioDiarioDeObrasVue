import axios from "axios";
import { HttpStatusCodeEnum } from "@/domain/enums/HttpStatusCode.enum";

export async function handleApiResponse<T>(
  promise: Promise<any>
): Promise<T> {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    // Verifica se é um erro de token ausente (lançado antes da requisição)
    if (error instanceof Error && error.message.includes("Tokens ausentes")) {
      throw new Error("Sessão expirada. Por favor, faça login novamente.");
    }

    // Verifica se é um erro do axios (incluindo respostas não-2xx)
    if (axios.isAxiosError(error)) {
      // Trata respostas HTTP com erro (4xx, 5xx)
      if (error.response) {
        const { status, data } = error.response;
        
        // Tratamento específico para 401 Unauthorized
        if (status === HttpStatusCodeEnum.Unauthorized) {
          throw new Error(data.title || "Credenciais inválidas. Verifique seu e-mail e senha.");
        }
        
        // Tratamento para erros com mensagens no corpo
        if (data.title || data.message) {
          throw new Error(data.title || data.message);
        }
      }
      
      // Trata erros de rede ou outros erros do axios
      throw new Error(error.message || "Erro na comunicação com o servidor");
    }
    
    // Trata outros tipos de erro
    if (error instanceof Error) {
      throw error; // Mantém a mensagem original
    }
    
    // Fallback para erros desconhecidos
    throw new Error("Ocorreu um erro inesperado. Tente novamente mais tarde.");
  }
}