import {View, Text, Card} from "react-native-ui-lib";
import {Stack, useRouter, useSearchParams} from "expo-router";
import {trpc} from "../../../../../../../util/api";
import {ScrollView} from "react-native-gesture-handler";
import {getName, useParamFetcher} from "../../../../../../../util/utilities";
import {CardItem} from "../../../../../../../components/CardItem";

export const UpdateCategoryScreen = ({ route }) => {
    const navigation = useRouter()
    const { restaurantID, categoryID } = useParamFetcher()

    const categoriesReq = trpc.getRestaurantCategories.useQuery({ restaurantID })
    const foodItems = trpc.getRestaurantFoodItems.useQuery({ restaurantID })
    const mutatateMenuCategory = trpc.patchMenuCategory.useMutation()
    const deleteCategory = trpc.deleteMenuCategory.useMutation()

    if (!categoriesReq.data || !foodItems.data) return <View>
        <Stack.Screen options={{ title: 'Update Category...' }}/>
        <Text>Loading...</Text>
    </View>

    const category = categoriesReq.data.find((c) => c.id === categoryID)

    if (category === undefined) return <View>
        <Stack.Screen options={{ title: 'Update Category...' }}/>
        <Text>An error occurred when loading category information</Text>
    </View>


    const removeItem = async (itemID: number) => {
        await mutatateMenuCategory.mutateAsync({
            restaurantID,
            categoryID,
            items: category.foods.map((f) => f.id).filter((f) => f !== itemID)
        })
        await categoriesReq.refetch()
    }

    const addItem = async(itemID: number) => {
        await mutatateMenuCategory.mutateAsync({
            restaurantID,
            categoryID,
            items: category.foods.map((f) => f.id).concat(itemID)
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
                {category.foods.map((food) =>
                    <Card key={food.id}
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
                                  onPress={() => removeItem(food.id)}
                            >
                                Remove
                            </Text>
                        </View>
                    </Card>)}
                {foodItems.data.filter((f) => !category.foods.map((f) => f.id).includes(f.id))
                          .map((food) => <CardItem key={food.id}>
                              <View padding-15>
                                  <Text>{getName(food.names)}</Text>
                              </View>
                              <View flex right>
                                  <Text style={{ color: 'green' }}
                                        onPress={() => addItem(food.id)}>
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
