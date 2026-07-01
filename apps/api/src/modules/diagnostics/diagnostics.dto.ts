import { IsArray, IsOptional, IsString } from "class-validator";

export class DiagnosticsInputDto {
  @IsString()
  segmento!: string;

  @IsOptional()
  @IsString()
  ramo?: string;

  @IsArray()
  dores!: string[];

  @IsArray()
  objetivos!: string[];

  @IsOptional()
  @IsString()
  ramoOutro?: string;
}
