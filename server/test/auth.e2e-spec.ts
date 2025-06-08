// Arquivo de teste para validar o sistema de autenticação

import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    await app.init();

    // Limpar registros de teste existentes
    await prisma.user.deleteMany({
      where: { email: 'teste@example.com' },
    });
  });

  afterAll(async () => {
    // Limpar registros criados durante os testes
    await prisma.user.deleteMany({
      where: { email: 'teste@example.com' },
    });

    await app.close();
  });

  it('deve registrar um novo usuário', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'teste@example.com',
        password: 'senha123',
        name: 'Usuário Teste',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', 'teste@example.com');
    expect(response.body).toHaveProperty('name', 'Usuário Teste');
    expect(response.body).not.toHaveProperty('password');
  });

  it('deve fazer login e retornar um token JWT', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'teste@example.com',
        password: 'senha123',
      })
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('email', 'teste@example.com');
  });

  it('deve acessar o perfil com o token JWT', async () => {
    // Primeiro, fazer login para obter o token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'teste@example.com',
        password: 'senha123',
      });

    const token = loginResponse.body.access_token;

    // Usar o token para acessar o perfil
    const response = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', 'teste@example.com');
  });
});
