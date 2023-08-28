import {View, Text, Incubator} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import {KeyboardAvoidingView} from "react-native";
import {useContext, useEffect, useState} from "react";
import {TokenContext} from "../../util/tokenContext";
import {RestaurantContext} from "../../util/restaurantContext";
import {getRestaurantFoodItems, IFoodItemAPI} from "@goodies-tech/api";
import {getName} from "../../util/utilities";

const { TextField } = Incubator

export const EditFoodScreen = ({ route }) => {
    const { food } = route.params
    const foodID = food._id
    const [foodItem, setFoodItem] = useState<IFoodItemAPI | null>(null)
    const { token } = useContext(TokenContext)
    const { restaurant } = useContext(RestaurantContext)

    const fetchFoodItem = async () => {
        console.log(`Fetching data for EditFoodScreen/${foodID}`)
        const data = await getRestaurantFoodItems(token, restaurant._id);
        setFoodItem(data.find((f) => f._id === foodID))
    }

    useEffect(() => {
        Promise.all([fetchFoodItem()])
    }, [])

    const content = () => <KeyboardAvoidingView>
        <ScrollView>
            <View padding-15 flex>
                { Object.keys(foodItem.names).map((lang) => {
                    return <TextField value={foodItem.names[lang]}
                                      label={lang}
                                      onChangeText={(v) => setFoodItem({ ...foodItem, names: { ...foodItem.names, [lang]: v } })}
                                      showCharCounter
                                      maxLength={50}
                                      />
                })}
                { Object.keys(foodItem.descriptions).map((lang) => {
                    return <TextField value={foodItem.descriptions[lang]}
                                      label={lang}
                                      onChangeText={(v) => setFoodItem({ ...foodItem, descriptions: { ...foodItem.descriptions, [lang]: v } })}
                                      showCharCounter
                                      maxLength={200}
                                      />
                })}
                <TextField value={foodItem.price.toString()}
                           label="Price"
                           validate={'number'}
                           onChangeText={(v) => setFoodItem({ ...foodItem, price: parseInt(v) })}
                           showCharCounter
                           maxLength={20}
                           />
            </View>
        </ScrollView>
    </KeyboardAvoidingView>

    return foodItem === null ? <Text>Loading...</Text> : content()
}