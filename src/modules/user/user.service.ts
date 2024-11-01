import { UpdateMusicianDto } from './dto/update-musician.dto';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../common/entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { HashService } from "src/common/middlewares/hash.service";
import { Musician } from "src/common/entities/musician.entity";
import { CreateMusicianDto } from "./dto/create-musician.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(Musician)
    private readonly musicianRepository: Repository<Musician>,
    
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashService.hash(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createMusician(createMusicianDto: CreateMusicianDto): Promise<Musician> {
    const { fullName, email, password } = createMusicianDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await this.hashService.hash(password);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: "musician",
    });
    const savedUser = await this.userRepository.save(user);

    const musician = this.musicianRepository.create({
      fullName,
      email,
      user: savedUser,
    });

    return this.musicianRepository.save(musician);
  }

  async updateMusician(id: number, updateMusicianDto: UpdateMusicianDto): Promise<Musician> {
    const musician = await this.musicianRepository.findOne({ where: { id } });
    if (!musician) {
      throw new Error("Musician not found");
    }

    const updatedMusician = this.musicianRepository.merge(musician, updateMusicianDto);

    return this.musicianRepository.save(updatedMusician);
  }
}
