import { Controller, Get, Query } from "@nestjs/common";
import { AlertsService } from "./alerts.service";

@Controller("alerts")
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  list(@Query("customerId") customerId = "cliente_demo") {
    return this.alertsService.list(customerId);
  }
}
