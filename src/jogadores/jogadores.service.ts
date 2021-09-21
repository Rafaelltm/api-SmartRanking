import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

// import { v1 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criaJogadorDto;

    // const jogadorEncontrado = this.jogadores.find(
    //   (jogador) => jogador.email === email,
    // );

    const jogadorEncontrado = await await this.jogadorModel
      .findOne({ email })
      .exec();

    if (jogadorEncontrado) {
      await this.atualizar(criaJogadorDto);
    } else {
      await this.criar(criaJogadorDto);
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    // return this.jogadores;
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(
        `Jogador com e-mail ${email} não encontrado.`,
      );
    }
    return jogadorEncontrado;
  }

  async deletarJogadorPorEmail(email: string): Promise<any> {
    return await this.jogadorModel.remove({ email }).exec();
    // const jogadorEncontrado = this.jogadores.find(
    //   (jogador) => jogador.email === email,
    // );

    // if (!jogadorEncontrado) {
    //   throw new NotFoundException(
    //     `Jogador com e-mail ${email} não encontrado.`,
    //   );
    // }
    // this.jogadores = this.jogadores.filter(
    //   (jogador) => jogador.email !== jogadorEncontrado.email,
    // );
  }

  private async criar(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criaJogadorDto);

    return await jogadorCriado.save();

    // const { nome, telefoneCelular, email } = criaJogadorDto;

    // const jogador: Jogador = {
    //   _id: uuid(),
    //   nome,
    //   telefoneCelular,
    //   email,
    //   ranking: `A`,
    //   posicaoRanking: 1,
    //   urlFotoJogador: 'www.google.com.br/foto123',
    // };

    // this.logger.log(`criaJogadorDto: ${JSON.stringify(criaJogadorDto)}`);
    // this.jogadores.push(jogador);
  }

  private async atualizar(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
    return await this.jogadorModel
      .findOneAndUpdate(
        { email: criaJogadorDto.email },
        { $set: CriarJogadorDto },
      )
      .exec();

    // const { nome } = criaJogadorDto;

    // jogadorEncontrado.nome = nome;
  }
}
