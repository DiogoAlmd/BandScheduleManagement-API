import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { HashService } from "src/common/middlewares/hash.service";
import { CreateMusicianDto } from "./dto/create-musician.dto";
import { Instrument } from "src/common/entities/instrument.entity";
import { User } from "src/common/entities/user.entity";

@Injectable()
export class MusicianService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Instrument)
    private readonly instrumentRepository: Repository<Instrument>,
    private readonly hashService: HashService,
  ) {}

  async create(createMusicianDto: CreateMusicianDto): Promise<User> {
    const hashedPassword = await this.hashService.hash(
      createMusicianDto.password,
    );

    const instruments = await this.instrumentRepository.findBy({
      id: In(createMusicianDto.instrumentIds),
    });

    if (instruments.length !== createMusicianDto.instrumentIds.length) {
      throw new NotFoundException("One or more instruments not found");
    }

    const user = this.userRepository.create({
      ...createMusicianDto,
      role: "musician",
      password: hashedPassword,
      instruments,
    });

    return this.userRepository.save(user);
  }
}
