import {View, Text} from "react-native-ui-lib";
import {CardItem} from "../../components/CardItem";
import {getName} from "../../util/utilities";
import {trpc} from "../../util/api";

export const RestaurantScreen = ({ navigation, route  }) => {
    const restaurantID = route.params.restaurantID
    const restaurants = trpc.userGetRestaurants.useQuery()
    if (!restaurants.data) return <View><Text>Loading...</Text></View>

    const data = restaurants.data

    const shop = data[data.findIndex((r) => r._id.toString() === restaurantID)]

    return <View padding-10>
        <Text>Restaurant Name: {getName(shop.names, 'en')}</Text>
        <Text>Address: {shop.address}</Text>

        <CardItem onPress={() => { navigation.navigate('UpdateMenu', { restaurantID }) }} label="Edit Menu"/>
    </View>
}