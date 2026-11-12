import { ApiProperty } from "@nestjs/swagger";
import { randomBytes } from "crypto";
import { User } from "../models/user.entity";

const developmentJwtSecret = randomBytes(32).toString("hex");

export const jwtConstants = {
    get secret(): string {
        const secret = process.env.JWT_SECRET;
        if (secret && Buffer.byteLength(secret) >= 32) return secret;
        if (process.env.NODE_ENV === "production") {
            throw new Error("JWT_SECRET must be configured with at least 32 bytes");
        }
        if (secret) {
            throw new Error("JWT_SECRET must contain at least 32 bytes");
        }
        return developmentJwtSecret;
    },
};

export class LoginResponse {
    @ApiProperty()
    token: string;
    @ApiProperty({ type: User })
    user: Partial<User>;
}

export class SignInDto {
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
}

export class RegisterDto extends SignInDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    disablility_type: string;
}
