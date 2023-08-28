import {Stack, useRouter} from "expo-router";
import {View, Image, Text, Button, ButtonProps, Pressable} from "react-native";
import {tw} from "../../util/utilities";
import {} from "react-native-ui-lib";
import {SafeAreaView} from "react-native-safe-area-context";
import GoodiesWithSlogan from "../../assets/goodies-with-slogan.svg"
import {LanguageSwitcherContext} from "../../util/hooks";
import {FC, ReactElement, ReactNode, useContext} from "react";
import {useIntl} from "react-intl";
import VnFlag from "../../assets/flag-icons/vn.svg"
import GbEngFlag from "../../assets/flag-icons/gb-eng.svg"
import {GoodiesButton} from "../../components/GoodiesButton";



export default function LanguageSelect() {
    const t = useIntl()
    const {locale, setLocale} = useContext(LanguageSwitcherContext)
    const navigation = useRouter();

    return (<SafeAreaView style={tw`bg-white flex w-full h-full`}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={tw`flex flex-col w-full h-full justify-between`}>
            <View style={tw`flex flex-row w-full h-[90] justify-center items-center`}>
                <GoodiesWithSlogan width="80%" height="25%" />
            </View>
            <View style={tw`flex flex-row w-full justify-center items-center mt-2`}>
                <GoodiesButton title={"English"}
                               isPrimary={locale === 'en'}
                               onPress={() => setLocale('en')}
                               leftSvg={<GbEngFlag height={"100%"} width={"15%"}/>}
                               size="xl"/>
            </View>
            <View style={tw`flex flex-row w-full justify-center items-center`}>
                <GoodiesButton title={"Tiếng Việt"}
                               isPrimary={locale === 'vi'}
                               onPress={() => setLocale('vi')}
                               leftSvg={<VnFlag height={"100%"} width={"15%"}/>}
                               size="xl"/>
            </View>
            <View style={tw`flex-1`}></View>
            <View style={tw`flex flex-row w-full justify-center items-center mb-8`}>
                <GoodiesButton title={t.formatMessage({ id: 'languageSelector.next' })}
                               isPrimary={true}
                               onPress={() => navigation.push('/onboarding/enterPhoneNumber')}
                               size="xl"/>
            </View>
        </View>
    </SafeAreaView>)
}