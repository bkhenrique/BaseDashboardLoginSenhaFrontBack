import { Schema, model, Document, Types } from "mongoose";

export interface IPostingSchedule {
  days: number[]; // Dias da semana em que o post deve ser realizado / 1: Domingo, 2: Segunda, ..., 7: Sábado  0: Todos os dias
  time: string; // Horário no formato "HH:mm"
}

export interface ISocialAccount extends Document {
  userId: Types.ObjectId;
  email: string;
  password: string;
  niche: string;
  socialNetwork: string;
  postingSchedules: {
    reels: IPostingSchedule[];
    feed: IPostingSchedule[];
    post: IPostingSchedule[];
  };
}

// Atualize o schema para incluir o array de dias
const PostingScheduleSchema = new Schema<IPostingSchedule>({
  days: { type: [Number], required: true }, // Armazena os dias como números
  time: { type: String, required: true }
});

const SocialAccountSchema = new Schema<ISocialAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    niche: { type: String, required: true },
    socialNetwork: { type: String, required: true },
    postingSchedules: {
      reels: { type: [PostingScheduleSchema], default: [] },
      feed: { type: [PostingScheduleSchema], default: [] },
      post: { type: [PostingScheduleSchema], default: [] },
    },
  },
  { timestamps: true }
);

export default model<ISocialAccount>("SocialAccount", SocialAccountSchema);
