import {Stack, useRouter} from "expo-router";
import {ScrollView} from "react-native-gesture-handler";
import {Text} from "react-native";
import {View, Card} from "react-native-ui-lib";
import {SafeAreaView} from "react-native-safe-area-context";
import IconNearby from "../../../assets/custom-icons/nearby.svg"
import IconPromo from "../../../assets/custom-icons/promo.svg"
import IconBreakfast from "../../../assets/custom-icons/food/breakfast.svg"
import IconBrunch from "../../../assets/custom-icons/food/brunch.svg"
import IconBurger from "../../../assets/custom-icons/food/burger.svg"
import IconChinese from "../../../assets/custom-icons/food/chinese.svg"
import IconCoffee from "../../../assets/custom-icons/food/coffee.svg"
import IconDessert from "../../../assets/custom-icons/food/dessert.svg"
import IconHealth from "../../../assets/custom-icons/food/health.svg"
import IconIndian from "../../../assets/custom-icons/food/indian.svg"
import IconItalian from "../../../assets/custom-icons/food/italian.svg"
import IconJapanese from "../../../assets/custom-icons/food/japanese.svg"
import IconJuice from "../../../assets/custom-icons/food/juice.svg"
import IconKorean from "../../../assets/custom-icons/food/korean.svg"
import IconPizza from "../../../assets/custom-icons/food/pizza.svg"
import IconThai from "../../../assets/custom-icons/food/thai.svg"
import IconVietnam from "../../../assets/custom-icons/food/vietnam.svg"
import IconWestern from "../../../assets/custom-icons/food/western.svg"
import {trpc} from "../../../util/api";

type IconNames = 'nearby' | 'brunch' | 'burger' | 'chinese' | 'coffee' | 'dessert' | 'health' | 'indian' | 'italian' | 'japanese' | 'juice' | 'korean' | 'pizza' | 'thai' | 'vietnam' | 'western'

const getIcon = (name: string) => {
    switch (name) {
        case 'nearby':
            return <IconNearby/>
        case 'promo':
            return <IconPromo/>
        case 'brunch':
            return <IconBrunch/>
        case 'burger':
            return <IconBurger/>
        case 'chinese':
            return <IconChinese/>
        case 'coffee':
            return <IconCoffee/>
        case 'dessert':
            return <IconDessert/>
        case 'health':
            return <IconHealth/>
        case 'indian':
            return <IconIndian/>
        case 'italian':
            return <IconItalian/>
        case 'japanese':
            return <IconJapanese/>
        case 'juice':
            return <IconJuice/>
        case 'korean':
            return <IconKorean/>
        case 'pizza':
            return <IconPizza/>
        case 'thai':
            return <IconThai/>
        case 'vietnam':
            return <IconVietnam/>
        case 'western':
            return <IconWestern/>
        default:
            return <IconNearby/>
    }
}

interface IRestaurantCategory {
    iconName: IconNames
    id: number
    names: {[languageCode: string]: string}
}

const activeCategories: Array<IRestaurantCategory> = [

]

export default function HomeIndex() {
    const navigation = useRouter()
    const restaurantCategoriesReq = trpc.search.getRestaurantCategories.useQuery({})

    return (
        <SafeAreaView>
            <ScrollView>
                <Stack.Screen options={{ title: 'Goodies.vn', headerBackVisible: false, headerShown: false }}/>
                <View>
                    {restaurantCategoriesReq.data ? (<IconNearby/>) : (<Text>Loading</Text>)}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}