import { StatusBar } from 'expo-status-bar';
import {AppStateStatus, Platform, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, {useEffect} from "react";
import { Colors, Typography, Spacings, ThemeManager } from 'react-native-ui-lib';
import { LoginScreen } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/merchant/HomeScreen";
import { TokenContext } from './util/tokenContext'
import { ManageRestaurantsScreen } from './screens/merchant/ManageRestaurantsScreen';
import { RestaurantScreen } from './screens/merchant/RestaurantScreen';
import { UpdateMenuScreen } from './screens/merchant/UpdateMenuScreen';
import {UpdateCategoryScreen} from "./screens/merchant/UpdateCategoryScreen";
import {RestaurantContext} from "./util/restaurantContext";
import { EditFoodScreen } from './screens/merchant/EditFoodScreen';
import { CreateCategoryScreen } from "./screens/merchant/CreateCategoryScreen";
import { AllFoodsScreen } from "./screens/merchant/AllFoodsScreen";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from './util/api';
import {registerRootComponent} from "expo";
import { CreateFoodScreen } from './screens/merchant/CreateFoodScreen';
import { CreateFoodAddonScreen } from './screens/merchant/CreateFoodAddonScreen';
import {ViewAllFoodAddonsScreen} from "./screens/merchant/ViewAllFoodAddonsScreen";
import {CreateFoodAddonCategoryScreen} from "./screens/merchant/menu/addons/CreateFoodAddonCategoryScreen";
import {EditAddonCategory} from "./screens/merchant/menu/addons/EditAddonCategory";


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
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient, setTrpcClient] = useState(() =>
        trpc.createClient({
            transformer: undefined,
            links: [
                httpBatchLink({
                    url: 'http://localhost:3000/trpc',
                }),
            ]
        }),
    );

    useEffect(() => {
        setTrpcClient(() =>
            trpc.createClient({
                transformer: undefined,
                links: [
                    httpBatchLink({
                        url: 'http://localhost:3000/trpc',
                        // optional
                        headers() {
                            return {
                                authorization: `Bearer ${token}`,
                            };
                        },
                    }),
                ]
            }),
        )
    }, [token])

    // @ts-ignore
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <TokenContext.Provider value={{ token, setToken }}>
                  <RestaurantContext.Provider value={{ restaurant, setRestaurant }}>
                      <NavigationContainer>
                          <Stack.Navigator initialRouteName="Home">
                              {/* Addons */}
                              <Stack.Screen name="ViewAllFoodAddons"
                                            component={ViewAllFoodAddonsScreen}
                                            options={{ title: 'All Food Addons' }}/>
                              <Stack.Screen name="CreateFoodAddon"
                                            component={CreateFoodAddonScreen}
                                            options={{ title: 'Create Food Addon' }}/>
                              {/* Addon Categories */}
                              <Stack.Screen name="CreateFoodAddonCategory"
                                            component={CreateFoodAddonCategoryScreen}
                                            options={{ title: 'Create Food Addon Category' }}/>
                              <Stack.Screen name="EditAddonCategory"
                                            component={EditAddonCategory}
                                            options={{ title: 'Edit Food Addon Category'}}/>
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
                              <Stack.Screen name="AllFoods"
                                            component={AllFoodsScreen}
                                            options={{ title: 'All Foods' }}/>
                              <Stack.Screen name="CreateCategory"
                                            component={CreateCategoryScreen}
                                            options={{ title: 'CreateCategory' }}/>
                              <Stack.Screen name="UpdateCategoryScreen"
                                            component={UpdateCategoryScreen}
                                            options={{ title: 'Update Category'}}/>
                              <Stack.Screen name="CreateFood"
                                            component={CreateFoodScreen}
                                            options={{ title: 'Create Food' }}/>
                              <Stack.Screen name="EditFoodScreen"
                                            component={EditFoodScreen}
                                            options={{ title: 'Update Food' }}/>
                          </Stack.Navigator>
                      </NavigationContainer>
                  </RestaurantContext.Provider>
              </TokenContext.Provider>
            </QueryClientProvider>
        </trpc.Provider>
    );
}

registerRootComponent(App)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
