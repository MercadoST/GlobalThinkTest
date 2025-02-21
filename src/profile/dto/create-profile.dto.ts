import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ required: false, description: 'Profile ID' })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ description: 'Profile code' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Profile name' })
  @IsString()
  profileName: string;
}
