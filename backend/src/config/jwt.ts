// backend/src/config/jwt.ts
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Variável JWT_SECRET não definida no .env");
}

export { JWT_SECRET };
