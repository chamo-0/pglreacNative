import { Stack } from 'expo-router';

export default function TareasLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Mis Tareas' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar Tarea' }} />
    </Stack>
  );
}