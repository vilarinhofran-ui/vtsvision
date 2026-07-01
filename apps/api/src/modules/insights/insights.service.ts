import { Injectable } from "@nestjs/common";

@Injectable()
export class InsightsService {
  monthly(customerId: string) {
    return {
      customerId,
      riscos: [
        "Margem caiu nas duas ultimas semanas.",
        "Concentracao de vendas em poucos clientes.",
        "Meta de lucro ainda distante do planejado.",
      ],
      oportunidades: [
        "Produto Premium apresenta maior retorno por venda.",
        "Categoria B tem espaco para crescer com campanha direcionada.",
        "Existe margem para reduzir custo logistico.",
      ],
      acoesPraticas: [
        "Ajustar preco dos itens de baixa margem.",
        "Revisar custo de compra com fornecedores principais.",
        "Criar rotina semanal de acompanhamento de margem.",
        "Ativar oferta para clientes com maior recorrencia.",
        "Acompanhar ruptura de estoque critico diariamente.",
      ],
      amanha: "Comece revisando os 20% de produtos com menor margem.",
      evitar: "Evite campanhas sem olhar lucro por produto.",
      produtoMaisLucrativo: "Linha Premium X",
      produtoDestruidorMargem: "Linha Basica Z",
      categoriasPromissoras: ["Premium", "Servicos recorrentes", "Kits"],
    };
  }
}
