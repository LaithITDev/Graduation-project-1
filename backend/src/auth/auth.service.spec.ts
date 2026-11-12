import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { User } from "../models/user.entity";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";

describe("AuthService", () => {
    let authService: AuthService;
    let findOne: jest.Mock;
    let signAsync: jest.Mock;
    let user: User;

    beforeEach(async () => {
        findOne = jest.fn();
        signAsync = jest.fn().mockResolvedValue("test-token");
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: { findOne } },
                { provide: JwtService, useValue: { signAsync } },
            ],
        }).compile();
        authService = module.get(AuthService);

        user = Object.assign(new User(), {
            id: 1,
            username: "laith",
            email: "laith@example.com",
            password: "legacy-password",
        });
        jest.spyOn(user, "save").mockResolvedValue(user);
        findOne.mockResolvedValue(user);
    });

    it("rehashes legacy passwords after successful sign-in", async () => {
        const result = await authService.signIn("laith", "legacy-password");

        expect(user.password).toMatch(/^scrypt\$[a-f0-9]+\$[a-f0-9]+$/);
        expect(user.save).toHaveBeenCalledTimes(1);
        expect(result.user).not.toHaveProperty("password");

        await expect(authService.signIn("laith", "legacy-password")).resolves.toMatchObject({
            token: "test-token",
        });
    });

    it("rejects incorrect passwords", async () => {
        await expect(authService.signIn("laith", "incorrect-password")).rejects.toThrow(
            "Unauthorized"
        );
        expect(user.save).not.toHaveBeenCalled();
    });
});
