import { DefaultSession } from 'next-auth';
import { UserRole } from '@prisma/client';

declare module 'next-auth' {
    interface User {
        role?: UserRole;
    }

    interface Session {
        user: User & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role: UserRole;
    }
}
