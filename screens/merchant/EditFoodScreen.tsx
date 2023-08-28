import {View, Text, Incubator} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import {KeyboardAvoidingView} from "react-native";
import {useContext, useEffect, useState} from "react";
import {TokenContext} from "../../util/tokenContext";
import {RestaurantContext} from "../../util/restaurantContext";
import {AppRouter } from "@goodies-tech/api";
import {getName} from "../../util/utilities";
import {trpc} from "../../util/api";
import {inferRouterOutputs} from "@trpc/server";
import {InternalTextField} from "../../components/InternalTextField";
import {CardItem} from "../../components/CardItem";

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
    type RouterOutput = inferRouterOutputs<AppRouter>
    type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[]
        ? ElementType
        : never;

    const foodItemsReq = trpc.getRestaurantFoodItems.useQuery({ restaurantID })
    const foodItemMutation = trpc.patchRestaurantFoodItem.useMutation()

    if (!foodItemsReq.data) return <View><Text>Loading...</Text></View>

    const foodItem = foodItemsReq.data.find((f) => f._id === foodItemID)

    if (foodItem === undefined) return <View><Text>An error occured.</Text></View>

    useEffect(() => {
        console.log(foodItem)
        setNames(foodItem.names)
        setDescriptions(foodItem.descriptions)
        setPrice(foodItem.price)
    }, [foodItem])

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
        </ScrollView>
    </KeyboardAvoidingView>

    return foodItem === null ? <Text>Loading...</Text> : content()
}