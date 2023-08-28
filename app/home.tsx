import {Stack, useRouter} from "expo-router";
import {ScrollView} from "react-native-gesture-handler";
import {View} from "react-native-ui-lib";
import {CardItem} from "../components/CardItem";
import {useContext} from "react";
import {TokenContext} from "../util/tokenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
    const navigation = useRouter()
    const { token, setToken } = useContext(TokenContext)


    const logout = async () => {
        setToken('')
        await AsyncStorage.removeItem('token')
        navigation.push('/')
    }

    return (
        <ScrollView>
            <Stack.Screen options={{ title: 'Goodies.vn' }}/>
            <View padding-15>
                <CardItem
                    label="Merchant View"
                    color="action"
                    onPress={() => {navigation.push('/merchant')}}
                />
                <CardItem
                    label="Sign out"
                    color="action"
                    onPress={logout}
                    />
            </View>
        </ScrollView>
    )
}