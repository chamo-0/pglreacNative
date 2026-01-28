import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo', // <--- ¡Asegúrate de que esta línea esté activa! [cite: 1035]
} satisfies Config;