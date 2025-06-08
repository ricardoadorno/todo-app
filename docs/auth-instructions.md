# 🔐 Sistema de Autenticação - Routine Flow

## Visão Geral da Autenticação

O Routine Flow utiliza um sistema de autenticação baseado em JWT (JSON Web Tokens) para gerenciar o acesso dos usuários à aplicação.

### 🏗️ Arquitetura de Autenticação

**Stack de Autenticação:**
- **Backend:**
  - NestJS Passport
  - JWT Strategy
  - Local Strategy
  - Guards personalizados
  - Criptografia de senha com bcrypt
- **Frontend:**
  - Context API para estado de autenticação
  - Interceptor de requisições HTTP
  - Middleware de proteção de rotas Next.js
  - Local Storage para persistência do token

### 📁 Estrutura de Arquivos de Autenticação

```
server/
├── src/
│   ├── auth/
│   │   ├── auth.module.ts           # Módulo principal de autenticação
│   │   ├── auth.controller.ts       # Endpoints de autenticação
│   │   ├── auth.service.ts          # Lógica de autenticação
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts      # Estratégia JWT
│   │   │   └── local.strategy.ts    # Estratégia Local
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts    # Guard JWT
│   │   │   └── local-auth.guard.ts  # Guard Local
│   │   └── dto/
│   │       ├── login.dto.ts         # DTO de login
│   │       └── register.dto.ts      # DTO de registro
client/
├── src/
│   ├── components/
│   │   └── auth/
│   │       ├── login-form.tsx       # Formulário de login
│   │       └── register-form.tsx    # Formulário de registro
│   ├── contexts/
│   │   └── auth-context.tsx         # Context de autenticação
│   ├── hooks/
│   │   └── use-auth.ts             # Hook personalizado
│   └── middleware.ts               # Middleware de proteção
```

### 🔑 Funcionalidades de Autenticação

#### 1. **Sistema de Login/Registro**
- Login com email/senha
- Registro de novos usuários
- Recuperação de senha
- Validação de campos
- Rate limiting
- Proteção contra brute force

#### 2. **Gerenciamento de Tokens**
- Geração de JWT
- Refresh tokens
- Token blacklisting
- Expiração automática
- Validação de payload

#### 3. **Proteção de Rotas**
- Guards no backend
- Middleware no frontend
- Roles e permissões
- Redirecionamento automático

### ⚙️ Configurações de Segurança

```typescript
// Configuração JWT
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '1d',
  refreshExpiresIn: '7d'
};

// Configuração de senha
const passwordConfig = {
  saltRounds: 10,
  minLength: 8,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialChars: true
};

// Rate Limiting
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de requisições
};
```

### 📝 Convenções de Código

#### **Controllers de Autenticação:**
```typescript
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}
```

#### **Serviços de Autenticação:**
```typescript
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

#### **Context de Autenticação Frontend:**
```typescript
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>(null!);

export function useAuth() {
  return useContext(AuthContext);
}
```

### 🔒 Padrões de Segurança

1. **Senha:**
   - Mínimo 8 caracteres
   - Letras maiúsculas e minúsculas
   - Números e caracteres especiais
   - Hash usando bcrypt

2. **Tokens:**
   - Payload mínimo necessário
   - Expiração curta (24h)
   - Refresh token com expiração mais longa
   - Armazenamento seguro (httpOnly cookies)

3. **API:**
   - Rate limiting
   - CORS configurado
   - Headers de segurança
   - Validação de inputs

### 🚀 Fluxo de Autenticação

1. **Login:**
   ```mermaid
   sequenceDiagram
   Client->>Server: POST /auth/login
   Server->>LocalStrategy: Validate Credentials
   LocalStrategy->>Database: Check User
   Database-->>LocalStrategy: User Data
   LocalStrategy-->>Server: Validated User
   Server->>JWTService: Generate Token
   Server-->>Client: JWT Token
   ```

2. **Requisições Autenticadas:**
   ```mermaid
   sequenceDiagram
   Client->>Server: Request + JWT
   Server->>JWTGuard: Validate Token
   JWTGuard->>Server: Decoded User
   Server-->>Client: Protected Resource
   ```

### ⚡ Performance e Segurança

- Cache de usuários autenticados
- Invalidação proativa de tokens
- Monitoramento de tentativas de login
- Logs de segurança
- Auditoria de acessos

### 📚 Referências

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport.js](http://www.passportjs.org/)
- [JWT.io](https://jwt.io/)
- [OWASP Security Practices](https://owasp.org/www-project-top-ten/)
