import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>
  ) {}

  async create(userId: string, createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepository.create({
      ...createAccountDto,
      userId
    });
    return await this.accountRepository.save(account);
  }

  async findAll(userId: string): Promise<Account[]> {
    return await this.accountRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string, userId: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id, userId }
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return account;
  }

  async update(id: string, userId: string, updateAccountDto: UpdateAccountDto): Promise<Account> {
    const account = await this.findOne(id, userId);

    Object.assign(account, updateAccountDto);
    return await this.accountRepository.save(account);
  }

  async remove(id: string, userId: string): Promise<void> {
    const account = await this.findOne(id, userId);
    await this.accountRepository.remove(account);
  }

  async updateBalance(id: string, userId: string, amount: number): Promise<Account> {
    const account = await this.findOne(id, userId);
    account.balance = Number(account.balance) + amount;
    return await this.accountRepository.save(account);
  }

  async getTotalBalance(userId: string): Promise<number> {
    const accounts = await this.accountRepository.find({
      where: { userId, includeInTotal: true, isActive: true }
    });

    return accounts.reduce((total, account) => total + Number(account.balance), 0);
  }
}

