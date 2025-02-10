// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/verifiToken";
import User from "../models/User";
declare global {
  namespace Express {
    interface Request {
      user?: any; // Ou um tipo mais específico
    }
  }
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
    surname: string;
    status: string;
  }; // Define a interface para a requisição autenticada
}

const  authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  // O token JWT normalmente vem no formato "Bearer <token>".  Dividimos a string para pegar apenas o token.
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Token mal formatado." });
  }

  const token = parts[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Token inválido." });
  }
let user;

user = await User.findById(decoded.id).select("-password");
if (user) {
  user = { ...user.toJSON() };
}
if (!user) {
  // Se não encontrado, responde com erro e finaliza a execução do middleware
  res.status(401).json({ message: "Usuário não autorizado! Token Inválido" });
  return; // Importante retornar aqui para evitar a execução de código adicional após o envio da resposta
}

  // Adiciona os dados do usuário decodificados à requisição.
  req.user = user;
  next(); // Chama a próxima função (o controller da rota)
}

export default authMiddleware;
