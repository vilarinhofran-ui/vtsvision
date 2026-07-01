import { Body, Controller, Post } from "@nestjs/common";
import { DiagnosticsInputDto } from "./diagnostics.dto";
import { DiagnosticsService } from "./diagnostics.service";

@Controller("diagnostics")
export class DiagnosticsController {
  constructor(private readonly diagnosticsService: DiagnosticsService) {}

  @Post()
  create(@Body() body: DiagnosticsInputDto) {
    return this.diagnosticsService.generate(body);
  }
}
