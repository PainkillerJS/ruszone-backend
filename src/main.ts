import { NestFactory } from "@nestjs/core";

import { PrismaService } from "./prisma/prisma.service";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.get(PrismaService).enableShutdownHooks(app);

  app.enableCors();
  app.setGlobalPrefix("api");

  await app.listen(5000);
}

bootstrap();
