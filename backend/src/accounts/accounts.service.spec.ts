import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';
import { User } from '../users/entities/user.entity';

describe('AccountsService', () => {
  let service: AccountsService;
  let repository: Repository<Account>;

  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    password: 'hashed-password',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
    accounts: [],
    transactions: [],
    categories: [],
    budgets: [],
    goals: [],
    notifications: [],
    preferences: null,
  };

  const mockAccount: Account = {
    id: 'account-1',
    name: 'Test Account',
    type: 'checking',
    balance: 1000,
    currency: 'USD',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
    transactions: [],
    budgets: [],
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
        type: 'savings' as const,
        balance: 5000,
        currency: 'USD',
      };

      mockRepository.create.mockReturnValue(mockAccount);
      mockRepository.save.mockResolvedValue(mockAccount);

      const result = await service.create(createAccountDto, mockUser);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createAccountDto,
        user: mockUser,
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockAccount);
    });
  });

  describe('findAll', () => {
    it('should return all accounts for a user', async () => {
      const accounts = [mockAccount];
      mockRepository.find.mockResolvedValue(accounts);

      const result = await service.findAll(mockUser);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(accounts);
    });
  });

  describe('findOne', () => {
    it('should return an account if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockAccount);

      const result = await service.findOne('account-1', mockUser);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'account-1', user: { id: mockUser.id } },
      });
      expect(result).toEqual(mockAccount);
    });

    it('should throw NotFoundException if account not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent', mockUser)).rejects.toThrow(
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

      const result = await service.update('account-1', updateAccountDto, mockUser);

      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException if account not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { name: 'New Name' }, mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an account successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockAccount);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('account-1', mockUser);

      expect(mockRepository.delete).toHaveBeenCalledWith('account-1');
    });

    it('should throw NotFoundException if account not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getBalance', () => {
    it('should return account balance', async () => {
      const balanceData = { balance: '1000' };
      const queryBuilder = mockRepository.createQueryBuilder();
      queryBuilder.getRawOne.mockResolvedValue(balanceData);

      mockRepository.findOne.mockResolvedValue(mockAccount);

      const result = await service.getBalance('account-1', mockUser);

      expect(result).toEqual({ balance: 1000 });
    });
  });
});

