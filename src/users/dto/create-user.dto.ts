import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Toshmat1717' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'Toshmat' })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Eshmat' })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 'Uzbek!$t0n' })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ example: 'https://cdn4.buysellads.net/uu/1/81016/1609783196-authentic-260x200-variation-3.jpg' })
  @IsNotEmpty()
  @IsStrongPassword()
  user_photo: string;
}
