import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleType } from 'common/constants';
import { AuthUser, Roles } from 'decorators';
import { AuthGuard, RolesGuard } from 'guards';
import { AuthUserInterceptor } from 'interceptors';
import {
  ConfirmTransactionDto,
  CreateTransactionDto,
  CreateTransactionPayloadDto,
  TransactionAuthorizationKeyPayloadDto,
  TransactionsPageDto,
  TransactionsPageOptionsDto,
} from 'modules/transaction/dtos';
import { TransactionService } from 'modules/transaction/services';
import { UserEntity } from 'modules/user/entities';
import { Response } from 'express';

@Controller('Transactions')
@ApiTags('Transactions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly _transactionService: TransactionService) { }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleType.USER, RoleType.ADMIN, RoleType.ROOT)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get transactions',
    type: TransactionsPageDto,
  })
  async getTransactions(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: TransactionsPageOptionsDto,
    @AuthUser() user: UserEntity,
  ): Promise<TransactionsPageDto> {
    return this._transactionService.getTransactions(user, pageOptionsDto);
  }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleType.USER, RoleType.ADMIN, RoleType.ROOT)
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'create transfer',
    type: CreateTransactionPayloadDto,
  })
  async createTransaction(
    @AuthUser() user: UserEntity,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<CreateTransactionPayloadDto> {
    const { uuid } = await this._transactionService.createTransaction(
      user,
      createTransactionDto,
    );

    return new CreateTransactionPayloadDto(uuid);
  }

  @Patch('confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleType.USER, RoleType.ADMIN, RoleType.ROOT)
  @ApiNoContentResponse({
    description: 'confirm transfer',
  })
  async confirmTransaction(
    @AuthUser() user: UserEntity,
    @Body() confirmTransactionDto: ConfirmTransactionDto,
  ): Promise<void> {
    await this._transactionService.confirmTransaction(
      user,
      confirmTransactionDto,
    );
  }
}
