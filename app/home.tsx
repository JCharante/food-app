import {Stack, useRouter} from "expo-router";
import {ScrollView} from "react-native-gesture-handler";
import {View, Text, Card} from "react-native-ui-lib";
import {CardItem} from "../components/CardItem";
import {useContext} from "react";
import {TokenContext} from "../util/tokenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {trpc} from "../util/api";
import {getName} from "../util/utilities";

export default function Home() {
    const navigation = useRouter()
    const { setToken } = useContext(TokenContext)
    const browseRestaurantsReq = trpc.browseRestaurants.useQuery({})

    const logout = async () => {
        setToken('')
        await AsyncStorage.removeItem('token')
        navigation.push('/')
    }

    const restaurantCards = browseRestaurantsReq.data?.map((restaurant) => {
        return <CardItem
            key={restaurant.id}
            onPress={() => {navigation.push(`/customer/${restaurant.id}`)}}
        >
            <Card.Section imageSource={{ url: restaurant.pictureURL }}
                          imageStyle={{width: 96, height: 96}} />
            <View padding-15 flex>
                <Text text70 $textDefault>{getName(restaurant.names, 'en')}</Text>
                <Text></Text>
                <Text>108 Reviews (4.6)</Text>
            </View>
        </CardItem>
    })

    return (
        <ScrollView>
            <Stack.Screen options={{ title: 'Goodies.vn', headerBackVisible: false }}/>
            <View padding-15>
                { browseRestaurantsReq.data ? restaurantCards : <Text>Loading restaurants...</Text> }
                <CardItem
                    label="Merchant View"
                    color="action"
                    onPress={() => {navigation.push('/merchant')}}
                />
                <CardItem label="modal" color="action" onPress={() => {navigation.push('/modal')}}/>
                <CardItem
                    label="Sign out"
                    color="action"
                    onPress={logout}
                    />
            </View>
        </ScrollView>
    )
}