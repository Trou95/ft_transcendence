import {
  Body,
  Controller, FileTypeValidator,
  Get,
  HttpStatus, ParseFilePipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {Response} from "express";
import {UserService} from './user.service';
import {AuthGuard} from "@nestjs/passport";
import {User} from '../@decorators/user.decorator';
import {UpdateProfileDto} from "./dto/update-profile.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get("match-history")
  async getMatchHistory(@User() user){
    const res =  await this.userService.getMatchHistory(user.id);
    return await this.userService.getMatchHistory(user.id);
  }

  @Get("leaders")
  async getTotalWins() {
    return await this.userService.getTotalWins();
  }

  @Put("update-profile")
  @UseInterceptors(FileInterceptor('avatar',{
    storage: diskStorage({
      destination: './public/uploads',
      filename: (req, file, cb) => {
        file.filename = Date.now() + "-" + file.originalname;
        cb(null, file.filename);
      }
    })
  }))
  async update(@Res() res: Response, @User() user, @Body() data : UpdateProfileDto, @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      })
  ) file) {
    data.avatar = "http://localhost:3000"  + "/uploads/" + file.filename;
    const ret = await this.userService.updateProfile(user.id, data);
    res.status(ret ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send();
  }
}
