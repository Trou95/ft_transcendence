import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsString} from "class-validator";
import {Type} from "class-transformer";

export class UpdateProfileDto {
    @IsNotEmpty({message: "login is required"})
    login: string;

    avatar: string;
}