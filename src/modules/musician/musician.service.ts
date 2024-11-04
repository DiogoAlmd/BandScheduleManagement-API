import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { HashService } from "src/common/middlewares/hash.service";
import { CreateMusicianDto } from "./dto/create-musician.dto";
import { Instrument } from "src/common/entities/instrument.entity";
import { User } from "src/common/entities/user.entity";
import { Role } from "src/common/entities/user.entity";
import { UpdateMusicianDto } from "./dto/update-musician.dto";

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
      role: Role.MUSICIAN,
      password: hashedPassword,
      instruments,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: Role.MUSICIAN },
      relations: ["instruments"],
    });
  }

  async update(
    id: number,
    updateMusicianDto: UpdateMusicianDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, role: Role.MUSICIAN },
    });

    if (updateMusicianDto.email && updateMusicianDto.email !== user.email) {
      const emailInUse = await this.userRepository.findOne({
        where: { email: updateMusicianDto.email },
      });

      if (emailInUse) {
        throw new NotFoundException(
          `Email ${updateMusicianDto.email} is already in use.`,
        );
      }
    }

    if (!user) {
      throw new NotFoundException(`Musician with ID ${id} not found`);
    }

    if (updateMusicianDto.password) {
      updateMusicianDto.password = await this.hashService.hash(
        updateMusicianDto.password,
      );
    }

    if (updateMusicianDto.instrumentIds) {
      const instruments = await this.instrumentRepository.findBy({
        id: In(updateMusicianDto.instrumentIds),
      });

      if (instruments.length !== updateMusicianDto.instrumentIds.length) {
        throw new NotFoundException("One or more instruments not found");
      }

      user.instruments = instruments;
    }

    Object.assign(user, updateMusicianDto);

    return this.userRepository.save(user);
  }
}
