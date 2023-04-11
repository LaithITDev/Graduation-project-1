import { Injectable } from "@nestjs/common";
import { User } from "../models/user.entity";

@Injectable()
export class UsersService {
    async findOne(username: string): Promise<User | undefined> {
        return User.findOne({ where: { username } });
    }
}
