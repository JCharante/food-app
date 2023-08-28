import {Stack, useRouter} from "expo-router";
import {ScrollView} from "react-native-gesture-handler";
import {View, Text, Card} from "react-native-ui-lib";
import {SafeAreaView} from "react-native-safe-area-context";

export default function HomeIndex() {
    const navigation = useRouter()

    return (
        <SafeAreaView>
            <ScrollView>
                <Stack.Screen options={{ title: 'Goodies.vn', headerBackVisible: false, headerShown: false }}/>
                <View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}