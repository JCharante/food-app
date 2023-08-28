import {View, Text, Card} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import { CardItem } from "../../../../../../components/CardItem";
import {getName, getNumber, useParamFetcher} from "../../../../../../util/utilities";
import {trpc} from "../../../../../../util/api";
import {useRefetchOnFocus} from "../../../../../../util/hooks";
import {Stack, useRouter, useSearchParams} from "expo-router";

const ViewWrapper = ({ children }) => {
    return <ScrollView>
        <Stack.Screen options={{ title: 'All Foods' }}/>
        {children}
    </ScrollView>
}
export const AllFoodsScreen = ({ route }) => {
    const navigation = useRouter()
    const { restaurantID } = useParamFetcher()
    const foodItems = trpc.getRestaurantFoodItems.useQuery({ restaurantID })
    useRefetchOnFocus(foodItems.refetch)

    if (!foodItems.data) return <ViewWrapper><Text>Loading...</Text></ViewWrapper>

    return <ViewWrapper>
        <View padding-15>
            <View marginT-10>
                <Text style={{ fontSize: 20 }}>Food:</Text>
                <Text>Food will only show the menu if it is added to a category.</Text>
                {foodItems.data.map((food) => {
                    return <CardItem key={food.id}>
                        <Card.Section imageSource={{ url: food.pictureURL }}
                                      imageStyle={{width: 96, height: 96}} />
                        <View padding-15 flex>
                            <Text>{getName(food.names)}</Text>
                        </View>
                        <View flex
                              right>
                            <Text onPress={() => navigation.push(`/merchant/restaurant/${restaurantID}/menu/food/${food.id}`)}>Edit</Text>
                        </View>
                    </CardItem>
                })}
                <CardItem
                    label="Create Food"
                    color="action"
                    onPress={() => navigation.push(`/merchant/restaurant/${restaurantID}/menu/food/new`)}
                />
            </View>
        </View>
    </ViewWrapper>
}

export default AllFoodsScreen
