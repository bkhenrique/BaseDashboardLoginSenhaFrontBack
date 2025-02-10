// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { AxiosResponse } from "axios";
import { LoginPayload, LoginResponse, loginUser, logoutUser, verifyMe } from "@/services/users/auth.service";
import { createUser, CreateUserPayload, UserData } from "@/services/users/user.service";

// --- Interfaces ---
// Ajuste o AuthContextType para usar as interfaces corretas


export interface User {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  role?: string;
  status?: string;
  doc?: string;
  phone?: string;
  createdAt: Date;
    updatedAt: Date;
}
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (data: LoginPayload) => Promise<LoginResponse>; // Ajuste para o tipo correto
  register: (data: CreateUserPayload) => Promise<AxiosResponse<UserData>>; // Ou apenas Promise<UserData>, se não precisar do AxiosResponse
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await verifyMe(); // Chama verifyMe do serviço
       
        if (response.status === 200) {
          setUser(response.data); // Define o usuário com os dados da resposta
        setLoading(false);

        } else {
          // O middleware já deve retornar 401 se o token for inválido,
          // mas esta é uma verificação extra.
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            router.push("/login");
        }
      } catch (error) {
        const status = error;
        if (status === 401) {   
            // Se o status for 401, o token é inválido ou
            // não foi fornecido. Redirecione para o login.
        }
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  async function login(data: LoginPayload): Promise<LoginResponse> {
    setLoading(true);
    try {
      const response = await loginUser(data);

      // O cookie HttpOnly já foi definido pelo backend!
      // Não precisamos fazer nada aqui relacionado ao token.
      if (response.data.user) {
        setUser(response.data.user); // Define o usuário com os dados da resposta
      }

      return response.data; //Retorna data, pois foi definido no backend
    } catch (error) {
       const status = error;
       if (status === 401) {
         // Se o status for 401, o token é inválido ou
         // não foi fornecido. Redirecione para o login.
       }
      throw error; // Relança o erro
    } finally {
      setLoading(false);
    }
  }

  async function register(
    data: CreateUserPayload
  ): Promise<AxiosResponse<UserData>> {
    setLoading(true);
    try {
      const result = await createUser(data);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await logoutUser(); // Chame a função do serviço e aguarde
    } catch (error) {
      // Trate erros, se necessário (ex: falha na rede)
      const status = error;
      if (status === 401) {
        // Se o status for 401, o token é inválido ou
        // não foi fornecido. Redirecione para o login.
      }
    } finally {
      setUser(null);
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/login");
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
