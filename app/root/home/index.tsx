import {Stack, useRouter} from "expo-router";
import {ScrollView} from "react-native-gesture-handler";
import {Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
// TODO: move these imports to a better place
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
import GoodiesSquareLogo from "../../../assets/goodies-square-logo.svg"
import IconVeganModeOn from "../../../assets/custom-icons/veganMode.svg"
import IconVeganModeOff from "../../../assets/custom-icons/vegetarianMode.svg"
import {trpc} from "../../../util/api";
import {useEffect, useMemo, useState} from "react";
import {getName, tw} from "../../../util/utilities";
import {useIntl} from "react-intl";
import {GoodiesSearchInput} from "../../../components/GoodiesSearchInput";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../util/store'
import { toggleVeganMode } from '../../../util/customerHomeSlice';


type IconNames = 'nearby' | 'brunch' | 'burger' | 'chinese' | 'coffee' | 'dessert' | 'health' | 'indian' | 'italian' | 'japanese' | 'juice' | 'korean' | 'pizza' | 'thai' | 'vietnam' | 'western'

import * as Location from 'expo-location';


const getIcon = (name: string) => {
    switch (name) {
        case 'nearby':
            return <IconNearby/>
        case 'promo':
            return <IconPromo/>
        case 'breakfast':
            return <IconBreakfast/>
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

export default function HomeIndex() {
    // Essentials
    const t = useIntl()
    const navigation = useRouter()
    // TODO: remove this
    const restaurantCategoriesReq = trpc.search.getRestaurantCategories.useQuery({})
    // For showing the user's name
    const nameReq = trpc.user.userInfo.useQuery()
    // Search text
    const [searchText, setSearchText] = useState<string>('')
    // For displaying user's location
    const [latlong, setLatlong] = useState<{latitude: number, longitude: number}>({latitude: 0, longitude: 0})
    const reverseGeoEncodeReq = trpc.geo.getCurrentPlace.useQuery(latlong, { enabled: latlong.longitude !== 0})
    // For the vegan mode
    const dispatch = useDispatch<AppDispatch>();
    const veganMode = useSelector((state: RootState) => state.customerHome.veganMode);

    // Get location from device
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            const req = await Location.getCurrentPositionAsync()
            console.log(req)

            setLatlong(req.coords)
        })()
    }, [searchText])

    // todo: update current language to use language from context
    const categoryElements = useMemo(() => {
        if (restaurantCategoriesReq.data) {
            return restaurantCategoriesReq.data.map((categoryInfo) => <View style={tw`flex flex-col w-[60px]`} key={categoryInfo.id}>
                <View style={tw`flex flex-row justify-center`}>
                    {getIcon(categoryInfo.iconName)}
                </View>
                <View style={tw`flex flex-row`}>
                    <Text style={tw`text-center w-full text-xs font-semibold`}>{getName(categoryInfo.names, 'en')}</Text>
                </View>
            </View>)
        } else {
            return <Text>Loading...</Text>
        }
    }, [restaurantCategoriesReq.data])

    const displayedAddress = reverseGeoEncodeReq.data && reverseGeoEncodeReq.data.length > 0 ? reverseGeoEncodeReq.data[0].name : 'Pick Address'

    const veganModeSelector = (<Pressable onPress={() => dispatch(toggleVeganMode())}>
        {veganMode ? <IconVeganModeOn/> : <IconVeganModeOff/>}
    </Pressable>)

    return (
        <SafeAreaView style={tw`flex flex-1`}>
            <View style={tw`flex flex-1 p-4`}>
                <Stack.Screen options={{ title: 'Goodies.vn', headerBackVisible: false, headerShown: false }}/>
                <View style={tw`flex flex-row`}>
                    <View style={tw`flex flex-col`}>
                        <Text style={tw`font-semibold text-neutral-800`}>Good morning, {nameReq.data ? nameReq.data : ''}</Text>
                        <Text style={tw`text-xs text-neutral-700`}>{reverseGeoEncodeReq.data ? displayedAddress : 'Loading...'}</Text>
                    </View>
                    <View style={tw`flex flex-1`}></View>
                    <GoodiesSquareLogo/>
                </View>
                <View style={tw`flex flex-row mt-4 mb-[20px] justify-between`}>
                    {/*TODO: Technically we could find the device width and minus it by 44 & padding*/}
                    <GoodiesSearchInput
                        value={searchText}
                        setValue={setSearchText}
                        placeholder={'Search'}
                    />
                    {veganModeSelector}
                </View>
                <Text style={tw`font-semibold text-lg text-neutral-900 mb-3`}>{t.formatMessage({ id: 'root.home.category' })}</Text>
                <View style={tw`flex flex-row flex-wrap gap-3 justify-center`}>
                    {categoryElements}
                </View>
            </View>
        </SafeAreaView>
    )
}
