import {View, Text} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import { CardItem } from "../../../../../../components/CardItem";
import {getName} from "../../../../../../util/utilities";
import {trpc} from "../../../../../../util/api";
import {useRefetchOnFocus} from "../../../../../../util/hooks";
import {Stack, useRouter, useSearchParams} from "expo-router";

const ViewWrapper = ({ children }) => {
    return <ScrollView>
        <Stack.Screen options={{ title: 'All Addons' }}/>
        {children}
    </ScrollView>
}

export const AllFoodAddons = ({ route }) => {
    const navigation = useRouter()
    const restaurantID = useSearchParams().restaurantID?.toString() || ''
    const addons = trpc.getRestaurantFoodAddons.useQuery({ restaurantID })
    useRefetchOnFocus(addons.refetch)
    const addonCatReq = trpc.getRestaurantAddonCategories.useQuery({ restaurantID })
    useRefetchOnFocus(addonCatReq.refetch)

    if (!addons.data || !addonCatReq.data) return <ViewWrapper><Text>Loading...</Text></ViewWrapper>

    return <ViewWrapper>
        <View padding-15>
            <View marginT-10>
                <Text style={{ fontSize: 20 }}>Food Addon Categories:</Text>
                <Text>Edit a Food to attach a Food Addon Category.</Text>
                {addonCatReq.data.map((addonCat) => {
                    return <CardItem key={addonCat._id}>
                        <View padding-15 flex>
                            <Text>{getName(addonCat.names, 'en')}</Text>
                        </View>
                        <View flex
                              right>
                            <Text onPress={() => navigation.push(`/merchant/restaurant/${restaurantID}/menu/addonCategory/${addonCat._id}`)}>Edit</Text>
                        </View>
                    </CardItem>
                })}
                <CardItem
                    label="Create Food Addon Category"
                    color="action"
                    onPress={() => navigation.push(`/merchant/restaurant/${restaurantID}/menu/addonCategory/new`)}
                />
                <Text style={{ fontSize: 20 }}>Food Addons:</Text>
                <Text>Edit a Food Addon Category to attach a Food Addon.</Text>
                {addons.data.map((addon) => {
                    return <CardItem key={addon._id}>
                        <View padding-15 flex>
                            <Text>{getName(addon.names, 'en')}</Text>
                        </View>
                        <View flex
                              right>
                            <Text onPress={() => navigation.push(`/merchant/restaurant/${restaurantID}/menu/addons/${addon._id}`)}>Edit</Text>
                        </View>
                    </CardItem>
                })}
                <CardItem
                    label="Create Food Addon"
                    color="action"
                    onPress={() => navigation.push(`/merchant/restaurant/${restaurantID}/menu/addons/new`)}
                />
            </View>
        </View>
    </ViewWrapper>
}

export default AllFoodAddons