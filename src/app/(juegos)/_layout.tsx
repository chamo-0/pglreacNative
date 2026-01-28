import { Ionicons } from '@expo/vector-icons'; // Pág 28
import { Tabs } from 'expo-router';

export default function JuegosLayout() {
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