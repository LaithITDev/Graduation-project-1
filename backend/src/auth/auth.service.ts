import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { User } from "../models/user.entity";
import { UsersService } from "./users.service";
import { LoginResponse, RegisterDto } from "./util";

const PASSWORD_HASH_PREFIX = "scrypt$";

function derivePasswordHash(password: string, salt: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        scrypt(password, salt, 64, (error, derivedKey) => {
            if (error) reject(error);
            else resolve(derivedKey);
        });
    });
}

async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const hash = await derivePasswordHash(password, salt);
    return `${PASSWORD_HASH_PREFIX}${salt}$${hash.toString("hex")}`;
}

async function verifyPassword(password: string, storedPassword: string): Promise<boolean> {
    if (!storedPassword.startsWith(PASSWORD_HASH_PREFIX)) {
        return password === storedPassword;
    }

    const [salt, storedHash, ...extra] = storedPassword
        .slice(PASSWORD_HASH_PREFIX.length)
        .split("$");
    if (!salt || !storedHash || extra.length > 0) return false;

    const expected = Buffer.from(storedHash, "hex");
    if (expected.length !== 64) return false;
    const actual = await derivePasswordHash(password, salt);
    return timingSafeEqual(Uint8Array.from(actual), Uint8Array.from(expected));
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(username: string, pass: string): Promise<LoginResponse> {
        const user = await this.usersService.findOne(username);
        if (!user || !(await verifyPassword(pass, user.password))) {
            throw new UnauthorizedException();
        }
        if (!user.password.startsWith(PASSWORD_HASH_PREFIX)) {
            user.password = await hashPassword(pass);
            await user.save();
        }
        const { password, ...result } = user;
        const payload = { username: user.username, id: user.id };
        return {
            token: await this.jwtService.signAsync(payload),
            user: result,
        };
    }

    public async register(registerDto: RegisterDto): Promise<LoginResponse> {
        if (
            typeof registerDto.username !== "string" ||
            registerDto.username.trim().length < 3 ||
            registerDto.username.trim().length > 32 ||
            typeof registerDto.email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerDto.email.trim()) ||
            typeof registerDto.password !== "string" ||
            registerDto.password.length < 8 ||
            registerDto.password.length > 128 ||
            typeof registerDto.disablility_type !== "string" ||
            registerDto.disablility_type.trim().length === 0 ||
            registerDto.disablility_type.trim().length > 100
        ) {
            throw new BadRequestException("Invalid registration details");
        }

        const user = await User.findOne({
            where: [
                { username: registerDto.username },
                { email: registerDto.email },
            ],
        });

        if (user) {
            throw new BadRequestException("User already exists");
        }

        const newUser = new User();
        newUser.username = registerDto.username.trim();
        newUser.email = registerDto.email.trim().toLowerCase();
        newUser.password = await hashPassword(registerDto.password);
        newUser.disablility_type = registerDto.disablility_type;
        await newUser.save();

        return this.signIn(registerDto.username, registerDto.password);
    }
}
