// /lib/db.ts
/**
 * 1. 클라이언트가 Prisma Client를 Fast Refresh마다 생성하지 않도록 global 객체에 인스턴스를 저장하는 방식으로 Singleton 패턴 적용함
 * https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
 * 2. 필요한 경우, PrismaClient의 설정(로깅 등)을 여기서 할 수 있음.
 *
 */
import {PrismaClient} from '@prisma/client';

const prismaClientSingleton = () => {
    if (process.env.NODE_ENV === 'development') {
        const prisma = new PrismaClient({
            log: [
                {
                    emit: 'event',
                    level: 'query',
                },
                {
                    emit: 'stdout',
                    level: 'error',
                },
                {
                    emit: 'stdout',
                    level: 'info',
                },
                {
                    emit: 'stdout',
                    level: 'warn',
                },
            ],
        });

        // event listenr only for serverside
        if (
            process.env.NODE_ENV === 'development' &&
            typeof window === 'undefined'
        ) {
            prisma.$on('query', (e) => {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log(`Query: ${e.query}`);
                console.log(`Params: ${e.params}`);
                console.log(`Duration: ${e.duration}ms`);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            });
        }

        return prisma;
    } else {
        const prisma = new PrismaClient();
        return prisma;
    }
};

// 함수의 반환 타입을 자동으로 추론
declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export {prisma};
