import { IsArray, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class UploadRowDto {
  @IsString()
  mes!: string;

  @IsString()
  categoria!: string;

  faturamento!: number;
  lucro!: number;
}

export class CreateDatasetDto {
  @IsString()
  customerId!: string;

  @IsString()
  source!: string;

  @IsString()
  fileName!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UploadRowDto)
  rows!: UploadRowDto[];
}
