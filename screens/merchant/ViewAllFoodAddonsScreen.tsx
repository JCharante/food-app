import {View, Text} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import { CardItem } from "../../components/CardItem";
import {getName} from "../../util/utilities";
import {trpc} from "../../util/api";
import {useRefetchOnFocus} from "../../util/hooks";

export const ViewAllFoodAddonsScreen = ({ navigation, route }) => {
    const restaurantID = route.params.restaurantID
    const addons = trpc.getRestaurantFoodAddons.useQuery({ restaurantID })
    useRefetchOnFocus(addons.refetch)
    const addonCatReq = trpc.getRestaurantAddonCategories.useQuery({ restaurantID })
    useRefetchOnFocus(addonCatReq.refetch)

    if (!addons.data || !addonCatReq.data) return <View><Text>Loading...</Text></View>

    return <ScrollView >
        <View padding-15>
            <View marginT-10>
                <Text style={{ fontSize: 20 }}>Food Addons:</Text>
                <Text>Edit a Food to attach a Food Addon Category.</Text>
                {addonCatReq.data.map((addonCat) => {
                    return <CardItem key={addonCat._id}>
                        <View padding-15 flex>
                            <Text>{getName(addonCat.names, 'en')}</Text>
                        </View>
                        <View flex
                              right>
                            <Text onPress={() => navigation.navigate(
                                'EditAddonCategory',
                                {
                                    restaurantID,
                                    addonCategoryID: addonCat._id
                                }
                            )}>Edit</Text>
                        </View>
                    </CardItem>
                })}
                <CardItem
                    label="Create Food Addon Category"
                    color="action"
                    onPress={() => navigation.navigate('CreateFoodAddonCategory', { restaurantID })}
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
                            <Text onPress={() => navigation.navigate(
                                'EditFoodScreen',
                                {
                                    restaurantID
                                }
                            )}>Edit</Text>
                        </View>
                    </CardItem>
                })}
                <CardItem
                    label="Create Food Addon"
                    color="action"
                    onPress={() => navigation.navigate('CreateFoodAddon', { restaurantID })}
                />
            </View>
        </View>
    </ScrollView>
}
