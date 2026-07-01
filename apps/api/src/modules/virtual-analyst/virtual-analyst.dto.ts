import { IsArray, IsNumber, IsString } from "class-validator";

export class VirtualAnalystInputDto {
  @IsString()
  customerId!: string;

  @IsNumber()
  faturamento!: number;

  @IsNumber()
  lucro!: number;

  @IsNumber()
  custoMedio!: number;

  @IsArray()
  perguntas!: string[];
}
