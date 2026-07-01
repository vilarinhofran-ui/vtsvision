import { IsArray, IsOptional, IsString } from "class-validator";

export class CreatePlanDto {
  @IsString()
  nome!: string;

  @IsString()
  preco!: string;

  @IsString()
  descricao!: string;
}

export class CreateSegmentDto {
  @IsString()
  segmento!: string;

  @IsArray()
  ramos!: string[];
}

export class UpsertCustomerDto {
  @IsString()
  id!: string;

  @IsString()
  nome!: string;

  @IsString()
  empresa!: string;

  @IsString()
  email!: string;

  @IsOptional()
  @IsString()
  plano?: string;
}
