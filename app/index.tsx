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
                navigation.push('/login')
            } else {
                setToken(value)
            }
        }

        fun().catch(e => console.log(e))
    }, [])

    return token !== '' ? (<View padding-15>
        <Stack.Screen options={{ title: 'Merchant Home' }}/>
        <CardItem label="Merchant Home Screen" color="info" />
        <CardItem onPress={() => {navigation.push('/merchant/manageRestaurants')}}
                  color="action"
                  label="Manage Restaurants" />
    </View>) : null
}

export default Index
