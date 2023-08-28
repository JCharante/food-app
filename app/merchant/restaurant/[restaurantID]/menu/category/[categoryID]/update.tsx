import {View, Text, Card} from "react-native-ui-lib";
import {Stack, useRouter, useSearchParams} from "expo-router";
import {trpc} from "../../../../../../../util/api";
import {ScrollView} from "react-native-gesture-handler";
import {getName} from "../../../../../../../util/utilities";
import {CardItem} from "../../../../../../../components/CardItem";

export const UpdateCategoryScreen = ({ route }) => {
    const navigation = useRouter()
    const restaurantID = useSearchParams().restaurantID?.toString() || ''
    const categoryID = useSearchParams().categoryID?.toString() || ''

    const categoriesReq = trpc.getRestaurantCategories.useQuery({ restaurantID })
    const foodItems = trpc.getRestaurantFoodItems.useQuery({ restaurantID })
    const mutatateMenuCategory = trpc.patchMenuCategory.useMutation()
    const deleteCategory = trpc.deleteMenuCategory.useMutation()

    if (!categoriesReq.data || !foodItems.data) return <View>
        <Stack.Screen options={{ title: 'Update Category...' }}/>
        <Text>Loading...</Text>
    </View>

    const category = categoriesReq.data.find((c) => c._id === categoryID)

    if (category === undefined) return <View>
        <Stack.Screen options={{ title: 'Update Category...' }}/>
        <Text>An error occurred when loading category information</Text>
    </View>


    const removeItem = async (itemID: string) => {
        await mutatateMenuCategory.mutateAsync({
            restaurantID,
            categoryID,
            items: category.foodItems.map((f) => f._id).filter((f) => f !== itemID)
        })
        await categoriesReq.refetch()
    }

    const addItem = async(itemID: string) => {
        await mutatateMenuCategory.mutateAsync({
            restaurantID,
            categoryID,
            items: category.foodItems.map((f) => f._id).concat(itemID)
        })
        await categoriesReq.refetch()
    }

    const deleteCategoryHandler = async () => {
        await deleteCategory.mutateAsync({ restaurantID, categoryID })
        navigation.back()
    }

    const renderContent = () => <ScrollView>
        <Stack.Screen options={{ title: `Update ${getName(category.names)}` }}/>
        <View padding-15>
            <Text>Category name: {getName(category.names, 'en')}</Text>
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
                            <Text>{getName(food.names)}</Text>
                        </View>
                        <View flex right>
                            <Text style={{ color: 'red' }}
                                  onPress={() => removeItem(food._id)}
                            >
                                Remove
                            </Text>
                        </View>
                    </Card>)}
                {foodItems.data.filter((f) => !category.foodItems.map((f) => f._id).includes(f._id))
                          .map((food) => <CardItem key={food._id}>
                              <View padding-15>
                                  <Text>{getName(food.names)}</Text>
                              </View>
                              <View flex right>
                                  <Text style={{ color: 'green' }}
                                        onPress={() => addItem(food._id)}>
                                      Add
                                  </Text>
                              </View>
                          </CardItem>)}
                <CardItem label="Delete Category" color="action" onPress={() => deleteCategoryHandler()}>

                </CardItem>
            </View>
        </View>
    </ScrollView>

    return category === null ? <Text>Loading...</Text> : renderContent();
}

export default UpdateCategoryScreen
