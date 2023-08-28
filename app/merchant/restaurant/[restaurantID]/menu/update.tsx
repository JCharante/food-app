import {View, Text, Card} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import { CardItem } from "../../../../../components/CardItem";
import {getName, getNumber} from "../../../../../util/utilities";
import {trpc} from "../../../../../util/api";
import {useRefetchOnFocus} from "../../../../../util/hooks";
import {Stack, useRouter, useSearchParams} from "expo-router";
import { Modify } from '@goodies-tech/api'

export const Update = ({ route }) => {
    const navigation = useRouter()
    const restaurantID = getNumber(useSearchParams().restaurantID || '0')
    const categoriesReq = trpc.getRestaurantCategories.useQuery({ restaurantID })
    useRefetchOnFocus(categoriesReq.refetch)
    const restaurantsReq = trpc.userGetRestaurants.useQuery()
    useRefetchOnFocus(restaurantsReq.refetch)
    const menuMutation = trpc.patchRestaurantMenu.useMutation()

    if (!restaurantsReq.data || !categoriesReq.data || restaurantID === 0 || !restaurantID) return <View>
        <Stack.Screen options={{ title: '' }}/>
        <Text>Loading...</Text>
    </View>
    const restaurant = restaurantsReq.data.find((r) => r.id === restaurantID)

    const categoryIsOnMenu = (categoryID: number) => {
        const cat = restaurant.menu.categories.find((c) => c.id === categoryID)
        return cat !== undefined
    }

    const addCategoryToMenu = async (categoryID: number) => {
        await menuMutation.mutateAsync({
            restaurantID,
            menuID: restaurant.menu.id,
            categories: restaurant.menu.categories.map((c) => c.id).concat(categoryID)
        })
        await restaurantsReq.refetch()
    }

    const removeCategoryFromMenu = async (categoryID: number) => {
        await menuMutation.mutateAsync({
            restaurantID,
            menuID: restaurant.menu.id,
            categories: restaurant.menu.categories.map((c) => c.id).filter((c) => c !== categoryID)
        })
        await restaurantsReq.refetch()
    }

    return <ScrollView >
        <Stack.Screen options={{ title: 'Update Menu' }}/>
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
                          onPress={() => navigation.push(`/merchant/restaurant/${restaurantID}/menu/foods/all`)}
                />
                <CardItem label="View all Food Addons"
                          color="action"
                          onPress={() => navigation.push(`/merchant/restaurant/${restaurantID}/menu/addons/all`)}
                />
                <Text style={{ fontSize: 20 }}>Menu Categories:</Text>
                {categoriesReq.data.map((cat) => {
                    return <Card key={cat.id}
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
                                  onPress={() => navigation.push(`/merchant/restaurant/${restaurantID}/menu/category/${cat.id}/update`)}
                            >Edit</Text>
                        </View>
                        <View flex right>
                            {categoryIsOnMenu(cat.id) ?
                                (<Text style={{ color: 'red' }}
                                    onPress={() => removeCategoryFromMenu(cat.id)}
                                >Hide</Text>)
                            :
                                (<Text style={{ color: 'green' }}
                                  onPress={() => addCategoryToMenu(cat.id)}
                            >
                                Show
                            </Text>)}
                        </View>
                    </Card>
                })}
                <CardItem
                    label="Create Category"
                    color="action"
                    onPress={() => navigation.push(`/merchant/restaurant/${restaurantID}/menu/category/new`)}
                ></CardItem>
            </View>
        </View>
    </ScrollView>
}

export default Update