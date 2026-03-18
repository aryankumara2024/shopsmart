const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('API Integration Tests', () => {
  beforeAll(async () => {
    // Optionally clean the test database or ensure it's up
    // For now we will just use the standard one, but we create a unique user
    await prisma.user.deleteMany({
      where: { email: 'test_integration@example.com' }
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.user.deleteMany({
      where: { email: 'test_integration@example.com' }
    });
    await prisma.$disconnect();
  });

  describe('Products API', () => {
    it('should successfully fetch all products', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Auth API', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test_integration@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
    });

    it('should login the user and return a token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test_integration@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'test_integration@example.com');
    });

    it('should fail login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test_integration@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
