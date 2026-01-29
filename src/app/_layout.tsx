import { drizzle } from "drizzle-orm/expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense } from 'react';
import { ActivityIndicator } from "react-native";
import migrations from "../../drizzle/migrations";

const DATABASE_NAME = 'proyectoFinal.db';
/*esta parte se encarga de conectar con la base de datos y cargarla antes de mostrar toda la app.*/
export default function RootLayout() {
  return (
    // le pasamos el nombre, junto a la opcion para que "escuche" lo que haya nuevo en la base de datos
    // ademas del on init para evitar que muestre algo antes de hacer la coneccion y la migracion
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense
        onInit={async (database) => {
          const db = drizzle(database);
          await migrate(db, migrations);
        }}>
        <Stack screenOptions={{ headerShown: false }}></Stack>
      </SQLiteProvider>
    </Suspense>
  );
}