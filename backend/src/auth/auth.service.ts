import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../models/user.entity";
import { UsersService } from "./users.service";
import { LoginResponse, RegisterDto } from "./util";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(username: string, pass: string): Promise<LoginResponse> {
        const user = await this.usersService.findOne(username);
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        const { password, ...result } = user;
        // TODO: Generate a JWT and return it here
        // instead of the user object
        const payload = { username: user.username, id: user.id };
        return {
            token: await this.jwtService.signAsync(payload),
            user: result,
        };
    }

    public async register(registerDto: RegisterDto): Promise<LoginResponse> {
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
        newUser.username = registerDto.username;
        newUser.email = registerDto.email;
        newUser.password = registerDto.password;
        newUser.disablility_type = registerDto.disablility_type;
        await newUser.save();

        return this.signIn(registerDto.username, registerDto.password);
    }
}
