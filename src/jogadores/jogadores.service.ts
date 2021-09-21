import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
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

  async criarJogador(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criaJogadorDto;

    const jogadorEncontrado = await await this.jogadorModel
      .findOne({ email })
      .exec();

    if (jogadorEncontrado) {
      throw new BadRequestException(
        `Jogador com e-mail ${email} já cadastrado.`,
      );
    }
    const jogadorCriado = new this.jogadorModel(criaJogadorDto);

    return await jogadorCriado.save();
  }

  async atualizarJogador(
    _id: string,
    atualizarJogador: AtualizarJogadorDto,
  ): Promise<void> {
    await this.verificaJogadorExistentePeloId(_id);

    await this.jogadorModel
      .findOneAndUpdate({ _id }, { $set: atualizarJogador })
      .exec();
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    // return this.jogadores;
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadorPeloId(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.verificaJogadorExistentePeloId(_id);

    return jogadorEncontrado;
  }

  async deletarJogador(_id: string): Promise<any> {
    await this.verificaJogadorExistentePeloId(_id);

    return await this.jogadorModel.deleteOne({ _id }).exec();
  }

  private async verificaJogadorExistentePeloId(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado.`);
    }

    return jogadorEncontrado;
  }
}
