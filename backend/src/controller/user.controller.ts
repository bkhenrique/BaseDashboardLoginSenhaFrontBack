
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt";
import { NextFunction, Request, Response } from 'express';
import User from '../models/User';

const revokedTokens = new Set(); // Use um Set para evitar duplicatas


export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Não autorizado." });
    }

    // 1. Obtenha o ID do usuário do token (req.user)
    const userId = req.user.id;

    // 2. Busque o usuário no banco de dados usando o ID
    const user = await User.findById(userId).select("-password"); // Use .select('-password')!

    if (!user) {
      // Se o usuário não for encontrado (por algum motivo), retorne 404.
      // Isso é improvável, mas é uma boa prática verificar.
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
   const reponsede = {
     id: req.user.id,
     email: user.email,
     name: user.name,
     birthdate: user.birthdate,
     doc : user.doc,
     surname: user.surname,
     phone: user.phone,
     role: user.role,
     status: user.status,
     createdAt: user.createdAt,
     updatedAt: user.updatedAt,
   };
    // 3. Retorne os dados *do banco de dados*
    res.status(200).json(reponsede);
   
  } catch (error) {
    console.error("Erro ao buscar dados do usuário (getMe):", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};



export const createUser = async (req: Request, res: Response) => {
  try {
    const newData = await User.create(req.body);
    res.status(201).json(newData);
  } catch (error) {
    console.error('Erro ao criar :', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await User.findById(id).select("-password");
    if (!data) 
       res.status(404).json({ message: ' não encontrado' });
    const response = {
      id: data._id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      doc: data.doc,
      surname: data.surname,
      birthdate: data.birthdate,
      role: data.role,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao buscar :', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
     const userId = req.params.userId;
     const updates = req.body;
    const updatedData = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (!updatedData) 
       res.status(404).json({ message: 'Usuário não encontrado' });
    res.status(200).json(updatedData);
  } catch (error) {
    console.error('Erro ao atualizar :', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId= req.params;
    const deletedData = await User.findByIdAndDelete(userId);
    if (!deletedData) 
       res.status(404).json({ message: ' não encontrado' });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar :', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};


export const verifyTokenMe = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
     res.status(401).json({ message: "Token não fornecido." });
  }

  // VERIFICA SE O TOKEN ESTÁ NA LISTA NEGRA
  if (revokedTokens.has(token)) {
     res.status(401).json({ message: "Token revogado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
     res.status(401).json({ message: "Token inválido." });
  }
};