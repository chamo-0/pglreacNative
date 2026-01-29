import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function JuegosLayout() {
  //este layout se encarga de mostrar los botones de abajo y guiarnos a dichos juegos
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="blackjack" 
        options={{
          title: 'Blackjack',
          tabBarIcon: ({ color }) => <Ionicons name="card" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="acertar" 
        options={{
          title: 'Acertar Número',
          tabBarIcon: ({ color }) => <Ionicons name="help-circle" size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}