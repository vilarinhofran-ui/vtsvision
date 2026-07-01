export const segmentos = [
  "Comercio",
  "Servicos",
  "Tecnologia",
  "Saude",
  "Construcao",
  "Alimentacao",
  "Automotivo",
  "Educacao",
  "Industria",
  "Logistica",
  "Hotelaria",
  "Agronegocio",
  "Imobiliario",
  "Outro",
];

export const ramosPorSegmento: Record<string, string[]> = {
  Comercio: [
    "Loja de roupas",
    "Loja de calcados",
    "Loja de moveis",
    "Farmacia",
    "Pet shop",
    "Mercado",
    "Supermercado",
    "Distribuidora",
    "Ferragista",
    "Outro",
  ],
  Servicos: [
    "Consultoria",
    "Agencia",
    "Contabilidade",
    "Manutencao",
    "Clinica de servicos",
    "Outro",
  ],
  Tecnologia: ["SaaS", "Software sob medida", "Infra", "Dados", "Outro"],
  Saude: ["Clinica", "Laboratorio", "Hospital", "Odontologia", "Outro"],
  Construcao: ["Obras", "Projetos", "Materiais", "Reformas", "Outro"],
  Alimentacao: ["Restaurante", "Delivery", "Industria", "Mercado", "Outro"],
  Automotivo: ["Oficina", "Concessionaria", "Autopecas", "Frotas", "Outro"],
  Educacao: ["Escola", "Cursos", "Treinamentos", "Edtech", "Outro"],
  Industria: ["Metal", "Textil", "Quimica", "Bens consumo", "Outro"],
  Logistica: ["Transporte", "Armazenagem", "Frota", "Last mile", "Outro"],
  Hotelaria: ["Hotel", "Pousada", "Eventos", "Turismo", "Outro"],
  Agronegocio: ["Producao", "Distribuicao", "Insumos", "Maquinas", "Outro"],
  Imobiliario: [
    "Corretagem",
    "Locacao",
    "Incorporacao",
    "Administracao",
    "Outro",
  ],
  Outro: ["Outro"],
};

export const doresPadrao = [
  "Nao sei meu lucro",
  "Dados desorganizados",
  "Nao sei o que vende",
  "Nao tenho indicadores",
  "Nao tenho controle financeiro",
  "Nao consigo crescer",
  "Outra",
];

export const objetivosPadrao = [
  "Aumentar faturamento",
  "Aumentar lucro",
  "Reduzir custos",
  "Organizar dados",
  "Controlar estoque",
  "Prever vendas",
  "Tomar decisoes",
];

export const planos = [
  {
    nome: "Starter",
    preco: "R$ 97/mes",
    itens: ["Ate 3 dashboards", "Atualizacao mensal", "IA limitada"],
  },
  {
    nome: "Business",
    preco: "R$ 197/mes",
    itens: [
      "IA completa",
      "Dashboard ilimitado",
      "Alertas e insights automaticos",
      "Google Sheets",
    ],
  },
  {
    nome: "Premium",
    preco: "R$ 397/mes",
    itens: [
      "Tudo incluso",
      "Consultor IA",
      "Relatorios automativos",
      "Benchmark",
      "Alertas inteligentes",
    ],
  },
];
