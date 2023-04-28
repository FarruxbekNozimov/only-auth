import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-user.dto';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }


  async registration(userDto: CreateUserDto) {
    const condidate = await this.userService.findOneUsername(userDto.username);
    if (condidate) {
      throw new HttpException(`Bunday mavjud`, HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(userDto.password, 7);
    const user = await this.userService.create({
      ...userDto,
      password: hashedPassword,
    });
    return this.getToken(user.id);
  }


  async login(loginDto: LoginDto, res: Response) {
    const { username, password } = loginDto;
    const user = await this.userService.findOneUsername(username);
    if (!user) {
      throw new HttpException(
        `Bunday user mavjud emas`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const isMatchPass = await bcrypt.compare(password, user.password);
    if (!isMatchPass) {
      throw new UnauthorizedException(`Admin not registered`);
    }
    const tokens = await this.getToken(user.id);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedUser = await this.userService.update(user.id, {
      token: hashed_refresh_token,
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: 'ADMIN LOGIN',
      user: updatedUser,
      tokens,
    };
    return response;
  }

  async logout(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!userData) {
      throw new ForbiddenException('User not found');
    }
    const updatedUser = await this.userService.update(userData.id, {
      token: refreshToken,
    });
    res.clearCookie('refresh_token');
    const response = {
      message: 'User logged out successfully',
      user: updatedUser,
    };
    return response;
  }

  private async getToken(id: string) {
    const payload = {
      id
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshToken(user_id: number, refreshToken: string, res: Response) {
    const decodedToken = this.jwtService.decode(refreshToken);

    if (user_id != decodedToken['id']) {
      throw new BadRequestException('user not found');
    }

    const user = await this.userService.findOneById(`${user_id}`);
    if (!user || !user.password) {
      throw new BadRequestException('user not found');
    }

    const tokenMatch = await bcrypt.compare(refreshToken, user.password);
    const tokens = await this.getToken(user.id);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

    const updatedUser = await this.userService.update(user.id, {
      token: hashed_refresh_token,
    });
  }
}
