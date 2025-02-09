// backend/src/models/User.ts
import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  surname: string;
  doc: string;
  birthdate: Date;
  phone: string;
  email: string;
  password: string;
  role: "client" | "master";
  status: "cancelado" | "ativo" | "atrasado" | "pendente";
  createdAt: Date;
  updatedAt: Date;
}
export interface IUser2 {
  id: string;
  name: string;
  surname: string;
  doc: string;
  birthdate: Date;
  phone: string;
  email: string;
  role: "client" | "master";
  status: "cancelado" | "ativo" | "atrasado" | "pendente";
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    doc: { type: String, required: true, unique: true },
    birthdate: { type: Date, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["client", "master"], default: "client" },
    status: {
      type: String,
      enum: ["cancelado", "ativo", "atrasado", "pendente"],
      default: "pendente",
    },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
