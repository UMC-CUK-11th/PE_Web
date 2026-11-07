import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return mysql.createPool({
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        user: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'study'),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    },
  },
];
