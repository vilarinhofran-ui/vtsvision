import { Body, Controller, Get, Post } from "@nestjs/common";
import { AdminService } from "./admin.service";
import {
  CreatePlanDto,
  CreateSegmentDto,
  UpsertCustomerDto,
} from "./admin.dto";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("overview")
  overview() {
    return this.adminService.listOverview();
  }

  @Get("payments")
  payments() {
    return this.adminService.paymentList();
  }

  @Get("logs")
  logs() {
    return this.adminService.logs();
  }

  @Post("customers")
  upsertCustomer(@Body() body: UpsertCustomerDto) {
    return this.adminService.upsertCustomer(body);
  }

  @Post("plans")
  createPlan(@Body() body: CreatePlanDto) {
    return this.adminService.createPlan(body);
  }

  @Post("segments")
  createSegment(@Body() body: CreateSegmentDto) {
    return this.adminService.createSegment(body);
  }
}
