import {View, Text, Card} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import { CardItem } from "../../../../components/CardItem";
import {getName} from "../../../../util/utilities";
import {trpc} from "../../../../util/api";
import {useRefetchOnFocus} from "../../../../util/hooks";
export const AllFoodsScreen = ({ navigation, route }) => {
    const restaurantID = route.params.restaurantID
    const foodItems = trpc.getRestaurantFoodItems.useQuery({ restaurantID })
    useRefetchOnFocus(foodItems.refetch)

    if (!foodItems.data) return <View><Text>Loading...</Text></View>

    return <ScrollView >
        <View padding-15>
            <View marginT-10>
                <Text style={{ fontSize: 20 }}>Food:</Text>
                <Text>Food will only show the menu if it is added to a category.</Text>
                {foodItems.data.map((food) => {
                    console.log(food)
                    return <CardItem key={food._id.toString()}>
                        <Card.Section imageSource={{ url: food.pictureURL }}
                                      imageStyle={{width: 96, height: 96}} />
                        <View padding-15 flex>
                            <Text>{getName(food.names)}</Text>
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