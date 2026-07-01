import { Injectable } from "@nestjs/common";

@Injectable()
export class AlertsService {
  list(customerId: string) {
    return {
      customerId,
      totalAtivos: 6,
      itens: [
        "Margem caiu 3 pontos no periodo.",
        "Estoque critico em 2 produtos importantes.",
        "Receita abaixo da meta semanal.",
        "Lucro negativo em uma categoria.",
        "Dependencia de 1 cliente acima de 35%.",
        "Queda de vendas no canal digital.",
      ],
    };
  }
}
