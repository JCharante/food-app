import {View, Text} from "react-native";
import {getName, tw} from "../../../util/utilities";
import {Stack, useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {GoodiesBox} from "../../../components/GoodiesBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useContext} from "react";
import {TokenContext} from "../../../util/tokenContext";
import {trpc} from "../../../util/api";

export default function IndexPage() {
    const navigation = useRouter()
    const { setToken } = useContext(TokenContext)
    const browseRestaurantsReq = trpc.browseRestaurants.useQuery({})

    const logout = async () => {
        setToken('')
        await AsyncStorage.removeItem('token')
        navigation.push('/')
    }

    const restaurantCards = browseRestaurantsReq.data?.map((restaurant) => {
        // return <CardItem
        //     key={restaurant.id}
        //     onPress={() => {navigation.push(`/customer/${restaurant.id}`)}}
        // >
        //     <Card.Section imageSource={{ url: restaurant.pictureURL }}
        //                   imageStyle={{width: 96, height: 96}} />
        //     <View padding-15 flex>
        //         <Text text70 $textDefault>{getName(restaurant.names, 'en')}</Text>
        //         <Text></Text>
        //         <Text>108 Reviews (4.6)</Text>
        //     </View>
        // </CardItem>
        return <GoodiesBox key={restaurant.id}
                           text={getName(restaurant.names, 'en')}
                           onPress={() => {navigation.push(`/customer/${restaurant.id}`)}}/>
    })

    return <SafeAreaView style={tw`bg-background flex-1 flex px-4`}>
        <Stack.Screen options={{ headerShown: false }}/>
        <View style={tw`flex flex-row justify-center mb-[14] mt-2`}>
            <Text style={tw`font-semibold text-primary-800 text-lg`}>Manage</Text>
        </View>
        <View style={tw`flex bg-white h-[156px] shadow-sm rounded-xl`}>
            <View style={tw`justify-start`}>
                <Text style={tw`text-neutral-600 font-semibold text-xs mt-[17px] ml-[13px]`}>Member No:</Text>
            </View>
            <View style={tw`mt-[5px]`}>
                <Text style={tw`ml-[13px] text-primary-600 font-semibold text-lg`}>145-847-2848</Text>
            </View>
            <View style={tw`flex flex-1`}></View>
            <View style={tw`flex flex-row mb-3 justify-end`}>
                <Text style={tw`pr-3 text-primary-600 font-semibold text-xs`}>GOODIES.COM.VN</Text>
            </View>
        </View>
        <View style={tw`flex flex-col pt-3`}>
            <GoodiesBox text="Sign out" onPress={logout}/>
            <GoodiesBox text="Merchant View" onPress={() => {navigation.push('/merchant')}}/>
            <GoodiesBox text="modal" onPress={() => {navigation.push('/modal')}}/>
            { browseRestaurantsReq.data ? restaurantCards : <Text>Loading restaurants...</Text> }
        </View>
    </SafeAreaView>
}