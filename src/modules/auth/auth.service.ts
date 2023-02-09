import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import code from 'src/config/code';
import { Roles } from 'src/entities/roles';
import { Users } from 'src/entities/user';
import { Permissions } from 'src/entities/permission';
import { Repository } from 'typeorm';
import { PermissionService } from '../permission/permission.service';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';
import { AddPermissionsDTO } from './dto/add-permission.dto';
import { AddRolesDTO } from './dto/add-roles.dto';
import { LoginPostDTO } from './dto/login.dto';
import { AddPermissionsRolesDTO } from './dto/add-permission-role.dto';
import * as process from 'process';
import { UtilsProvider } from '../../utils/provider';
import { SendResponse } from '../../utils/send-response';
import { RefreshToken } from '../../entities/refresh-token';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
    private roleService: RoleService,
    private permissionService: PermissionService,
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    @InjectRepository(Roles)
    private readonly roleRepo: Repository<Roles>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  validateHash(password: string, hash: string): boolean {
    if (!password || !hash) {
      return false;
    }
    return bcrypt.compareSync(password, hash);
  }
  async login(
    user: LoginPostDTO,
    refreshTokenPayload: Pick<
      RefreshToken,
      'userAgent' | 'ip' | 'os' | 'browser'
    >,
  ) {
    const getUser = await this.usersService.FindUserByUsername(user.user_email);
    if (!getUser) {
      throw 'USER_NOT_FOUND';
    }
    if (
      !getUser ||
      !this.validateHash(user.user_password, getUser.user_password)
    ) {
      throw 'WRONG_PASSWORD';
    }
    const tokens = await this.signTokenVerify(getUser);
    await this.updateRtHash(
      getUser.user_id,
      tokens.refreshToken,
      refreshTokenPayload,
    );
    return tokens;
  }

  async signTokenVerify(user: Users) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user.user_id,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.EXPIRESIN,
        },
      ),
      this.jwtService.signAsync(
        {
          id: user.user_id,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.REFRESH_EXPIRESIN,
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
      expiresInAccessToken: process.env.EXPIRESIN,
      expiresInRefreshToken: process.env.REFRESH_EXPIRESIN,
      tokenType: 'Bearer',
    };
  }

  async updateRtHash(
    userId: number,
    refreshToken: string,
    refreshTokenPayload: Pick<
      RefreshToken,
      'userAgent' | 'ip' | 'os' | 'browser'
    >,
  ): Promise<void> {
    const hash = UtilsProvider.generateHash(refreshToken);
    const check = await this.refreshTokenRepo.findOne({
      where: {
        ip: refreshTokenPayload.ip,
        browser: refreshTokenPayload.browser,
        userAgent: refreshTokenPayload.userAgent,
        os: refreshTokenPayload.os,
        user: { user_id: userId },
      },
    });
    if (!check) {
      await this.refreshTokenRepo.insert({
        user: { user_id: userId },
        browser: refreshTokenPayload.browser,
        userAgent: refreshTokenPayload.userAgent,
        ip: refreshTokenPayload.ip,
        os: refreshTokenPayload.os,
        refreshHash: hash,
      });
    } else {
      check.refreshHash = hash;
      await this.refreshTokenRepo.save(check);
    }
  }

  async logout(
    userId: number,
    refreshTokenPayload: Pick<
      RefreshToken,
      'userAgent' | 'ip' | 'os' | 'browser'
    >,
  ) {
    try {
      await this.refreshTokenRepo.update(
        {
          os: refreshTokenPayload.os,
          ip: refreshTokenPayload.ip,
          browser: refreshTokenPayload.browser,
        },
        { refreshHash: null },
      );
      return { msg: 'Done' };
    } catch (e) {
      console.log(e);
    }
  }

  async refreshTokens(
    userId: number,
    rt: string,
    refreshTokenPayload: Pick<
      RefreshToken,
      'userAgent' | 'ip' | 'os' | 'browser'
    >,
  ) {
    try {
      if (!userId || !rt) {
        throw 'UNAUTHORIZED';
      }
      const user = await this.userRepo.findOne({
        where: {
          user_id: userId,
          refreshToken: {
            ip: refreshTokenPayload.ip,
            os: refreshTokenPayload.os,
            browser: refreshTokenPayload.browser,
          },
        },
        relations: {
          refreshToken: true,
        },
      });
      if (!user || user.refreshToken.length === 0) {
        throw 'FORBIDDEN';
      }

      const rtMatches = this.validateHash(rt, user.refreshToken[0].refreshHash);
      if (!rtMatches) throw 'FORBIDDEN';

      const tokens = await this.signTokenVerify(user);
      await this.updateRtHash(
        user.user_id,
        tokens.refreshToken,
        refreshTokenPayload,
      );

      return tokens;
    } catch (e) {
      throw e;
    }
  }

  async addRolesForUser(body: AddRolesDTO) {
    try {
      const { role, user_id } = body;
      const checkUser = await this.usersService.findUserById(user_id);
      if (!checkUser) {
        throw code.USER_NOT_FOUND.type;
      }
      const listRoles: Roles[] = [];
      for (const item of role) {
        const checkRole = await this.roleService.detailRoles(item.role_id);
        if (!checkRole) {
          throw code.ROLE_NOT_FOUND.type;
        }
        listRoles.push(checkRole);
      }
      checkUser.roles = listRoles;
      await this.userRepo.save(checkUser);
      return checkUser;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async addPermissionForUser(body: AddPermissionsDTO) {
    try {
      const { permission, user_id } = body;
      const checkUser = await this.usersService.findUserById(user_id);
      if (!checkUser) {
        throw code.USER_NOT_FOUND.type;
      }
      const listPermission: Permissions[] = [];
      for (const item of permission) {
        const checkPermission = await this.permissionService.detailPermissions(
          item.permission_id,
        );
        if (!checkPermission) {
          throw code.PERMISSION_NOT_FOUND.type;
        }
        listPermission.push(checkPermission);
      }
      checkUser.permissions = listPermission;
      await this.userRepo.save(checkUser);
      return checkUser;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async addPermissionForRole(body: AddPermissionsRolesDTO) {
    try {
      const { permission, role_id } = body;
      const checkRole = await this.roleService.detailRoles(role_id);
      if (!checkRole) {
        throw code.USER_NOT_FOUND.type;
      }
      const listPermission: Permissions[] = [];
      for (const item of permission) {
        const checkPermission = await this.permissionService.detailPermissions(
          item.permission_id,
        );
        if (!checkPermission) {
          throw code.PERMISSION_NOT_FOUND.type;
        }
        listPermission.push(checkPermission);
      }
      checkRole.permissions = listPermission;
      await this.roleRepo.save(checkRole);
      return checkRole;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
}
