import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import * as schema from '../../db/schema';

export default function EditarTareaScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  
  const [titulo, setTitulo] = useState('');

  // Cargar datos si es edición
  useEffect(() => {
    if (id !== 'new') {
      const cargarTarea = async () => {
        const tarea = await drizzleDb.query.tareas.findFirst({
          where: eq(schema.tareas.id, Number(id))
        });
        if (tarea) setTitulo(tarea.titulo);
      };
      cargarTarea();
    }
  }, [id]);

  const guardar = async () => {
    if (id === 'new') {
      await drizzleDb.insert(schema.tareas).values({ titulo: titulo, realizada: false });
    } else {
      await drizzleDb.update(schema.tareas)
        .set({ titulo: titulo })
        .where(eq(schema.tareas.id, Number(id)));
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{id === 'new' ? 'Nueva Tarea' : 'Editar Tarea'}</Text>
      <TextInput 
        style={styles.input} 
        value={titulo} 
        onChangeText={setTitulo} 
        placeholder="Descripción de la tarea"
      />
      <Button title="Guardar" onPress={guardar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 20, borderRadius: 5 }
});