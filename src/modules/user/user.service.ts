import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../common/entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { HashService } from "src/common/middlewares/hash.service";
import { Role } from "src/common/entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

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

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id, role: Role.ADMIN } });
  }
}
