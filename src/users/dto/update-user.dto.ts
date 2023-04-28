import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'Toshmat1717' })
  username?: string;

  @ApiProperty({ example: 'Toshmat' })
  first_name?: string;

  @ApiProperty({ example: 'Eshmat' })
  last_name?: string;

  @ApiProperty({ example: 'Uzbek!$t0n' })
  password?: string;

  @ApiProperty({ example: 'https://cdn4.buysellads.net/uu/1/81016/1609783196-authentic-260x200-variation-3.jpg' })
  user_photo?: string;

  token?: string;
}
