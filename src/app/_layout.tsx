import { drizzle } from "drizzle-orm/expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense } from 'react';
import { ActivityIndicator } from "react-native";
// IMPORTANTE: Esta importación ahora funcionará porque has hecho el paso 2
import migrations from "../../drizzle/migrations";

const DATABASE_NAME = 'proyectoFinal.db';

export default function RootLayout() {
  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        // 👇 AÑADE ESTA LÍNEA EXACTA AQUÍ 👇
        options={{ enableChangeListener: true }}
        // 👆 ES OBLIGATORIA PARA QUE SE ACTUALICE LA LISTA SOLA
        useSuspense
        onInit={async (database) => {
          const db = drizzle(database);
          await migrate(db, migrations);
        }}
      >
        <Stack screenOptions={{ headerShown: false }}>
           {/* ... resto del código ... */}
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}