import {View, Text, Card} from "react-native-ui-lib";
import {RestaurantContext} from "../util/restaurantContext";
import {useContext, useEffect, useState} from "react";
import {IFoodItem, IMenuCategory} from "../util/types";
import {getMenuCategories, getRestaurantFoodItems, getRestaurants, PatchMenuCategoryFoodItems} from "../util/api";
import {TokenContext} from "../util/tokenContext";
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {CardItem} from "../components/CardItem";
import {ScrollView} from "react-native-gesture-handler";

export const UpdateCategoryScreen = ({ route }) => {
    const { token } = useContext(TokenContext)
    const { restaurant, setRestaurant } = useContext(RestaurantContext)
    const [category, setCategory] = useState<IMenuCategory>(route.params.category)
    const [foodItems, setFoodItems] = useState<IFoodItem[]>([])

    useEffect(() => {
        (async() => {
            const data = await getRestaurantFoodItems(token, restaurant._id)
            setFoodItems(data)
        })()
    }, [])

    const removeItem = async (itemID: string) => {
        console.log(`Removing ${itemID} from ${category._id}`)
        const newFoodItems = category.foodItems.map((f) => f._id).filter((f) => f !== itemID)
        await PatchMenuCategoryFoodItems(token, restaurant._id, category._id, newFoodItems)
        // get restaurant info again
        const categoryData = await getMenuCategories(token, restaurant._id)
        setCategory(categoryData.find((c) => c._id === category._id))
    }

    const addItem = async(itemID: string) => {
        console.log(`Adding ${itemID} to ${category._id}`)
        const newFoodItems = category.foodItems.map((f) => f._id).concat(itemID)
        await PatchMenuCategoryFoodItems(token, restaurant._id, category._id, newFoodItems)
        // get restaurant info again
        const categoryData = await getMenuCategories(token, restaurant._id)
        setCategory(categoryData.find((c) => c._id === category._id))
    }

    return <ScrollView>
        <View padding-15>
            <Text>Category name: {category.name}</Text>
            <Text>Food Items:</Text>
            <View>
                {category.foodItems.map((food) =>
                    <Card key={food._id}
                          style={{ marginBottom: 5, marginTop: 5 }}
                          borderRadius={20}
                          row
                          padding-15
                          centerV
                    >
                        <View padding-15>
                            <Text>{food.name}</Text>
                        </View>
                        <View flex right>
                            <Text style={{ color: 'red' }}
                                  onPress={() => removeItem(food._id)}
                            >
                                Remove
                            </Text>
                        </View>
                    </Card>)}
                {foodItems.filter((f) => !category.foodItems.map((f) => f._id).includes(f._id))
                          .map((food) => <CardItem key={food._id}>
                              <View padding-15>
                                  <Text>{food.name}</Text>
                              </View>
                              <View flex right>
                                  <Text style={{ color: 'green' }}
                                        onPress={() => addItem(food._id)}>
                                      Add
                                  </Text>
                              </View>
                          </CardItem>)}
            </View>
        </View>
    </ScrollView>;
}
