import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { User } from "../../common/entities/user.entity";
import { Scale } from "../../common/entities/scale.entity";
import { Instrument } from "../../common/entities/instrument.entity";
import { ScaleMusicianInstrument } from "../../common/entities/scale-musician-instrument.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateScaleDto } from "./dto/create-scale.dto";
import { HashService } from "src/common/middlewares/hash.service";
import { Role } from "src/common/entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Scale)
    private readonly scaleRepository: Repository<Scale>,

    @InjectRepository(Instrument)
    private readonly instrumentRepository: Repository<Instrument>,

    @InjectRepository(ScaleMusicianInstrument)
    private readonly scaleMusicianInstrumentRepository: Repository<ScaleMusicianInstrument>,

    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashService.hash(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      role: Role.ADMIN,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ["instruments"] });
  }

  async createScale(
    adminId: number,
    createScaleDto: CreateScaleDto,
  ): Promise<Scale> {
    const adminUser = await this.userRepository.findOne({
      where: { id: adminId },
    });
    if (!adminUser || adminUser.role !== "admin") {
      throw new ForbiddenException("Only admins can create scales.");
    }

    const { eventDate, musicians } = createScaleDto;

    const scale = this.scaleRepository.create({
      eventDate,
      createdBy: adminUser,
    });
    await this.scaleRepository.save(scale);

    for (const musician of musicians) {
      const foundMusician = await this.userRepository.findOne({
        where: { id: musician.musicianId, role: Role.MUSICIAN },
      });
      if (!foundMusician)
        throw new NotFoundException(
          `Musician with ID ${musician.musicianId} not found.`,
        );

      const instruments = await this.instrumentRepository.findBy({
        id: In(musician.instrumentIds),
      });
      if (instruments.length !== musician.instrumentIds.length) {
        throw new NotFoundException(
          `One or more instruments for musician ID ${musician.musicianId} not found.`,
        );
      }

      for (const instrument of instruments) {
        const scaleMusicianInstrument =
          this.scaleMusicianInstrumentRepository.create({
            scale,
            musician: foundMusician,
            instrument,
          });
        await this.scaleMusicianInstrumentRepository.save(
          scaleMusicianInstrument,
        );
      }
    }

    return scale;
  }
}
