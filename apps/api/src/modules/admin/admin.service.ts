import { Injectable } from "@nestjs/common";
import {
  CreatePlanDto,
  CreateSegmentDto,
  UpsertCustomerDto,
} from "./admin.dto";

@Injectable()
export class AdminService {
  listOverview() {
    return {
      clientesAtivos: 128,
      assinaturasAtivas: 111,
      inadimplentes: 7,
      ticketsAbertos: 12,
      processamentoIaHoje: 94,
    };
  }

  upsertCustomer(input: UpsertCustomerDto) {
    return {
      status: "cliente_salvo",
      ...input,
      atualizadoEm: new Date(),
    };
  }

  createPlan(input: CreatePlanDto) {
    return {
      status: "plano_criado",
      ...input,
      criadoEm: new Date(),
    };
  }

  createSegment(input: CreateSegmentDto) {
    return {
      status: "segmento_criado",
      ...input,
      criadoEm: new Date(),
    };
  }

  paymentList() {
    return [
      { cliente: "Loja Aurora", plano: "Business", status: "pago" },
      { cliente: "Clinica Vida", plano: "Premium", status: "pago" },
      { cliente: "Auto Prime", plano: "Starter", status: "pendente" },
    ];
  }

  logs() {
    return [
      "[INFO] Diagnostico processado em 1.2s",
      "[INFO] Novo upload recebido",
      "[ALERTA] Cliente com margem abaixo do limite",
    ];
  }
}
