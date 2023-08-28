import {View, Text} from "react-native-ui-lib";
import {useContext, useEffect} from "react";
import {TokenContext} from "../../util/tokenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Pressable} from "react-native";
import {CardItem} from "../../components/CardItem";

export const HomeScreen = ({ navigation }) => {
    const { token, setToken } = useContext(TokenContext)

    useEffect(() => {
        // Check if logged in
        const fun = async () => {
            const value = await AsyncStorage.getItem('token')
            setToken(value)
            if(value === null) {
                navigation.navigate('Login')
            } else {
                setToken(value)
            }
        }

        fun().catch(e => console.log(e))
    }, [])

    return token !== '' ? (<View padding-15>
        <CardItem label="Home Screen" />
        <CardItem onPress={() => {navigation.navigate('ManageRestaurants')}}
                  label="Manage Restaurants" />
    </View>) : null
}