import { Injectable } from "@nestjs/common";
import { Instrument } from "src/common/entities/instrument.entity";
import { CreateInstrument } from "./dto/create-instrument.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class InstrumentService {
  constructor(
    @InjectRepository(Instrument)
    private readonly instrumentRepository: Repository<Instrument>,
  ) {}

  async findAll(): Promise<Instrument[]> {
    return this.instrumentRepository.find();
  }

  async createInstrument(instrumentDto: CreateInstrument): Promise<Instrument> {
    const instrument = this.instrumentRepository.create(instrumentDto);
    return this.instrumentRepository.save(instrument);
  }
}
