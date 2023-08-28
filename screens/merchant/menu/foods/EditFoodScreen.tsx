import {View, Text, Incubator} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import {KeyboardAvoidingView} from "react-native";
import {useContext, useEffect, useState} from "react";
import {TokenContext} from "../../../../util/tokenContext";
import {RestaurantContext} from "../../../../util/restaurantContext";
import {AppRouter } from "@goodies-tech/api";
import {getName} from "../../../../util/utilities";
import {trpc} from "../../../../util/api";
import {inferRouterOutputs} from "@trpc/server";
import {InternalTextField} from "../../../../components/InternalTextField";
import {CardItem} from "../../../../components/CardItem";

const { TextField } = Incubator

export const EditFoodScreen = ({ route }) => {
    const { foodItemID, restaurantID } = route.params
    const [names, setNames] = useState({
        'en': '',
        'vi': ''
    })
    const [descriptions, setDescriptions] = useState({
        'en': '',
        'vi': ''
    })
    const [price, setPrice] = useState(0)

    const foodItemsReq = trpc.getRestaurantFoodItems.useQuery({ restaurantID })
    const addonCatsReq = trpc.getRestaurantAddonCategories.useQuery({ restaurantID })
    const foodItemMutation = trpc.patchRestaurantFoodItem.useMutation()

    const foodItem = foodItemsReq.data.find((f) => f._id === foodItemID)

    useEffect(() => {
        if (!foodItemsReq.data) {
            return
        }
        setNames(foodItem.names)
        setDescriptions(foodItem.descriptions)
        setPrice(foodItem.price)
    }, [foodItem])

    if (!foodItemsReq.data || !addonCatsReq.data) return <View><Text>Loading...</Text></View>
    if (foodItem === undefined) return <View><Text>An error occurred.</Text></View>


    const addons = addonCatsReq.data

    const addonCatsSelected = addons.filter((cat) => foodItem.addons.includes(cat._id))
    const addonCatsUnselected = addons.filter((cat) => !foodItem.addons.includes(cat._id))

    const addAddonCat = async (addonCatID) => {
        await foodItemMutation.mutateAsync({
            restaurantID,
            foodItemID,
            names,
            descriptions,
            price,
            addons: foodItem.addons.concat(addonCatID)
        })
        await foodItemsReq.refetch()
    }

    const removeAddonCat = async (addonCatID) => {
        await foodItemMutation.mutateAsync({
            restaurantID,
            foodItemID,
            names,
            descriptions,
            price,
            addons: foodItem.addons.filter((id) => id !== addonCatID)
        })
        await foodItemsReq.refetch()
    }

    const content = () => <KeyboardAvoidingView>
        <ScrollView>
            <View padding-15 flex>
                <InternalTextField value={names['en']}
                                   label='Name in English'
                                   onChangeText={(v) => setNames({ ...names, 'en': v })}
                                   maxLength={50}
                />
                <InternalTextField value={names['vi']}
                                   label='Name in Vietnamese'
                                   onChangeText={(v) => setNames({ ...names, 'vi': v })}
                                   maxLength={50}
                />
                <InternalTextField value={descriptions['en']}
                                   label='Description in English'
                                   onChangeText={(v) => setDescriptions({ ...descriptions, 'en': v })}
                                   maxLength={200}
                />
                <InternalTextField value={descriptions['vi']}
                                   label='Description in Vietnamese'
                                   onChangeText={(v) => setDescriptions({ ...descriptions, 'vi': v })}
                                   maxLength={200}
                />
                <InternalTextField value={price.toString()}
                                   label="Price"
                                   validate={'number'}
                                   onChangeText={(v) => v === '' ? setPrice(0) : setPrice(parseInt(v))}
                />
                <CardItem label="Save Changes"
                          color="action"
                          onPress={() => {
                                foodItemMutation.mutate({
                                    restaurantID,
                                    foodItemID,
                                    names,
                                    descriptions,
                                    price
                                })
                          }}
                />
            </View>
            {/* https://stackoverflow.com/a/61611734 */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                <View>
                    <Text style={{width: 50, textAlign: 'center'}}>Addon Categories</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            </View>
            <View padding-15 flex>
                {addonCatsSelected.map((cat) => <>
                    <CardItem
                        key={cat._id}
                        color="info"
                        onPress={() => {}}
                    >
                        <View padding-15>
                            <Text>{getName(cat.names)}</Text>
                        </View>
                        <View flex right>
                            <Text style={{ color: 'red' }}
                                  onPress={() => removeAddonCat(cat._id)}>
                                Remove
                            </Text>
                        </View>
                    </CardItem>
                </>)}
                {addonCatsUnselected.map((cat) => <>
                    <CardItem
                        key={cat._id}
                        color="info"
                        onPress={() => {}}
                    >
                        <View padding-15>
                            <Text>{getName(cat.names)}</Text>
                        </View>
                        <View flex right>
                            <Text style={{ color: 'green' }}
                                  onPress={() => addAddonCat(cat._id)}>
                                Add
                            </Text>
                        </View>
                    </CardItem>
                </>)}
            </View>
        </ScrollView>
    </KeyboardAvoidingView>

    return foodItem === null ? <Text>Loading...</Text> : content()
}