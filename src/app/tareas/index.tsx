import { Ionicons } from '@expo/vector-icons';
import { eq } from 'drizzle-orm';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import * as schema from '../../db/schema';

export default function ListaTareasScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  
  // Usamos useLiveQuery para actualizar la lista automáticamente
  const { data: listaTareas } = useLiveQuery(drizzleDb.select().from(schema.tareas));

  const toggleTarea = async (id: number, estadoActual: boolean) => {
    await drizzleDb.update(schema.tareas)
      .set({ realizada: !estadoActual })
      .where(eq(schema.tareas.id, id));
  };

  const borrarTarea = async (id: number) => {
    await drizzleDb.delete(schema.tareas).where(eq(schema.tareas.id, id));
  };

  // --- CORRECCIÓN PANTALLA BLANCA ---
  // Si los datos aún no existen (undefined), mostramos el spinner
  if (!listaTareas) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="blue" />
            <Text style={{textAlign: 'center'}}>Cargando tareas...</Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listaTareas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Pressable onPress={() => toggleTarea(item.id, item.realizada || false)}>
              <Ionicons 
                name={item.realizada ? "checkbox" : "square-outline"} 
                size={24} 
                color="blue" 
              />
            </Pressable>

            {/* NOTA: La ruta debe coincidir con el nombre del archivo [id].tsx */}
            <Pressable 
              style={{ flex: 1, marginLeft: 10 }}
              onPress={() => router.push({ pathname: '/tareas/[id]', params: { id: item.id } })}
            >
              <Text style={{ 
                  fontSize: 18,
                  textDecorationLine: item.realizada ? 'line-through' : 'none',
                  color: item.realizada ? 'gray' : 'black' 
              }}>
                {item.titulo}
              </Text>
            </Pressable>

            <Pressable onPress={() => borrarTarea(item.id)}>
              <Ionicons name="trash" size={24} color="red" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No hay tareas guardadas.</Text>}
      />
      
      <Pressable 
        style={styles.fab}
        onPress={() => router.push({ pathname: '/tareas/[id]', params: { id: 'new' } })}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#ccc' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 50, height: 50, borderRadius: 25, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: 'white', fontSize: 30, lineHeight: 32 }
});