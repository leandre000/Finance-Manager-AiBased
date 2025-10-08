type Env = NodeJS.ProcessEnv & {
  PORT?: string;
  NODE_ENV?: string;
  POSTGRES_HOST?: string;
  POSTGRES_PORT?: string;
  POSTGRES_DB?: string;
  POSTGRES_USER?: string;
  POSTGRES_PASSWORD?: string;
  RABBITMQ_URL?: string;
  MINIO_ENDPOINT?: string;
  MINIO_PORT?: string;
  MINIO_USE_SSL?: string;
  MINIO_ACCESS_KEY?: string;
  MINIO_SECRET_KEY?: string;
  MINIO_BUCKET?: string;
};

export function validateEnv(env: Env) {
  const errors: string[] = [];

  const get = (key: keyof Env, fallback?: string): string => {
    const value = env[key] ?? fallback;
    if (value === undefined || value === null || value === '') {
      errors.push(`Missing required env: ${String(key)}`);
      return '';
    }
    return String(value);
  };

  const toInt = (value: string, key: string): number => {
    const n = Number(value);
    if (!Number.isInteger(n) || Number.isNaN(n)) {
      errors.push(`Invalid integer for ${key}: ${value}`);
      return 0;
    }
    return n;
  };

  const config = {
    port: toInt(get('PORT', '3000'), 'PORT'),
    nodeEnv: get('NODE_ENV', 'development'),
    postgres: {
      host: get('POSTGRES_HOST', 'localhost'),
      port: toInt(get('POSTGRES_PORT', '5432'), 'POSTGRES_PORT'),
      db: get('POSTGRES_DB', 'fima'),
      user: get('POSTGRES_USER', 'fima'),
      password: get('POSTGRES_PASSWORD', 'secret')
    },
    rabbitmqUrl: get('RABBITMQ_URL', 'amqp://fima:secret@localhost:5672'),
    minio: {
      endpoint: get('MINIO_ENDPOINT', 'localhost'),
      port: toInt(get('MINIO_PORT', '9000'), 'MINIO_PORT'),
      useSsl: get('MINIO_USE_SSL', 'false') === 'true',
      accessKey: get('MINIO_ACCESS_KEY', 'fima'),
      secretKey: get('MINIO_SECRET_KEY', 'secret123'),
      bucket: get('MINIO_BUCKET', 'receipts')
    }
  } as const;

  if (errors.length > 0) {
    throw new Error(`Invalid environment configuration:\n- ${errors.join('\n- ')}`);
  }

  return config;
}
