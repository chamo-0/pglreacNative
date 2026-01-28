import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as schema from '../../db/schema';
import { partidas } from '../../db/schema';

export default function AcertarNumeroScreen() {
  // Database Context
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  // Estados
  const [nick, setNick] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [numeroSecreto, setNumeroSecreto] = useState(0);
  const [intentos, setIntentos] = useState<number[]>([]);
  const [vistaRango, setVistaRango] = useState<boolean>(true); // true = ver rangos (0-9), false = ver numeros (20,21...)
  const [rangoSeleccionado, setRangoSeleccionado] = useState(0); // El inicio del rango (ej: 20)
  const [historial, setHistorial] = useState<any[]>([]);
  const [verHistorial, setVerHistorial] = useState(false);

  // Iniciar juego
  useEffect(() => {
    reiniciarJuego();
  }, []);

  const reiniciarJuego = () => {
    setNumeroSecreto(Math.floor(Math.random() * 101)); // 0 a 100
    setIntentos([]);
    setVistaRango(true);
  };

  const handleLogin = () => {
    if (nick.trim().length > 0) setIsLoggedIn(true);
  };

  const seleccionarRango = (inicio: number) => {
    setRangoSeleccionado(inicio);
    setVistaRango(false);
  };

  const hacerApuesta = async (numero: number) => {
    const nuevosIntentos = [...intentos, numero];
    setIntentos(nuevosIntentos);
    setVistaRango(true); // Volver a mostrar rangos tras apostar

    if (numero === numeroSecreto) {
      Alert.alert("¡Ganaste!", `El número era ${numeroSecreto}.`);
      // Guardar en DB (Pág 44-46)
      await drizzleDb.insert(partidas).values({
        nick: nick,
        numeroSecreto: numeroSecreto,
        intentos: JSON.stringify(nuevosIntentos)
      });
      reiniciarJuego();
    } else {
      let pista = numero < numeroSecreto ? "mayor" : "menor";
      Alert.alert("Fallaste", `El número secreto es ${pista} que ${numero}`);
    }
  };

  const cargarHistorial = async () => {
    const data = await drizzleDb.select().from(partidas);
    setHistorial(data);
    setVerHistorial(true);
  };

  // --- RENDERIZADO ---

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login Jugador</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Introduce tu Nick" 
          value={nick} 
          onChangeText={setNick} 
        />
        <Button title="Entrar" onPress={handleLogin} />
      </View>
    );
  }

  if (verHistorial) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Historial de Partidas</Text>
        <FlatList
          data={historial}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>Jugador: {item.nick}</Text>
              <Text>Secreto: {item.numeroSecreto}</Text>
              <Text>Intentos: {item.intentos}</Text>
            </View>
          )}
        />
        <Button title="Volver al Juego" onPress={() => setVerHistorial(false)} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.gameContainer}>
      <Text style={styles.title}>Hola, {nick}</Text>
      <Text>Intentos: {intentos.join(', ')}</Text>
      
      <Button title="Ver Historial" onPress={cargarHistorial} color="gray" />

      <Text style={styles.subtitle}>
        {vistaRango ? "Selecciona un Rango" : `Selecciona número (${rangoSeleccionado}-${rangoSeleccionado+9})`}
      </Text>

      <View style={styles.grid}>
        {vistaRango ? (
          // Generar botones de rangos: 0-9, 10-19...
          Array.from({ length: 11 }, (_, i) => i * 10).map((inicio) => {
             if (inicio > 100) return null; // Limite 100
             const fin = inicio === 100 ? 100 : inicio + 9;
             return (
               <View key={inicio} style={styles.btnWrapper}>
                 <Button 
                   title={`${inicio}-${fin}`} 
                   onPress={() => seleccionarRango(inicio)} 
                 />
               </View>
             )
          })
        ) : (
          // Generar botones de números específicos dentro del rango
          Array.from({ length: 10 }, (_, i) => rangoSeleccionado + i).map((num) => {
            if (num > 100) return null;
            return (
              <View key={num} style={styles.btnWrapper}>
                <Button 
                  title={`${num}`} 
                  onPress={() => hacerApuesta(num)} 
                  color="orange"
                />
              </View>
            )
          })
        )}
      </View>
      
      {!vistaRango && (
        <Button title="Volver a Rangos" onPress={() => setVistaRango(true)} color="red" />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  gameContainer: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, marginVertical: 10 },
  input: { borderWidth: 1, padding: 10, width: '100%', marginBottom: 10, borderRadius: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 20 },
  btnWrapper: { width: '30%', margin: 5 },
  card: { padding: 10, borderWidth: 1, marginVertical: 5, borderRadius: 5, backgroundColor: '#eee' }
});