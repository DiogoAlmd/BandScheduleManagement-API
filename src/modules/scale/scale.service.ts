import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Instrument } from "src/common/entities/instrument.entity";
import { ScaleMusician } from "src/common/entities/scale-musician.entity";
import { Scale } from "src/common/entities/scale.entity";
import { User, Role } from "src/common/entities/user.entity";
import { Repository, In } from "typeorm";
import { CreateScaleDto } from "./dto/create-scale.dto";
import { UpdateScaleDto } from "./dto/update-scale.dto";

@Injectable()
export class ScaleService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Scale)
    private readonly scaleRepository: Repository<Scale>,

    @InjectRepository(Instrument)
    private readonly instrumentRepository: Repository<Instrument>,

    @InjectRepository(ScaleMusician)
    private readonly scaleMusicianRepository: Repository<ScaleMusician>,
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
      if (!foundMusician) {
        throw new NotFoundException(
          `Musician with ID ${musician.musicianId} not found.`,
        );
      }

      const existingAssociation = await this.scaleMusicianRepository.findOne({
        where: {
          scale: { id: scale.id },
          musician: { id: musician.musicianId },
        },
      });
      if (existingAssociation) {
        throw new ConflictException(
          `Musician with ID ${musician.musicianId} is already assigned to this scale.`,
        );
      }

      const instruments = await this.instrumentRepository.findBy({
        id: In(musician.instrumentIds),
      });
      if (instruments.length !== musician.instrumentIds.length) {
        throw new NotFoundException(
          `One or more instruments for musician ID ${musician.musicianId} not found.`,
        );
      }

      const scaleMusician = this.scaleMusicianRepository.create({
        scale,
        musician: foundMusician,
        instruments,
      });
      await this.scaleMusicianRepository.save(scaleMusician);
    }

    return this.scaleRepository.findOne({
      where: { id: scale.id },
      relations: [
        "createdBy",
        "scaleMusician",
        "scaleMusician.musician",
        "scaleMusician.instruments",
      ],
    });
  }

  async findAll(): Promise<Scale[]> {
    return this.scaleRepository.find({
      relations: [
        "createdBy",
        "scaleMusician",
        "scaleMusician.musician",
        "scaleMusician.instruments",
      ],
    });
  }

  async updateScale(
    scaleId: number,
    updateScaleDto: UpdateScaleDto,
  ): Promise<Scale> {
    const { eventDate, musicians } = updateScaleDto;

    const existingScale = await this.scaleRepository.findOne({
      where: { id: scaleId },
      relations: [
        "scaleMusician",
        "scaleMusician.musician",
        "scaleMusician.instruments",
      ],
    });

    if (!existingScale) {
      throw new NotFoundException(`Scale with ID ${scaleId} not found.`);
    }

    if (eventDate) {
      await this.scaleRepository.update(scaleId, {
        eventDate: new Date(eventDate),
      });
    }

    if (musicians && musicians.length > 0) {
      await this.scaleMusicianRepository.delete({
        scale: { id: scaleId },
      });

      for (const musician of musicians) {
        const foundMusician = await this.userRepository.findOne({
          where: { id: musician.musicianId, role: Role.MUSICIAN },
        });

        if (!foundMusician) {
          throw new NotFoundException(
            `Musician with ID ${musician.musicianId} not found.`,
          );
        }

        const existingAssociation = await this.scaleMusicianRepository.findOne({
          where: {
            scale: { id: scaleId },
            musician: { id: musician.musicianId },
          },
        });
        if (existingAssociation) {
          throw new ConflictException(
            `Musician with ID ${musician.musicianId} is already assigned to this scale.`,
          );
        }

        const instruments = await this.instrumentRepository.findBy({
          id: In(musician.instrumentIds),
        });

        if (instruments.length !== musician.instrumentIds.length) {
          throw new NotFoundException(
            `One or more instruments for musician ID ${musician.musicianId} not found.`,
          );
        }

        const scaleMusician = this.scaleMusicianRepository.create({
          scale: existingScale,
          musician: foundMusician,
          instruments,
        });
        await this.scaleMusicianRepository.save(scaleMusician);
      }
    }

    return this.scaleRepository.findOne({
      where: { id: scaleId },
      relations: [
        "createdBy",
        "scaleMusician",
        "scaleMusician.musician",
        "scaleMusician.instruments",
      ],
    });
  }

  async deleteScale(scaleId: number): Promise<void> {
    const scale = await this.scaleRepository.findOne({
      where: { id: scaleId },
    });
    if (!scale) {
      throw new NotFoundException(`Scale with ID ${scaleId} not found.`);
    }

    await this.scaleRepository.delete(scaleId);
  }
}
