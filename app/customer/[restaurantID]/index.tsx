import {inferRouterOutputs} from "@trpc/server";
import {AppRouter} from "@goodies-tech/api";
import {formatPrice, getName, tw, useParamFetcher} from "../../../util/utilities";
import {Link, Stack, useNavigation, useRouter} from "expo-router";
import {trpc} from "../../../util/api";
import {useRefetchOnFocus} from "../../../util/hooks";
import {ScrollView} from "react-native-gesture-handler";
import React from "react";
import { View, Image } from "react-native"
import {Text} from "react-native-ui-lib";

type RouterOutput = inferRouterOutputs<AppRouter>

interface IMenuFoodComponentProps {
    food: RouterOutput['publicGetRestaurant']['menu']['categories'][0]['foods'][0]
}

function MenuFoodComponent(props: IMenuFoodComponentProps) {
    const { restaurantID } = useParamFetcher() // replace this with something passed from parent component
    const { food } = props
    return <View style={tw`flex flex-row h-24 my-2 bg-transparent w-full`}>
        <Link href={`${food.id}/modal`}>
            <View style={tw``}>
                <Image source={{ uri: food.pictureURL }}
                       style={{ width: '100%', height: undefined, aspectRatio: 1, flex: 1, borderRadius: 10 }}
                       resizeMode="contain" />
            </View>
            <View style={tw`p-2 flex w-full`}>
                <Text style={tw`text-base text-sky-900`}>{getName(food.names)}</Text>
                <Text style={tw`flex w-80 text-sky-950`}>{getName(food.descriptions).substring(0, 100)}</Text>
                <Text style={tw`flex text-sky-800`}>{formatPrice(food.price)}</Text>
            </View>
        </Link>
    </View>
}


interface IMenuCategoryComponentProps {
    category: RouterOutput['publicGetRestaurant']['menu']['categories'][0]
}

function MenuCategoryComponent(props: IMenuCategoryComponentProps) {
    const { category } = props
    return <View>
        <Text style={tw`text-xl text-sky-950`}>{getName(category.names)}</Text>
        { category.foods.map((food) =>
            <MenuFoodComponent
                key={food.id}
                food={food}
            />
        )}
    </View>
}


export default function RestaurantScreen() {
    const navigation = useRouter()
    const { restaurantID } = useParamFetcher()

    const restaurantReq = trpc.publicGetRestaurant.useQuery({ restaurantID })
    useRefetchOnFocus(restaurantReq.refetch)

    if (!restaurantReq.data) {
        return <ScrollView>
            <Stack.Screen options={{ title: '' }}/>
            <Text>Loading...</Text>
        </ScrollView>
    }

    return <ScrollView style={tw`bg-slate-50`}>
        <Stack.Screen options={{ title: getName(restaurantReq.data.names) }}/>
        <View style={tw`border-4`}>
            <Image source={{ uri: restaurantReq.data.pictureURL }} style={tw.style(``, { height: 250 })} />
        </View>
        <View style={tw`p-4`}>
            <Text style={tw`text-3xl text-sky-950`}>Menu</Text>
            { restaurantReq.data.menu.categories.map((category) => {
                return <MenuCategoryComponent key={category.id} category={category}/>
            })}
        </View>
        <View style={tw`h-24`}/>
    </ScrollView>
}
