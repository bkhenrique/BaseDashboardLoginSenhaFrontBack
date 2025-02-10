import { Schema, model, Document, Types } from "mongoose";

export interface IPayment {
  paymentDate: Date;
  pagamentoGerado: Date;
  amount: number;
  nextPaymentDate: Date;
  transactionId?: string;
  status: "pago" | "aberto" | "cancelado" | "pendente"; // status do pagamento (pago, aberto, cancelado, pendente)
}

export interface ISubscription extends Document {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  paymentType: "monthly" | "annual";
  startDate: Date;
  nextPaymentDate: Date;
  status: "active" | "pending" | "cancelled"; // Novo campo para o status da assinatura
  payments: IPayment[];
}

const PaymentSchema = new Schema<IPayment>({
  paymentDate: { type: Date, required: true },
  pagamentoGerado: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true },
  nextPaymentDate: { type: Date, required: true },
  transactionId: { type: String, default: "" },
  status: {
    type: String,
    enum: ["pago", "aberto", "cancelado", "pendente"],
    default: "pendente",
  },
});

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    paymentType: { type: String, enum: ["monthly", "annual"], required: true },
    startDate: { type: Date, required: true },
    nextPaymentDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "pending", "cancelled"],
      default: "active",
    },
    payments: { type: [PaymentSchema], default: [] },
  },
  { timestamps: true }
);

export default model<ISubscription>("Subscription", SubscriptionSchema);
