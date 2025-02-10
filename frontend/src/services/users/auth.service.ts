
import { AxiosResponse } from "axios";
import { apiBack } from "../apiBack";

// --- Tipos ---
export interface LoginPayload {
  email: string;
  password: string;
}

// Resposta do login (provavelmente contém o token)
export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };
}

// --- Funções ---
export const loginUser = async (
  data: LoginPayload
): Promise<AxiosResponse<LoginResponse>> => {
 
    return await apiBack.post<LoginResponse>("/login", data);
  
};

export const verifyMe = async (
): Promise<AxiosResponse<LoginResponse>> => {
  return await apiBack.get<LoginResponse>("/me");
};

export const logoutUser = async (): Promise<AxiosResponse> => {
  // Sem tipo de retorno específico
    return await apiBack.post("/logout"); 
  
};
// ... outras funções relacionadas à autenticação (logout, refresh token, etc.) ...
