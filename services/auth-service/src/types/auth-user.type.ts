import { z } from 'zod';
import { createAuthUserDto } from '../dtos/auth-user.dto';

export type AuthUser = z.infer<typeof createAuthUserDto>;
