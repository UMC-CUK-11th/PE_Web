import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module.js";
import { configureApp } from "./configure-app.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  configureApp(app, config.get<string>("CORS_ENABLED", "true") !== "false");
  await app.listen(Number(config.get<string>("PORT", "3000")));
}
void bootstrap();
