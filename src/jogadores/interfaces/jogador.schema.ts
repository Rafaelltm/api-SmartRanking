import * as mongoose from 'mongoose';

export const JogadorSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    telefoneCelular: String,
    nome: String,
    ranking: String,
    posicaoRanking: Number,
    urlPhotoJogador: String,
  },
  { timestamps: true, collection: 'jogadores' },
);
