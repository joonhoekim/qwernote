import 'dotenv/config';
import {drizzle} from 'drizzle-orm/node-postgres';

import {schema} from './schema/schema';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

// 데이터베이스 연결 설정
const connectionPool = postgres(process.env.DATABASE_URL, {
    max: 20,
    min: 5,
    idle_timeout: 30,
    connect_timeout: 10,
});

export const db = drizzle(connectionPool, {schema});
