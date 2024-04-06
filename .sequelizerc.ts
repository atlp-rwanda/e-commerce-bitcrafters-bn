import * as path from 'path';

interface DatabaseConfig {
  config: string;
  'models-path': string;
  'seeders-path': string;
  'migrations-path': string;
}

const databaseConfig: DatabaseConfig = {
  config: path.resolve('src', 'config', 'database.js'),
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('src', 'seeders'),
  'migrations-path': path.resolve('src', 'migrations')
};

export default databaseConfig;
