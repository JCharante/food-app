import {Card, View, Text} from "react-native-ui-lib";
import {useContext, useEffect, useState} from "react";
import { getUserRestaurants } from '@goodies-tech/api'
import {TokenContext} from "../util/tokenContext";
import {RestaurantContext} from "../util/restaurantContext";
import {IRestaurantV1} from "@goodies-tech/api";

export const ManageRestaurantsScreen = ({ navigation }) => {
    const { token } = useContext(TokenContext)
    const { setRestaurant } = useContext(RestaurantContext)
    const [restaurants, setRestaurants] = useState<Array<IRestaurantV1>>([])

    useEffect(() => {
        // Fetch data on page load / when token changes
        (async () => {
            if (token === '') return

            const data = await getUserRestaurants(token)
            setRestaurants(data)
        })()
    }, [token])

    return <View padding-10>
        <Text>Your Restaurants:</Text>
        <View marginT-10>
        {restaurants.map((restaurant) => {
            return <Card key={restaurant._id.toString()}
                         style={{ marginBottom: 10 }}
                         row
                         height={90}
                         borderRadius={20}
                         onPress={() => {
                             setRestaurant(restaurant)
                             navigation.navigate('Restaurant')}
                         }
            >
                <Card.Section imageSource={{ url: 'https://placekitten.com/250/250'}}
                              imageStyle={{width: 96, height: 96}} />
                <View padding-15 flex>
                    <Text text70 $textDefault>{restaurant.name}</Text>
                    <Text></Text>
                    <Text>108 Reviews (4.3)</Text>
                </View>
            </Card>
        })}
        </View>
    </View>
}