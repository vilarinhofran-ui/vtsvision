import { Injectable } from "@nestjs/common";
import { VirtualAnalystInputDto } from "./virtual-analyst.dto";

@Injectable()
export class VirtualAnalystService {
  answer(input: VirtualAnalystInputDto) {
    const margem =
      input.faturamento > 0 ? (input.lucro / input.faturamento) * 100 : 0;
    const custoPressao =
      input.faturamento > 0 ? (input.custoMedio / input.faturamento) * 100 : 0;

    const resumo =
      margem < 15
        ? "Seu faturamento subiu, mas sua margem esta apertada e precisa de ajuste rapido."
        : "Seu negocio esta evoluindo e com boa base para crescer com previsibilidade.";

    const recomendacoes = [
      "Revise os 10 itens com menor margem e ajuste preco ou custo.",
      "Direcione esforco comercial para os produtos com maior lucro por venda.",
      "Acompanhe margem semanalmente para evitar queda silenciosa.",
    ];

    return {
      resumoExecutivo: resumo,
      respostaConsultiva:
        "Seu faturamento aumentou, porem seu lucro esta abaixo do potencial. O principal motivo e o custo medio alto em parte da operacao.",
      indicadores: {
        margem: Number(margem.toFixed(1)),
        custoSobreReceita: Number(custoPressao.toFixed(1)),
      },
      riscos: [
        "Margem abaixo do ideal para sustentar crescimento.",
        "Dependencia de produtos com baixo retorno.",
        "Decisoes sem revisao semanal podem ampliar perdas.",
      ],
      oportunidades: [
        "Recuperar lucro ao focar nos itens com melhor retorno.",
        "Reduzir custo de compra nos produtos mais vendidos.",
        "Criar rotina de decisao semanal com foco em margem.",
      ],
      acoes30Dias: recomendacoes,
      perguntasRespondidas: input.perguntas,
    };
  }
}
