import { IsString } from "class-validator";

export class SubscriptionCheckoutDto {
  @IsString()
  customerId!: string;

  @IsString()
  plano!: "Starter" | "Business" | "Premium";

  @IsString()
  gateway!: "stripe" | "mercado_pago" | "asaas";

  @IsString()
  metodo!: "pix" | "cartao";
}

export class CancelSubscriptionDto {
  @IsString()
  customerId!: string;

  @IsString()
  motivo!: string;
}
