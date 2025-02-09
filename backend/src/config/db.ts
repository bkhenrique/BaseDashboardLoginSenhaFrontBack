// backend/src/config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis de ambiente do .env

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error("Variável MONGODB_URI não definida no .env");
}

async function dbConnect() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Conectado ao MongoDB");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1); // Sai do processo em caso de erro de conexão
  }
}
export default dbConnect;
