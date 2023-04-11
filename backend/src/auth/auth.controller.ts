import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Get,
    UseGuards,
    Request,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { LoginResponse, RegisterDto, SignInDto } from "./util";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService,
    ) {}

    @Post("login")
    @ApiResponse({ type: LoginResponse })
    @HttpCode(HttpStatus.OK)
    public async signIn(@Body() signInDto: SignInDto): Promise<LoginResponse> {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @Post("register")
    @ApiResponse({ type: LoginResponse })
    @HttpCode(HttpStatus.OK)
    public async register(
        @Body() registerDto: RegisterDto,
    ): Promise<LoginResponse> {
        return this.authService.register(registerDto);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get("me")
    public async me(@Request() req) {
        const payload = req.user as {
            username: string;
            id: number;
            iat: number;
            exp: number;
        };
        return this.userService.findOne(payload.username);
    }
}
