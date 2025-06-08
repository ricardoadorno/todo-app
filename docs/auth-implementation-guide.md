# 🔐 Guia de Implementação: Sistema de Autenticação JWT

## 📋 Passo a Passo da Implementação

### 1️⃣ Backend: Configuração Inicial

1. **Instalar dependências necessárias:**
```bash
cd server
npm install @nestjs/passport passport passport-local passport-jwt @nestjs/jwt bcrypt
npm install -D @types/passport-local @types/passport-jwt @types/bcrypt
```

2. **Atualizar o schema do Prisma (prisma/schema.prisma):**
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String
  refreshToken  String?   
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  // ... outros campos existentes
}
```

3. **Criar módulo de autenticação:**
```bash
cd server
nest g module auth
nest g controller auth
nest g service auth
```

### 2️⃣ Backend: Implementação da Autenticação

1. **Criar DTOs (src/auth/dto/):**

`login.dto.ts`:
```typescript
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
```

`register.dto.ts`:
```typescript
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
```

2. **Implementar estratégias (src/auth/strategies/):**

`local.strategy.ts`:
```typescript
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
```

`jwt.strategy.ts`:
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
```

3. **Implementar guards (src/auth/guards/):**

`jwt-auth.guard.ts`:
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

`local-auth.guard.ts`:
```typescript
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

4. **Implementar AuthService (src/auth/auth.service.ts):**
```typescript
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
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
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    try {
      const user = await this.prisma.user.create({
        data: {
          ...registerDto,
          password: hashedPassword,
        },
      });

      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }
}
```

5. **Implementar AuthController (src/auth/auth.controller.ts):**
```typescript
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

### 3️⃣ Backend: Configuração do Módulo

1. **Configurar AuthModule (src/auth/auth.module.ts):**
```typescript
@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

2. **Atualizar AppModule (src/app.module.ts):**
```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    // ... outros módulos
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 4️⃣ Frontend: Implementação da Autenticação

1. **Instalar dependências:**
```bash
cd client
npm install axios jwt-decode react-hook-form zod @hookform/resolvers/zod
```

2. **Criar contexto de autenticação (src/contexts/auth-context.tsx):**
```typescript
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: LoginCredentials) => {
    const response = await axios.post('/api/auth/login', credentials);
    const { access_token, user } = response.data;
    
    localStorage.setItem('token', access_token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validar token e recuperar usuário
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
```

3. **Criar hook personalizado (src/hooks/use-auth.ts):**
```typescript
export function useAuth() {
  return useContext(AuthContext);
}
```

4. **Criar componentes de autenticação:**

`src/components/auth/login-form.tsx`:
```typescript
export function LoginForm() {
  const { login } = useAuth();
  const form = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      // Redirecionar após login
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
}
```

5. **Criar middleware de proteção (src/middleware.ts):**
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### 5️⃣ Configuração Final e Testes

1. **Criar variáveis de ambiente:**

`.env` no backend:
```env
JWT_SECRET=sua_chave_secreta_muito_segura
JWT_EXPIRATION=1d
```

2. **Atualizar main.ts do backend:**
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  
  // ... outras configurações
}
```

3. **Testar endpoints de autenticação:**

```bash
# Registro
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"senha123","name":"Teste"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"senha123"}'
```

### 6️⃣ Próximos Passos

1. Implementar refresh token
2. Adicionar rate limiting
3. Implementar recuperação de senha
4. Adicionar validação de email
5. Implementar logout no backend
6. Adicionar testes de integração

### 🔍 Observações Importantes

1. **Segurança:**
   - Sempre use HTTPS em produção
   - Implemente rate limiting
   - Use cookies seguros para tokens
   - Valide todas as entradas
   - Implemente proteção contra CSRF

2. **Performance:**
   - Cache de usuários
   - Otimização de queries
   - Compressão de respostas

3. **UX:**
   - Feedback claro de erros
   - Loading states
   - Redirecionamentos suaves
   - Persistência de sessão

4. **Manutenção:**
   - Logs detalhados
   - Monitoramento de erros
   - Backup regular
   - Documentação atualizada
