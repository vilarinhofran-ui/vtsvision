import { Controller, Get, Query } from "@nestjs/common";
import { BenchmarkService } from "./benchmark.service";

@Controller("benchmark")
export class BenchmarkController {
  constructor(private readonly benchmarkService: BenchmarkService) {}

  @Get()
  compare(
    @Query("segmento") segmento = "Comercio",
    @Query("margem") margem = "18",
  ) {
    return this.benchmarkService.compare(segmento, Number(margem));
  }
}
