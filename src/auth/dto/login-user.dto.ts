import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: 'Toshmat1717' })
  username: string;

  @ApiProperty({ example: 'Toshmat1717' })
  password: string;
}
