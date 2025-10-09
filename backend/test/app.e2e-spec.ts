import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Finance Manager API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply same global pipes as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/ (GET) - should return 404 on root', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(404);
    });
  });

  describe('Authentication Flow', () => {
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'Test123!@#',
      name: 'Test User',
    };

    it('/api/auth/register (POST) - should register new user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email', testUser.email);
          expect(res.body).toHaveProperty('name', testUser.name);
          expect(res.body).not.toHaveProperty('password');
          userId = res.body.id;
        });
    });

    it('/api/auth/register (POST) - should fail with duplicate email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);
    });

    it('/api/auth/register (POST) - should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: 'invalid-email',
        })
        .expect(400);
    });

    it('/api/auth/login (POST) - should login successfully', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('email', testUser.email);
          authToken = res.body.access_token;
        });
    });

    it('/api/auth/login (POST) - should fail with wrong password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401);
    });

    it('/api/auth/me (GET) - should get current user', () => {
      return request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('email', testUser.email);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('/api/auth/me (GET) - should fail without token', () => {
      return request(app.getHttpServer())
        .get('/api/auth/me')
        .expect(401);
    });
  });

  describe('Accounts CRUD', () => {
    let accountId: string;

    const testAccount = {
      name: 'Test Checking Account',
      type: 'checking',
      balance: 1000,
      currency: 'USD',
    };

    it('/api/accounts (POST) - should create account', () => {
      return request(app.getHttpServer())
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testAccount)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', testAccount.name);
          expect(res.body).toHaveProperty('type', testAccount.type);
          expect(res.body).toHaveProperty('balance', testAccount.balance);
          accountId = res.body.id;
        });
    });

    it('/api/accounts (GET) - should get all accounts', () => {
      return request(app.getHttpServer())
        .get('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/api/accounts/:id (GET) - should get specific account', () => {
      return request(app.getHttpServer())
        .get(`/api/accounts/${accountId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', accountId);
          expect(res.body).toHaveProperty('name', testAccount.name);
        });
    });

    it('/api/accounts/:id (PATCH) - should update account', () => {
      return request(app.getHttpServer())
        .patch(`/api/accounts/${accountId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Account Name' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('name', 'Updated Account Name');
        });
    });

    it('/api/accounts/:id (DELETE) - should delete account', () => {
      return request(app.getHttpServer())
        .delete(`/api/accounts/${accountId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('/api/accounts/:id (GET) - should return 404 for deleted account', () => {
      return request(app.getHttpServer())
        .get(`/api/accounts/${accountId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Categories', () => {
    it('/api/categories (GET) - should get default categories', () => {
      return request(app.getHttpServer())
        .get('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/api/categories (POST) - should create custom category', () => {
      return request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Custom Category',
          type: 'expense',
          icon: '💰',
          color: '#FF5733',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('name', 'Custom Category');
        });
    });
  });

  describe('Transactions', () => {
    let accountId: string;
    let categoryId: string;
    let transactionId: string;

    beforeAll(async () => {
      // Create account for transactions
      const accountRes = await request(app.getHttpServer())
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Transaction Test Account',
          type: 'checking',
          balance: 5000,
          currency: 'USD',
        });
      accountId = accountRes.body.id;

      // Get a category
      const categoriesRes = await request(app.getHttpServer())
        .get('/api/categories')
        .set('Authorization', `Bearer ${authToken}`);
      categoryId = categoriesRes.body[0].id;
    });

    it('/api/transactions (POST) - should create transaction', () => {
      return request(app.getHttpServer())
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'expense',
          amount: 100,
          description: 'Test expense',
          date: new Date().toISOString(),
          accountId,
          categoryId,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('amount', 100);
          expect(res.body).toHaveProperty('type', 'expense');
          transactionId = res.body.id;
        });
    });

    it('/api/transactions (GET) - should get all transactions', () => {
      return request(app.getHttpServer())
        .get('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/api/transactions/:id (DELETE) - should delete transaction', () => {
      return request(app.getHttpServer())
        .delete(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('Dashboard', () => {
    it('/api/dashboard/overview (GET) - should get dashboard overview', () => {
      return request(app.getHttpServer())
        .get('/api/dashboard/overview')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalBalance');
          expect(res.body).toHaveProperty('thisMonth');
        });
    });

    it('/api/dashboard/cash-flow (GET) - should get cash flow data', () => {
      return request(app.getHttpServer())
        .get('/api/dashboard/cash-flow')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ months: 6 })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});

