import {View, Text, Incubator} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import {KeyboardAvoidingView} from "react-native";
import {useContext, useEffect, useState} from "react";
import {TokenContext} from "../util/tokenContext";
import {RestaurantContext} from "../util/restaurantContext";
import {getRestaurantFoodItems, IFoodItemAPI} from "@goodies-tech/api";

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
                <TextField value={foodItem.name}
                           label="Name"
                           onChangeText={(v) => setFoodItem({ ...foodItem, name: v })}
                           showCharCounter
                           maxLength={50}
                           />
                <TextField value={foodItem.englishName}
                           label="English Name"
                           onChangeText={(v) => setFoodItem({ ...foodItem, englishName: v })}
                           showCharCounter
                           maxLength={50}
                           />
                <TextField value={foodItem.description}
                           label="Description"
                           onChangeText={(v) => setFoodItem({ ...foodItem, description: v })}
                           showCharCounter
                           maxLength={200}
                           />
                <TextField value={foodItem.englishDescription}
                           label="English Description"
                           onChangeText={(v) => setFoodItem({ ...foodItem, englishDescription: v })}
                           showCharCounter
                           maxLength={50}
                           />
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