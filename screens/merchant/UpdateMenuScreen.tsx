import {View, Text, Card} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import { CardItem } from "../../components/CardItem";
import {getName} from "../../util/utilities";
import {trpc} from "../../util/api";
import {inferRouterOutputs} from "@trpc/server";
import {AppRouter} from "@goodies-tech/api";

export const UpdateMenuScreen = ({ navigation, route }) => {
    const restaurantID = route.params.restaurantID
    type RouterOutput = inferRouterOutputs<AppRouter>
    const categories: RouterOutput['getRestaurantCategories'] = trpc.getRestaurantCategories.useQuery({ restaurantID })
    const foodItems = trpc.getRestaurantFoodItems.useQuery({ restaurantID })

    if (!categories.data || !foodItems.data) return <View><Text>Loading...</Text></View>

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
                {categories.data.map((cat) => {
                    return <Card key={cat._id}
                                 style={{ marginBottom: 5, marginTop: 5 }}
                                 row
                                 height={90}
                                 borderRadius={20}
                                 onPress={() => navigation.navigate(
                                     'UpdateCategoryScreen',
                                     {
                                         restaurantID: restaurantID,
                                         categoryID: cat._id
                                     }
                                 )}
                    >
                        <View padding-15 flex>
                            <Text>{getName(cat.names, 'en')}</Text>
                        </View>
                    </Card>
                })}
                <CardItem
                    label="Pick Categories"
                    color="action"
                    onPress={() => navigation.navigate('PickCategories')}
                ></CardItem>
                <CardItem
                    label="Create Category"
                    color="action"
                    onPress={() => navigation.navigate('CreateCategory', { restaurantID })}
                ></CardItem>
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