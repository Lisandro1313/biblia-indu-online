import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InicioScreen from '../screens/InicioScreen';
import DiosesScreen from '../screens/DiosesScreen';
import TextosScreen from '../screens/TextosScreen';
import type { MainStackParamList } from './types';

const Stack = createStackNavigator<MainStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: '#2a1500' },
  headerTintColor: '#FFB300',
  headerTitleStyle: { fontWeight: '700' as const },
};

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Inicio" component={InicioScreen} options={{ title: '🕉️ हिंदू धर्म' }} />
      <Stack.Screen name="Dioses" component={DiosesScreen} options={{ title: 'देवी-देवता' }} />
      <Stack.Screen name="Textos" component={TextosScreen} options={{ title: 'पवित्र ग्रंथ' }} />
    </Stack.Navigator>
  );
}
