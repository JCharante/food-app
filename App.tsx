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
import { RestaurantScreen } from './screens/RestaurantScreen';
import { UpdateMenuScreen } from './screens/UpdateMenuScreen';
import {UpdateCategoryScreen} from "./screens/UpdateCategoryScreen";
import {RestaurantContext} from "./util/restaurantContext";
import { EditFoodScreen } from './screens/EditFoodScreen';



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
    const [restaurant, setRestaurant] = React.useState(null)
    // @ts-ignore
    return (
      <TokenContext.Provider value={{ token, setToken }}>
          <RestaurantContext.Provider value={{ restaurant, setRestaurant }}>
              <NavigationContainer>
                  <Stack.Navigator initialRouteName="Home">
                      <Stack.Screen name="Login"
                                    component={LoginScreen}
                                    options={{ headerShown: false }} />
                      <Stack.Screen name="Home"
                                    component={HomeScreen}
                                    options={{ title: 'Goodies.vn Merchant' }}/>
                      <Stack.Screen name="ManageRestaurants"
                                    component={ManageRestaurantsScreen}
                                    options={{ title: 'Manage Restaurants' }}/>
                      <Stack.Screen name="Restaurant"
                                    component={RestaurantScreen}
                                    options={{ title: restaurant?.name}}/>
                      <Stack.Screen name="UpdateMenu"
                                    component={UpdateMenuScreen}
                                    options={{ title: 'Update Menu' }}/>
                      <Stack.Screen name="UpdateCategoryScreen"
                                    component={UpdateCategoryScreen}
                                    options={{ title: 'Update Category'}}/>
                      <Stack.Screen name="EditFoodScreen"
                                    component={EditFoodScreen}
                                    options={{ title: 'Update Food' }}/>
                  </Stack.Navigator>
              </NavigationContainer>
          </RestaurantContext.Provider>
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
