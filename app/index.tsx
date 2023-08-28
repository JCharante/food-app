import {View, Text} from "react-native-ui-lib";
import {useContext, useEffect} from "react";
import {TokenContext} from "../util/tokenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Pressable} from "react-native";
import {CardItem} from "../components/CardItem";
import {Stack, useRouter} from "expo-router";

export const Index = () => {
    const { token, setToken } = useContext(TokenContext)
    const navigation = useRouter();

    useEffect(() => {
        // Check if logged in
        const fun = async () => {
            const value = await AsyncStorage.getItem('token')
            setToken(value)
            if(value === null) {
                // Must be first launch
                // TODO: redirect without allowing back button
                navigation.push('/onboarding/data?pncc=1&pnr=2073185560&requestId=6406037a35a14da9b7ef1a64dff37821&name=Jyan&promoCode=admin')
                // navigation.push('/onboarding/languageSelect')
            } else {
                // TODO: check if token is valid / expired
                setToken(value)
                // TODO: redirect without allowing back button
                navigation.push('/home')
            }
        }

        fun().catch(e => console.log(e))
    }, [token])

    return <View></View>
}

export default Index
