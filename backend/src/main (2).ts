import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle("Neuron Note API")
        .setDescription("SOEN 357 UI Project")
        .setVersion("1.0")
        .addSecurity("bearer", {
            type: "http",
            scheme: "bearer",
        })
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    const port = Number(process.env.PORT ?? 7071);
    await app.listen(port);
}
bootstrap();
