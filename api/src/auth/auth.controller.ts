import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() userInfo: AuthDto) {
    const { email, password } = userInfo;
    return this.authService.register(email, password)
  }

  @Post('login')
  login(@Body() userInfo: AuthDto) {
    const {email, password} = userInfo;
    return this.authService.login(email, password)
  }
}
