import {View, Text, Card} from "react-native-ui-lib";
import {useContext, useEffect, useState} from "react";
import {TokenContext} from "../util/tokenContext";
import {getMenuCategories, IMenuCategoryAPI, getRestaurantFoodItems, IFoodItemAPI} from '@goodies-tech/api'
import {ScrollView} from "react-native-gesture-handler";
import {RestaurantContext} from "../util/restaurantContext";
import { CardItem } from "../components/CardItem";

export const UpdateMenuScreen = ({ navigation, route }) => {
    const { token } = useContext(TokenContext)
    const { restaurant } = useContext(RestaurantContext)
    const [categories, setCategories] = useState<IMenuCategoryAPI[]>([])
    const [foodItems, setFoodItems] = useState<IFoodItemAPI[]>([])
    useEffect(() => {
        // Fetch data on page load / when token changes
        (async () => {
            if (token === '') return
            // TODO: make these requests in parallel
            const categoryData = await getMenuCategories(token, restaurant._id)
            const foodData = await getRestaurantFoodItems(token, restaurant._id)
            console.log(JSON.stringify(categoryData))
            console.log(JSON.stringify(foodData))
            setCategories(categoryData)
            setFoodItems(foodData)
        })()
    }, [token])

    return <ScrollView >
        <View padding-15>
            <Text>
                A restaurant's menu is composed of categories.
            </Text>
            <Text>
                Each category has a name and a list of food.
            </Text>
            <Text>
                You can add a new category by clicking the "Add Category" button.
            </Text>
            <Text>
                You can add a new food by clicking the "Add Food" button.
            </Text>
            <Text>
                You have to add food to a category by editing the category and adding food to it.
            </Text>
            <Text>
                The order of the categories shown is also the order they will appear on the menu
            </Text>
            <View marginT-10>
                <Text style={{ fontSize: 20 }}>Categories:</Text>
                {categories.map((cat) => {
                    return <Card key={cat._id}
                                 style={{ marginBottom: 5, marginTop: 5 }}
                                 row
                                 height={90}
                                 borderRadius={20}
                                 onPress={() => navigation.navigate(
                                     'UpdateCategoryScreen',
                                     {
                                         category: cat
                                     }
                                 )}
                    >
                        <View padding-15 flex>
                            <Text>{cat.name}</Text>
                        </View>
                    </Card>
                })}
                <Text style={{ fontSize: 20 }}>Food:</Text>
                {foodItems.map((food) => {
                    return <CardItem key={food._id}>
                        <View padding-15 flex>
                            <Text>{food.name}</Text>
                        </View>
                        <View flex
                              right>
                            <Text onPress={() => navigation.navigate(
                                'EditFoodScreen',
                                {
                                    food: food
                                }
                            )}>Edit</Text>
                        </View>
                    </CardItem>
                })}
            </View>
        </View>
    </ScrollView>
}