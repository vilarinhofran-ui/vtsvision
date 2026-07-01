import { Injectable } from "@nestjs/common";
import { DiagnosticsInputDto } from "./diagnostics.dto";

@Injectable()
export class DiagnosticsService {
  private readonly segmentFocus: Record<string, string> = {
    Comercio: "mix de produtos, margem e giro de estoque",
    Servicos: "capacidade operacional, ticket medio e recorrencia",
    Tecnologia: "funil comercial, churn e previsibilidade de receita",
    Saude: "agenda, ocupacao e eficiencia de atendimento",
    Construcao: "custos de obra, produtividade e prazo",
    Alimentacao: "desperdicio, CMV e ritmo de vendas",
    Automotivo: "produtividade por ordem de servico e margem",
    Educacao: "captacao, permanencia de alunos e inadimplencia",
    Industria: "eficiencia produtiva, perdas e lead time",
    Logistica: "custo por entrega e nivel de servico",
    Hotelaria: "taxa de ocupacao, diaria media e sazonalidade",
    Agronegocio: "custos por ciclo, produtividade e previsao de demanda",
    Imobiliario: "velocidade de venda, repasse e funil de leads",
    Outro: "padronizacao de dados e rotina de gestao",
  };

  private readonly riskCatalog: Record<string, string> = {
    "Nao sei meu lucro":
      "Margem negativa em parte da operacao sem alerta rapido",
    "Dados desorganizados":
      "Decisoes criticas tomadas sem base consolidada de dados",
    "Nao sei o que vende mais":
      "Estoque e investimento desalinhados com demanda real",
    "Nao tenho indicadores":
      "Dificuldade para identificar desvios antes de afetar o caixa",
    "Nao tenho controle financeiro":
      "Pressao de caixa por falta de previsao de entradas e saidas",
    "Nao consigo crescer":
      "Crescimento sem processo aumenta custo e reduz margem",
    Outra: "Risco de perda de competitividade por baixa visibilidade gerencial",
  };

  private readonly opportunityCatalog: Record<string, string> = {
    "Aumentar faturamento":
      "Criar campanhas orientadas pelos produtos/servicos de maior conversao",
    "Aumentar lucro":
      "Reprecificar itens com baixa margem e focar no portfolio rentavel",
    "Reduzir custos":
      "Eliminar desperdicios e renegociar custos recorrentes de maior impacto",
    "Organizar dados":
      "Centralizar dados em um painel unico com governanca minima",
    "Controlar estoque":
      "Definir politica de estoque por giro e margem para reduzir ruptura",
    "Prever vendas": "Adotar previsao semanal por historico e sazonalidade",
    "Tomar decisoes com seguranca":
      "Implantar rotina executiva com indicadores-chave e metas",
  };

  private normalizeList(list: string[] | undefined): string[] {
    return (list ?? []).filter(Boolean).map((item) => item.trim());
  }

  private calculateMaturity(dores: string[]): "Baixo" | "Medio" | "Alto" {
    if (!dores.length) return "Medio";

    let score = 0;
    for (const dor of dores) {
      if (dor.includes("Nao tenho controle financeiro")) score += 3;
      else if (dor.includes("Nao tenho indicadores")) score += 3;
      else if (dor.includes("Dados desorganizados")) score += 2;
      else if (dor.includes("Nao sei meu lucro")) score += 2;
      else score += 1;
    }

    if (score >= 7) return "Baixo";
    if (score >= 4) return "Medio";
    return "Alto";
  }

  private pickTopThree(values: string[], fallback: string[]): string[] {
    const merged = [...values, ...fallback];
    return [...new Set(merged)].slice(0, 3);
  }

  generate(input: DiagnosticsInputDto) {
    const dores = this.normalizeList(input.dores);
    const objetivos = this.normalizeList(input.objetivos);

    const principalDor = dores[0] ?? "Dados desorganizados";
    const principalObjetivo = objetivos[0] ?? "Aumentar lucro";
    const maturidade = this.calculateMaturity(dores);

    const segmento = input.segmento || "Outro";
    const ramo =
      input.ramo === "Outro"
        ? input.ramoOutro || "Outro"
        : input.ramo || "Outro";
    const segmentFocus = this.segmentFocus[segmento] ?? this.segmentFocus.Outro;

    const mappedRisks = dores
      .map((dor) => this.riskCatalog[dor])
      .filter(Boolean);
    const mappedOpportunities = objetivos
      .map((objetivo) => this.opportunityCatalog[objetivo])
      .filter(Boolean);

    const riscos = this.pickTopThree(mappedRisks, [
      "Baixa cadencia de acompanhamento dos indicadores-chave",
      "Dependencia de decisoes reativas ao inves de planejamento",
      "Perda de margem por ausencia de priorizacao executiva",
    ]);

    const oportunidades = this.pickTopThree(mappedOpportunities, [
      "Elevar disciplina de execucao com ritos semanais de performance",
      "Aumentar previsibilidade com metas por indicador critico",
      "Ganhar eficiencia operacional com foco nas alavancas certas",
    ]);

    return {
      maturidade,
      problemaPrincipal: principalDor,
      riscos,
      oportunidades,
      planoInicial: [
        `Priorizar ${principalObjetivo.toLowerCase()} com metas semanais no contexto de ${segmento.toLowerCase()}`,
        `Criar painel executivo para ${segmentFocus} com revisao semanal`,
        `Implementar plano de 30 dias para o ramo ${ramo.toLowerCase()} com responsavel e prazo`,
      ],
      respostaExecutiva: `Para ${segmento.toLowerCase()}, o diagnostico indica foco imediato em ${principalDor.toLowerCase()}. Ao atacar essa frente e sustentar o objetivo de ${principalObjetivo.toLowerCase()}, a empresa aumenta previsibilidade e reduz risco operacional em ate 30 dias.`,
    };
  }
}
