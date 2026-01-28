import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({})

type Props = {}

const GPS = (props: Props) => {
    const [position, setPosition] = useState<Location.LocationObject | null>(null);
    const [subscription, setSubscription] = useState<Location.LocationSubscription | null>(null);
    const startLocationTracking = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('permiso no concedido'); return;
        }
        const locationSubscription = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 1000, // observamos cada segundo
            },
            (newLocation) => { setPosition(newLocation); },
        );
        setSubscription(locationSubscription);
    };
    const stopLocationTracking = () => {
        subscription?.remove(); //desactivamos la suscripción
        setSubscription(null);
    };
    useEffect(() => {
        startLocationTracking(); //lanzamos la suscripción al iniciar el componente
        return () => {
            stopLocationTracking(); //eliminamos la suscripción
        };
    }, []);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}> GPS</Text>
            {position ? (
                <View >
                    <Text >Latitude: {position.coords.latitude}</Text>
                    <Text >
                        Longitude: {position.coords.longitude}
                    </Text>
                    <Text >Altitude: {position.coords.altitude}</Text>
                    <Text >Speed: {position.coords.speed}</Text>
                    <Text >
                        Timestamp: {new Date(position.timestamp).toLocaleString()}
                    </Text>
                </View>
            ) : (<Text>loading</Text>)}
        </View>
    );
}

export default GPS