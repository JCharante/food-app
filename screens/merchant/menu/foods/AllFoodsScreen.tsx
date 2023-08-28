import {View, Text} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import { CardItem } from "../../../../components/CardItem";
import {getName} from "../../../../util/utilities";
import {trpc} from "../../../../util/api";
export const AllFoodsScreen = ({ navigation, route }) => {
    const restaurantID = route.params.restaurantID
    const foodItems = trpc.getRestaurantFoodItems.useQuery({ restaurantID })

    if (!foodItems.data) return <View><Text>Loading...</Text></View>

    return <ScrollView >
        <View padding-15>
            <View marginT-10>
                <Text style={{ fontSize: 20 }}>Food:</Text>
                <Text>Food will only show the menu if it is added to a category.</Text>
                {foodItems.data.map((food) => {
                    return <CardItem key={food._id}>
                        <View padding-15 flex>
                            <Text>{getName(food.names, 'en')}</Text>
                        </View>
                        <View flex
                              right>
                            <Text onPress={() => navigation.navigate(
                                'EditFoodScreen',
                                {
                                    restaurantID,
                                    foodItemID: food._id
                                }
                            )}>Edit</Text>
                        </View>
                    </CardItem>
                })}
                <CardItem
                    label="Create Food"
                    color="action"
                    onPress={() => navigation.navigate('CreateFood', { restaurantID })}
                />
            </View>
        </View>
    </ScrollView>
}