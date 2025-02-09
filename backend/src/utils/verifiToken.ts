import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt";
import { IUser2 } from "../models/User";
// Função para verificar o token (usada no middleware)
export function verifyToken(token: string): {
  id: string;
  email: string;
  role: string;
  name: string;
  surname: string;
  status: string;
} | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as IUser2; // Decodifica o token
    return decoded;
  } catch (error) {
    console.error("Erro na verificação do token:", error);
    return null;
  }
}
