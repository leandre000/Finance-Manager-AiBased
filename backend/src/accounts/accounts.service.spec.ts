import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account, AccountType } from './entities/account.entity';

describe('AccountsService', () => {
  let service: AccountsService;

  const userId = 'user-1';

  const mockAccount: Account = {
    id: 'account-1',
    name: 'Test Account',
    type: AccountType.CHECKING,
    balance: 1000,
    currency: 'USD',
    creditLimit: null,
    color: null,
    icon: null,
    description: null,
    isActive: true,
    includeInTotal: true,
    userId: userId,
    user: null as any,
    transactions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getRepositoryToken(Account),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    repository = module.get<Repository<Account>>(getRepositoryToken(Account));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an account successfully', async () => {
      const createAccountDto = {
        name: 'New Account',
        type: AccountType.SAVINGS,
        balance: 5000,
        currency: 'USD',
      };

      mockRepository.create.mockReturnValue(mockAccount);
      mockRepository.save.mockResolvedValue(mockAccount);

      const result = await service.create(userId, createAccountDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createAccountDto,
        userId,
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockAccount);
    });
  });

  describe('findAll', () => {
    it('should return all accounts for a user', async () => {
      const accounts = [mockAccount];
      mockRepository.find.mockResolvedValue(accounts);

      const result = await service.findAll(userId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(accounts);
    });
  });

  describe('findOne', () => {
    it('should return an account if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockAccount);

      const result = await service.findOne('account-1', userId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'account-1', userId },
      });
      expect(result).toEqual(mockAccount);
    });

    it('should throw NotFoundException if account not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent', userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an account successfully', async () => {
      const updateAccountDto = { name: 'Updated Name' };
      const updatedAccount = { ...mockAccount, name: 'Updated Name' };

      mockRepository.findOne.mockResolvedValue(mockAccount);
      mockRepository.save.mockResolvedValue(updatedAccount);

      const result = await service.update('account-1', userId, updateAccountDto);

      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException if account not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent', userId, { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an account successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockAccount);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('account-1', userId);

      expect(mockRepository.delete).toHaveBeenCalledWith('account-1');
    });

    it('should throw NotFoundException if account not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent', userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

