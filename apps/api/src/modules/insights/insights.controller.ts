import { Controller, Get, Query } from "@nestjs/common";
import { InsightsService } from "./insights.service";

@Controller("insights")
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get("monthly")
  monthly(@Query("customerId") customerId = "cliente_demo") {
    return this.insightsService.monthly(customerId);
  }
}
