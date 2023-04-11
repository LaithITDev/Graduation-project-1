import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { jwtConstants } from "./util";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: "24h" },
        }),
    ],
    controllers: [AuthController],
    providers: [UsersService, AuthService],
    exports: [UsersService],
})
export class AuthModule {}
