
import { AxiosResponse } from "axios";
import { apiBack } from "../apiBack";

// --- Tipos (Interfaces) ---
// Defina interfaces para os dados que você espera receber e enviar.
// Isso é *extremamente* importante para ter um código Typescript robusto.

// Exemplo: Dados do usuário (ajuste conforme as propriedades reais do seu backend)
export interface UserData {
  id: string;
  email: string;
  name: string;
  surname: string;
  birthdate: string; // Vamos tratar a formatação no componente
  doc: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string; // Vamos formatar também
  updatedAt: string; // Vamos formatar também
}

// Exemplo: Dados para criar um novo usuário
export interface CreateUserPayload {
  email: string;
  password: string;
  name: string;
  surname: string;
  doc: string;
  birthdate: string;
  phone: string;
}

// Exemplo: Dados para atualizar um usuário
export interface UpdateUserPayload {
  name?: string; // Campos opcionais, pois você pode atualizar apenas alguns
  email?: string;
  // ... outras propriedades ...
}

// --- Funções do Serviço ---

// Obter usuário por ID
export const getUserById = async (
  id: string
): Promise<AxiosResponse<UserData>> => {
  try {
    const response = await apiBack.get<UserData>(`/user/${id}`);
    return response;
  } catch (error) {
    // Trate o erro aqui (opcional).  Pode relançar, logar, etc.
    throw error; // Relança o erro para que o componente que chamou possa tratá-lo
  }
};

// Criar novo usuário
export const createUser = async (
  data: CreateUserPayload
): Promise<AxiosResponse<UserData>> => {
  // Geralmente retorna o usuário criado
 
    return await apiBack.post<UserData>("/newuser", data);
  
};

// Atualizar usuário
export const updateUser = async (
  id: string,
  data: UpdateUserPayload
): Promise<AxiosResponse<UserData>> => {

    return await apiBack.put<UserData>(`/user/${id}`, data);
   
};

// ... outras funções para outras rotas de usuário (se houver) ...
