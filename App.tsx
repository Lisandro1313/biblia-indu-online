import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MainStack from './src/navigation/MainStack';
import FavoritosScreen from './src/screens/FavoritosScreen';
import { FavoritosProvider } from './src/context/FavoritosContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <FavoritosProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#2a1500',
              borderTopColor: '#3a2500',
              paddingBottom: 8,
              paddingTop: 6,
              height: 62,
            },
            tabBarActiveTintColor: '#FFB300',
            tabBarInactiveTintColor: '#555',
            tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
          }}
        >
          <Tab.Screen
            name="MainTab"
            component={MainStack}
            options={{
              title: 'धर्म',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🕉️</Text>,
            }}
          />
          <Tab.Screen
            name="FavoritosTab"
            component={FavoritosScreen}
            options={{
              title: 'पसंदीदा',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>⭐</Text>,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </FavoritosProvider>
  );
}
