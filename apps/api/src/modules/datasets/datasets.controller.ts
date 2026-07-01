import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from "@nestjs/common";
import { CreateDatasetDto } from "./datasets.dto";
import { DatasetsService } from "./datasets.service";

@Controller("datasets")
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Post()
  create(@Body() body: CreateDatasetDto) {
    return this.datasetsService.create(body);
  }

  @Get("latest")
  latest(@Query("customerId") customerId?: string) {
    if (!customerId) {
      throw new BadRequestException("customerId e obrigatorio.");
    }

    return this.datasetsService.latest(customerId);
  }
}
