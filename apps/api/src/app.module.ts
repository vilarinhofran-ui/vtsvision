import { Module } from "@nestjs/common";
import { HealthController } from "./modules/health/health.controller";
import { DiagnosticsController } from "./modules/diagnostics/diagnostics.controller";
import { DiagnosticsService } from "./modules/diagnostics/diagnostics.service";
import { DatasetsController } from "./modules/datasets/datasets.controller";
import { DatasetsService } from "./modules/datasets/datasets.service";
import { PrismaService } from "./modules/prisma/prisma.service";
import { OnboardingController } from "./modules/onboarding/onboarding.controller";
import { OnboardingService } from "./modules/onboarding/onboarding.service";
import { SubscriptionsController } from "./modules/subscriptions/subscriptions.controller";
import { SubscriptionsService } from "./modules/subscriptions/subscriptions.service";
import { VirtualAnalystController } from "./modules/virtual-analyst/virtual-analyst.controller";
import { VirtualAnalystService } from "./modules/virtual-analyst/virtual-analyst.service";
import { InsightsController } from "./modules/insights/insights.controller";
import { InsightsService } from "./modules/insights/insights.service";
import { AlertsController } from "./modules/alerts/alerts.controller";
import { AlertsService } from "./modules/alerts/alerts.service";
import { BenchmarkController } from "./modules/benchmark/benchmark.controller";
import { BenchmarkService } from "./modules/benchmark/benchmark.service";
import { AdminController } from "./modules/admin/admin.controller";
import { AdminService } from "./modules/admin/admin.service";

@Module({
  controllers: [
    HealthController,
    DiagnosticsController,
    DatasetsController,
    OnboardingController,
    SubscriptionsController,
    VirtualAnalystController,
    InsightsController,
    AlertsController,
    BenchmarkController,
    AdminController,
  ],
  providers: [
    DiagnosticsService,
    DatasetsService,
    PrismaService,
    OnboardingService,
    SubscriptionsService,
    VirtualAnalystService,
    InsightsService,
    AlertsService,
    BenchmarkService,
    AdminService,
  ],
})
export class AppModule {}
