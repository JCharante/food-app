import {View, Text} from "react-native-ui-lib";
import {useContext, useEffect, useState} from "react";
import {getRestaurants} from "../util/api";
import {TokenContext} from "../util/tokenContext";
import {IGetUserRestaurantsObject} from "../util/types";
import {Pressable} from "react-native";
import {RestaurantContext} from "../util/restaurantContext";
import {CardItem} from "../components/CardItem";

export const RestaurantScreen = ({ navigation, route  }) => {
    const { token } = useContext(TokenContext)
    const { restaurant, setRestaurant } = useContext(RestaurantContext)

    useEffect(() => {
        // Fetch data on page load / when token changes
        (async () => {
            if (token === '') return

            const data = await getRestaurants(token)
            const shop = data[data.findIndex((r) => r._id === restaurant._id)]
            setRestaurant(shop)
        })()
    }, [token])


    return <View padding-10>
        <Text>Restaurant Name: {restaurant.name}</Text>
        <Text>Address: {restaurant.address}</Text>

        <CardItem onPress={() => { navigation.navigate('UpdateMenu') }} label="Edit Menu"/>
    </View>
}