import {Stack, useRouter} from "expo-router";
import {CardItem} from "../../components/CardItem";
import {View} from "react-native-ui-lib";

export default function Index() {
    const navigation = useRouter()

    return (<View padding-15>
        <Stack.Screen options={{ title: 'Merchant Home' }}/>
        <CardItem label="Merchant Home Screen" color="info" />
        <CardItem onPress={() => {navigation.push('/merchant/manageRestaurants')}}
                  color="action"
                  label="Manage Restaurants" />
    </View>)
}
