import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDatasetDto } from "./datasets.dto";

@Injectable()
export class DatasetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateDatasetDto) {
    const created = await this.prisma.datasetUpload.create({
      data: {
        customerId: input.customerId,
        source: input.source,
        fileName: input.fileName,
        rowCount: input.rows.length,
        rows: input.rows as unknown as Prisma.InputJsonValue,
      },
    });

    return {
      id: created.id,
      fileName: created.fileName,
      rowCount: created.rowCount,
      createdAt: created.createdAt,
    };
  }

  async latest(customerId: string) {
    const latest = await this.prisma.datasetUpload.findFirst({
      where: { customerId },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) {
      throw new NotFoundException("Nenhum dataset encontrado.");
    }

    return {
      id: latest.id,
      source: latest.source,
      fileName: latest.fileName,
      rowCount: latest.rowCount,
      createdAt: latest.createdAt,
      rows: latest.rows,
    };
  }
}
