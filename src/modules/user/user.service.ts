import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { User } from "../../common/entities/user.entity";
import { Instrument } from "../../common/entities/instrument.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { HashService } from "src/common/middlewares/hash.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Instrument)
    private readonly instrumentRepository: Repository<Instrument>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashService.hash(createUserDto.password);

    let user: User;
    if (createUserDto.role === "admin") {
      user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
    } else if (createUserDto.role === "musician") {
      const instruments = await this.instrumentRepository.findBy({
        id: In(createUserDto.instrumentIds),
      });

      if (instruments.length !== createUserDto.instrumentIds.length) {
        throw new NotFoundException("One or more instruments not found");
      }

      user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        instruments,
      });
    }

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ["instruments"] });
  }
}
