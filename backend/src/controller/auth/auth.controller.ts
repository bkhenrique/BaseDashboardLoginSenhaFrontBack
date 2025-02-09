// backend/src/controllers/auth/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../../models/User";
import { JWT_SECRET } from "../../config/jwt";

export const login = async (req: Request, res: Response) => {
  try {
     if (!JWT_SECRET) {
       throw new Error("Variável Secure não definida no .env");
     }
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Email e senha são obrigatórios." });
      return; // Importante: Adicione um return aqui para evitar execução adicional
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res
        .status(401)
        .json({ success: false, message: "Usuário não encontrado." });
      return; // Importante
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ success: false, message: "Senha inválida." });
      return; // Importante
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
    
  } catch (error) {
    console.error("Erro no controller de login:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
    
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, surname, doc, birthdate, phone, email, password } = req.body;

    if (
      !email ||
      !password ||
      !name ||
      !surname ||
      !doc ||
      !birthdate ||
      !phone
    ) {
      res
        .status(400)
        .json({ success: false, message: "Todos os campos são Obrigatórios" });
      return; // Importante!
    }

    const existingUser = await User.findOne({ $or: [{ email }, { doc }] });
    if (existingUser) {
      res
        .status(409)
        .json({ success: false, message: "Email ou documento já cadastrado." });
      return; // Importante!
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const birthdateFormatted = new Date(birthdate); //Consertado
    const newUser = new User({
      name,
      surname,
      doc,
      birthdate: birthdateFormatted, // Use a data formatada
      phone,
      email,
      password: hashedPassword,
      role: "client",
      status: "pendente",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Usuário cadastrado com sucesso!",
      userId: newUser._id.toString(),
    });
    
  } catch (error) {
    console.error("Erro no controller de registro:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
    //  Não precisa de return aqui
  }
};
