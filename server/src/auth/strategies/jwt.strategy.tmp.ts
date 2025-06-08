import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Fornecer um valor padrão para evitar undefined
    const secretKey =
      process.env.JWT_SECRET || 'fallback_secret_for_development';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  // Define o tipo de retorno explicitamente
  async validate(payload: any): Promise<{ id: string; email: string }> {
    return {
      id: payload.sub as string,
      email: payload.email as string,
    };
  }
}
