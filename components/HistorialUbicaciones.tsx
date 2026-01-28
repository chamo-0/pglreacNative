import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

type LocationItem = {
  latitude: number;
  longitude: number;
  timestamp: number;
  address: string;
};

const historialUbicaciones = () => {
  const [position, setPosition] = useState<Location.LocationObject | null>(null);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<LocationItem[]>([]);

  const startLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso de localización no concedido');
      return;
    }

    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
      },
      (newLocation) => {
        setPosition(newLocation);
      }
    );
  };

  const saveLocation = async () => {
    if (!position) return;
    const address = await getStreetName(
    position.coords.latitude,
    position.coords.longitude
    );

    const newLocation: LocationItem = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: position.timestamp,
      address,
      
    };

    const storedData = await AsyncStorage.getItem('historial');
    const locations = storedData ? JSON.parse(storedData) : [];

    locations.push(newLocation);

    await AsyncStorage.setItem('historial', JSON.stringify(locations));

    setMessage(
      `Ubicación guardada:\nLat: ${newLocation.latitude}\nLng: ${newLocation.longitude}`
    );
  };
  const getStreetName = async (lat: number, lng: number) => {
    try {
    const result = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });

    if (result.length > 0) {
      const address = result[0];

      return `${address.street ?? ''} ${address.streetNumber ?? ''}, ${address.city ?? ''}`;
    }

    return 'Dirección no encontrada';
  } catch (error) {
    console.error(error);
    return 'Error obteniendo dirección';
  }
};

  const loadHistory = async () => {
    const storedData = await AsyncStorage.getItem('historial');
    const locations = storedData ? JSON.parse(storedData) : [];
    setHistory(locations);
  };

  useEffect(() => {
    startLocationTracking();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GPS</Text>

      {position ? (
        <View>
          <Text>Latitud: {position.coords.latitude}</Text>
          <Text>Longitud: {position.coords.longitude}</Text>
          <Text>
            Timestamp: {new Date(position.timestamp).toLocaleString()}
          </Text>
        </View>
      ) : (
        <Text>Cargando ubicación...</Text>
      )}

      <View style={styles.buttons}>
        <Button title="Guardar ubicación" onPress={saveLocation} />
        <Button title="Historial" onPress={loadHistory} />
      </View>

      {message !== '' && <Text style={styles.message}>{message}</Text>}

      <ScrollView style={styles.history}>
        {history.map((item, index) => (
          <Text key={index}>
            📍 {item.latitude}, {item.longitude}, {item.address} —{' '}
            {new Date(item.timestamp).toLocaleString()}
           
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

export default historialUbicaciones;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttons: {
    marginVertical: 20,
    gap: 10,
  },
  message: {
    marginVertical: 10,
    fontWeight: 'bold',
    color: 'green',
  },
  history: {
    marginTop: 10,
  },
});
