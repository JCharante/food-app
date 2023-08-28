import {View, Text, Card} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import { CardItem } from "../../components/CardItem";
import {getName} from "../../util/utilities";
import {trpc} from "../../util/api";
import {inferRouterOutputs} from "@trpc/server";
import {AppRouter} from "@goodies-tech/api";
import {useRefetchOnFocus} from "../../util/hooks";

export const UpdateMenuScreen = ({ navigation, route }) => {
    const restaurantID = route.params.restaurantID
    const categoriesReq = trpc.getRestaurantCategories.useQuery({ restaurantID })
    useRefetchOnFocus(categoriesReq.refetch)
    const restaurantsReq = trpc.userGetRestaurants.useQuery()
    useRefetchOnFocus(restaurantsReq.refetch)
    const menuMutation = trpc.patchRestaurantMenu.useMutation()

    if (!restaurantsReq.data || !categoriesReq.data) return <View><Text>Loading...</Text></View>
    // type RouterOutput = inferRouterOutputs<AppRouter>
    // const categoriesData: RouterOutput['getRestaurantCategories'] = categoriesReq.data
    const restaurant = restaurantsReq.data.find((r) => r._id === restaurantID)
    console.log(restaurant.menu)

    const categoryIsOnMenu = (categoryID: string) => {
        return restaurant.menu.categories.includes(categoryID)
    }

    const addCategoryToMenu = async (categoryID: string) => {
        await menuMutation.mutateAsync({
            restaurantID,
            menuID: restaurant.menu._id,
            categories: restaurant.menu.categories.concat(categoryID)
        })
        await restaurantsReq.refetch()
    }

    const removeCategoryFromMenu = async (categoryID: string) => {
        await menuMutation.mutateAsync({
            restaurantID,
            menuID: restaurant.menu._id,
            categories: restaurant.menu.categories.filter((c) => c !== categoryID)
        })
        await restaurantsReq.refetch()
    }

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
                <CardItem label="View all Foods"
                          color="action"
                          onPress={() => navigation.navigate('AllFoods', { restaurantID })} />
                <CardItem label="View all Food Addons"
                          color="action"
                          onPress={() => navigation.navigate('ViewAllFoodAddons', { restaurantID })} />
                <Text style={{ fontSize: 20 }}>Menu Categories:</Text>
                {categoriesReq.data.map((cat) => {
                    return <Card key={cat._id}
                                 style={{ marginBottom: 5, marginTop: 5 }}
                                 borderRadius={20}
                                 row
                                 padding-15
                                 centerV
                    >
                        <View padding-15>
                            <Text>{getName(cat.names, 'en')}</Text>
                        </View>
                        <View flex right>
                            <Text style={{ color: 'green' }}
                                  onPress={() => navigation.navigate('UpdateCategoryScreen', {
                                      categoryID: cat._id,
                                      restaurantID
                                  })}
                            >Edit</Text>
                        </View>
                        <View flex right>
                            {categoryIsOnMenu(cat._id) ?
                                (<Text style={{ color: 'red' }}
                                    onPress={() => removeCategoryFromMenu(cat._id)}
                                >Hide</Text>)
                            :
                                (<Text style={{ color: 'green' }}
                                  onPress={() => addCategoryToMenu(cat._id)}
                            >
                                Show
                            </Text>)}
                        </View>
                    </Card>
                })}
                <CardItem
                    label="Create Category"
                    color="action"
                    onPress={() => navigation.navigate('CreateCategory', { restaurantID })}
                ></CardItem>
            </View>
        </View>
    </ScrollView>
}