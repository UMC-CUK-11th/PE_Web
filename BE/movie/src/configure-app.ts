import { type INestApplication, ValidationPipe } from "@nestjs/common";

export function configureApp(app: INestApplication, corsEnabled = true) {
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  if (corsEnabled) {
    app.enableCors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PATCH", "DELETE"],
    });
  }
}
