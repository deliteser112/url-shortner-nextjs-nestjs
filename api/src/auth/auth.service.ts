import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../user/user.entity'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}


  async register(email: string, password: string) {
    const existing = await this.userRepo.findOne({ where: { email } });

    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const hash = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hash });
    await this.userRepo.save(user);

    return { message: 'Registered successfully' };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const match = await bcrypt.compare(password, user.password)
    if (!match) throw new UnauthorizedException('Invalid credentials')

    const payload = { id: user.id, email: user.email }
    const token = this.jwtService.sign(payload)

    return { token }
  }
}
