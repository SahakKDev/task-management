import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signup(authCredentialsDto);
  }

  @Post('/signin')
  signin(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signin(authCredentialsDto);
  }
}
