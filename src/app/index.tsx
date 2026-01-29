
import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proyecto React Native</Text>
    {/*views con los botones y el onpress para ir a las carpetas*/}
      <View style={styles.buttonContainer}>
        <Button 
          title="Ir a Juegos (Tabs)" 
          onPress={() => router.push('../(juegos)/blackjack')} 
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Lista de Tareas (Stack)" 
          onPress={() => router.push('../tareas')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  buttonContainer: { width: '80%', marginVertical: 10 }
});