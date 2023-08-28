import {Card, View, Text} from "react-native-ui-lib";
import {useContext, useEffect, useState} from "react";
import {RestaurantContext} from "../../util/restaurantContext";
import {getName} from "../../util/utilities";
import { trpc } from '../../util/api'
import {useRefetchOnFocus} from "../../util/hooks";
import {Stack, useRouter} from "expo-router";

export const ManageRestaurantsScreen = () => {
    const navigation = useRouter()
    const { setRestaurant } = useContext(RestaurantContext)

    const restaurants = trpc.userGetRestaurants.useQuery()
    useRefetchOnFocus(restaurants.refetch)
    if (!restaurants.data) return <View>
        <Stack.Screen options={{ title: 'Manage Restaurants' }}/>
        <Text>Loading...</Text>
    </View>


    return <View padding-10>
        <Stack.Screen options={{ title: 'Manage Restaurants' }}/>
        <Text>Your Restaurants:</Text>
        <View marginT-10>
        {restaurants.data.map((restaurant) => {
            return <Card key={restaurant.id}
                         style={{ marginBottom: 10 }}
                         row
                         height={90}
                         borderRadius={20}
                         onPress={() => {
                             setRestaurant(restaurant)
                             navigation.push(`/merchant/restaurant/${restaurant.id}`)}
                         }
            >
                <Card.Section imageSource={{ url: restaurant.pictureURL }}
                              imageStyle={{width: 96, height: 96}} />
                <View padding-15 flex>
                    <Text text70 $textDefault>{getName(restaurant.names, 'en')}</Text>
                    <Text></Text>
                    <Text>108 Reviews (4.3)</Text>
                </View>
            </Card>
        })}
        </View>
    </View>
}

export default ManageRestaurantsScreen