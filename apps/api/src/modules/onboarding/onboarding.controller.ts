import { Body, Controller, Post } from "@nestjs/common";
import { CreatePasswordDto, OnboardingDraftDto } from "./onboarding.dto";
import { OnboardingService } from "./onboarding.service";

@Controller("onboarding")
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post("draft")
  saveDraft(@Body() body: OnboardingDraftDto) {
    return this.onboardingService.saveDraft(body);
  }

  @Post("password")
  createPassword(@Body() body: CreatePasswordDto) {
    return this.onboardingService.createPassword(body);
  }
}
