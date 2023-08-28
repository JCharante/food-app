import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from "react";
import { Colors, Typography, Spacings, ThemeManager } from 'react-native-ui-lib';

import { LoginScreen } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { TokenContext } from './util/tokenContext'
import { ManageRestaurantsScreen } from './screens/ManageRestaurantsScreen';



Colors.loadColors({
    primaryColor: '#2364AA',
    secondaryColor: '#81C3D7',
    textColor: '##221D23',
    errorColor: '#E63B2E',
    successColor: '#ADC76F',
    warnColor: '##FF963C'
});

Typography.loadTypographies({
    heading: {fontSize: 36, fontWeight: '600'},
    subheading: {fontSize: 28, fontWeight: '500'},
    body: {fontSize: 18, fontWeight: '400'}
});

Spacings.loadSpacings({
    page: 20,
    card: 12,
    gridGutter: 16
});


ThemeManager.setComponentTheme('Card', {
    borderRadius: 8
});

const Stack = createNativeStackNavigator();


export default function App() {
    const [token, setToken] = React.useState('')
    // @ts-ignore
    return (
      <TokenContext.Provider value={{ token, setToken }}>
          <NavigationContainer>
              <Stack.Navigator initialRouteName="Home">
                  <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Goodies.vn Merchant' }}/>
                  <Stack.Screen name="ManageRestaurants" component={ManageRestaurantsScreen} options={{ title: 'Manage Restaurants' }}/>
              </Stack.Navigator>
          </NavigationContainer>
      </TokenContext.Provider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
