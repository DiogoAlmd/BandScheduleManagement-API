import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../common/entities/user.entity";
import { SignInDto } from "./dto/sign-in.dto";
import { HashService } from "src/common/middlewares/hash.service";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService
  ) {}

  async signIn({ email, password }: SignInDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await this.hashService.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
