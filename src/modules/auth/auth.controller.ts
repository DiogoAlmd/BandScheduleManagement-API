import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post("refresh-token")
  async refreshToken(@Req() request: Request) {
    const authHeader = request.headers["authorization"];
    if (!authHeader) throw new UnauthorizedException("Token missing");

    const token = authHeader.split(" ")[1];
    return this.authService.refreshToken(token);
  }
}
