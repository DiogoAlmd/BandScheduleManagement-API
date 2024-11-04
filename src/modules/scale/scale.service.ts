import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Instrument } from "src/common/entities/instrument.entity";
import { ScaleMusicianInstrument } from "src/common/entities/scale-musician-instrument.entity";
import { Scale } from "src/common/entities/scale.entity";
import { User, Role } from "src/common/entities/user.entity";
import { Repository, In } from "typeorm";
import { CreateScaleDto } from "../user/dto/create-scale.dto";

@Injectable()
export class ScaleService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Scale)
    private readonly scaleRepository: Repository<Scale>,

    @InjectRepository(Instrument)
    private readonly instrumentRepository: Repository<Instrument>,

    @InjectRepository(ScaleMusicianInstrument)
    private readonly scaleMusicianInstrumentRepository: Repository<ScaleMusicianInstrument>,
  ) {}
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

  async findAll(): Promise<Scale[]> {
    return this.scaleRepository.find({
      relations: [
        "createdBy",
        "scaleMusicianInstruments",
        "scaleMusicianInstruments.musician",
        "scaleMusicianInstruments.instrument",
      ],
    });
  }
}
