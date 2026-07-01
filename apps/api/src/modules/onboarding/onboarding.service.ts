import { Injectable } from "@nestjs/common";
import { CreatePasswordDto, OnboardingDraftDto } from "./onboarding.dto";

type DraftResponse = {
  customerId: string;
  status: "rascunho_salvo";
  progresso: number;
  proximaEtapa: string;
};

@Injectable()
export class OnboardingService {
  saveDraft(input: OnboardingDraftDto): DraftResponse {
    const customerId = input.customerId || `cust_${Date.now()}`;

    const baseFields = [
      input.nome,
      input.empresa,
      input.whatsapp,
      input.email,
      input.cep,
      input.segmento,
    ];

    const filled = baseFields.filter(
      (item) => (item || "").trim().length > 0,
    ).length;
    const extra = Math.min(
      4,
      (input.dores?.length || 0) + (input.objetivos?.length || 0),
    );
    const progresso = Math.min(95, Math.round(((filled + extra) / 10) * 100));

    return {
      customerId,
      status: "rascunho_salvo",
      progresso,
      proximaEtapa: "Gerar diagnostico inteligente",
    };
  }

  createPassword(input: CreatePasswordDto) {
    const termosAceitos =
      input.aceitarTermos === "sim" &&
      input.aceitarLgpd === "sim" &&
      input.aceitarPrivacidade === "sim";

    return {
      customerId: input.customerId,
      senhaCriada: input.senha.length >= 6,
      termosAceitos,
      proximaEtapa: termosAceitos
        ? "Escolher plano e ativar assinatura"
        : "Aceitar termos para continuar",
    };
  }
}
