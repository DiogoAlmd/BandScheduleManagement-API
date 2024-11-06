import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role, User } from "../../common/entities/user.entity";
import { SignInDto } from "./dto/sign-in.dto";
import { HashService } from "src/common/middlewares/hash.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn({
    email,
    password,
  }: SignInDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await this.hashService.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    let payload;
    if (user.role === "admin") {
      payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };
    } else if (user.role === "musician") {
      const musician = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ["instruments"],
      });
      payload = {
        userId: musician.id,
        email: musician.email,
        role: musician.role,
        name: musician.name,
        instruments: musician.instruments,
      };
    }
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashService.hash(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      role: Role.ADMIN,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: decoded.userId },
        relations: ["instruments"],
      });

      if (!user) throw new UnauthorizedException("Invalid token");

      const newPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        instruments: user.instruments,
      };
      const newAccessToken = this.jwtService.sign(newPayload);

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException("Invalid token", error.message);
    }
  }
}
