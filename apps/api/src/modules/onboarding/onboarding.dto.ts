import { IsArray, IsOptional, IsString } from "class-validator";

export class OnboardingDraftDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsString()
  nome!: string;

  @IsString()
  empresa!: string;

  @IsString()
  whatsapp!: string;

  @IsString()
  email!: string;

  @IsString()
  cep!: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  rua?: string;

  @IsOptional()
  @IsString()
  bairro?: string;

  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  @IsString()
  segmento!: string;

  @IsOptional()
  @IsString()
  ramo?: string;

  @IsArray()
  dores!: string[];

  @IsArray()
  objetivos!: string[];
}

export class CreatePasswordDto {
  @IsString()
  customerId!: string;

  @IsString()
  senha!: string;

  @IsString()
  aceitarTermos!: "sim" | "nao";

  @IsString()
  aceitarLgpd!: "sim" | "nao";

  @IsString()
  aceitarPrivacidade!: "sim" | "nao";
}
