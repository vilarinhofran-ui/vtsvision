import { Injectable } from "@nestjs/common";

@Injectable()
export class BenchmarkService {
  compare(segmento: string, margemAtual: number) {
    const mediaSegmento = 26;
    const gap = Number((mediaSegmento - margemAtual).toFixed(1));

    return {
      segmento,
      margemAtual,
      mediaSegmento,
      status:
        margemAtual >= mediaSegmento ? "acima_da_media" : "abaixo_da_media",
      leitura:
        margemAtual >= mediaSegmento
          ? "Voce esta acima da media. Foque em sustentar esse nivel."
          : "Voce esta abaixo da media. Existe espaco claro para recuperar lucro.",
      gap,
    };
  }
}
