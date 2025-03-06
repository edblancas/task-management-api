import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '5432'),
	username: process.env.DB_USERNAME || 'postgres',
	password: process.env.DB_PASSWORD || 'postgres',
	database: process.env.DB_DATABASE || 'task_management',
	synchronize: process.env.NODE_ENV === 'development', // Only enable in development
	logging: process.env.NODE_ENV === 'development',
	entities: [join(__dirname, 'entities', '*.js')],
	migrations: [join(__dirname, 'migrations', '*.js')],
	subscribers: [join(__dirname, 'subscribers', '*.js')],
});

export const initializeDatabase = async () => {
	try {
		await AppDataSource.initialize();
		console.log('Database connection established successfully');
	} catch (error) {
		console.error('Error during database initialization:', error);
		throw error;
	}
};

export default AppDataSource;
