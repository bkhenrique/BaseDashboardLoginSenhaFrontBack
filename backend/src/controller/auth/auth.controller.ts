// backend/src/controllers/auth/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../../models/User";
import { JWT_SECRET } from "../../config/jwt";
// Lista negra de tokens (em memória - NÃO use em produção!)
const revokedTokens = new Set(); // Use um Set para evitar duplicatas

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
   const tokenPayload = {
     id: user._id,
      email: user.email,
      name: user.name,
      doc: user.doc,
      phone: user.phone,
      surname: user.surname,
      birthdate: user.birthdate,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
   };
    const token = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { expiresIn: "2h" }
    );
     res.cookie("token", token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production", // HTTPS em produção!
       sameSite: "strict",
       path: "/",
       maxAge: 2 * 60 * 60 * 1000, // 2 horas em milissegundos
     });

    res.status(200).json({
      success: true,

      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        doc: user.doc,
        phone: user.phone,
        surname: user.surname,
        birthdate: user.birthdate,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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
    // --- Limpeza dos Campos ---

    // 1. Documento (CPF/CNPJ): Remove tudo que não for dígito
    const cleanedDoc = doc.replace(/\D/g, "");

    // 2. Telefone: Remove tudo que não for dígito
    const cleanedPhone = phone.replace(/\D/g, "");

    // 3. Email: Remove espaços em branco no início e no fim, e converte para minúsculas
    const cleanedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({
      $or: [{ email: cleanedEmail }, { doc: cleanedDoc }],
    });

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
      doc: cleanedDoc,
      birthdate: birthdateFormatted, // Use a data formatada
      phone: cleanedPhone,
      email: cleanedEmail,
      password: hashedPassword,
      role: "client",
      status: "novo",
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

// --- LOGOUT (NOVO) ---
export const logout = (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (token) {
    revokedTokens.add(token); // Adiciona o token à lista negra
  }

  // Limpa o cookie (mesmo código que você já tem no frontend)
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  res.status(200).json({ message: 'Logout bem-sucedido.' });
};