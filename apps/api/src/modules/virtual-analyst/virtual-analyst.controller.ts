import { Body, Controller, Post } from "@nestjs/common";
import { VirtualAnalystInputDto } from "./virtual-analyst.dto";
import { VirtualAnalystService } from "./virtual-analyst.service";

@Controller("virtual-analyst")
export class VirtualAnalystController {
  constructor(private readonly virtualAnalystService: VirtualAnalystService) {}

  @Post("analyze")
  analyze(@Body() body: VirtualAnalystInputDto) {
    return this.virtualAnalystService.answer(body);
  }
}
