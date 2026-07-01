import { Injectable } from "@nestjs/common";
import {
  CancelSubscriptionDto,
  SubscriptionCheckoutDto,
} from "./subscriptions.dto";

const planMap = {
  Starter: { valor: 97, limiteDashboards: 3, ia: "limitada" },
  Business: { valor: 197, limiteDashboards: 999, ia: "completa" },
  Premium: { valor: 397, limiteDashboards: 999, ia: "consultor_ia" },
};

@Injectable()
export class SubscriptionsService {
  checkout(input: SubscriptionCheckoutDto) {
    const plan = planMap[input.plano];
    const startedAt = new Date();
    const nextBillingAt = new Date(
      startedAt.getTime() + 30 * 24 * 60 * 60 * 1000,
    );

    return {
      customerId: input.customerId,
      plano: input.plano,
      gateway: input.gateway,
      metodo: input.metodo,
      valorMensal: plan.valor,
      garantiaDias: 7,
      cobrancaRecorrente: "a cada 30 dias",
      nextBillingAt,
      limiteDashboards: plan.limiteDashboards,
      ia: plan.ia,
      status: "assinatura_ativa",
      mensagem:
        "Assinatura ativa. Voce pode enviar dados e receber recomendacoes automaticamente.",
    };
  }

  cancel(input: CancelSubscriptionDto) {
    return {
      customerId: input.customerId,
      status: "assinatura_cancelada",
      motivo: input.motivo,
      mantemAcessoAte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
  }

  listPlans() {
    return [
      {
        nome: "Starter",
        valorMensal: 97,
        descricao: "Ate 3 dashboards, atualizacao mensal e IA limitada.",
      },
      {
        nome: "Business",
        valorMensal: 197,
        descricao: "IA completa, dashboards ilimitados e alertas automaticos.",
      },
      {
        nome: "Premium",
        valorMensal: 397,
        descricao: "Consultor IA, benchmark e relatorios automativos.",
      },
    ];
  }
}
