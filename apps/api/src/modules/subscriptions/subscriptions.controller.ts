import { Body, Controller, Get, Post } from "@nestjs/common";
import {
  CancelSubscriptionDto,
  SubscriptionCheckoutDto,
} from "./subscriptions.dto";
import { SubscriptionsService } from "./subscriptions.service";

@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get("plans")
  plans() {
    return this.subscriptionsService.listPlans();
  }

  @Post("checkout")
  checkout(@Body() body: SubscriptionCheckoutDto) {
    return this.subscriptionsService.checkout(body);
  }

  @Post("cancel")
  cancel(@Body() body: CancelSubscriptionDto) {
    return this.subscriptionsService.cancel(body);
  }
}
