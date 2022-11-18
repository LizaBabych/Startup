import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { Role } from './enums/role.enum';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Example for startup')
    .setDescription('The startup API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

  const authService = app.get(AuthService);
  const usersService = app.get(UsersService);
  const admin = await usersService.getAdmin();
  if (!admin) {
    await authService.addUser(
      process.env.ADMIN_USERNAME,
      process.env.ADMIN_PASSWORD,
      Role.Admin,
    );
  }
}
bootstrap();
