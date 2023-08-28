import { Stack } from "expo-router";
import {View, Image, Text, Button, ButtonProps, Pressable} from "react-native";
import {tw} from "../../util/utilities";
import {} from "react-native-ui-lib";
import {SafeAreaView} from "react-native-safe-area-context";
import GoodiesWithSlogan from "../../assets/goodies-with-slogan.svg"
import {LanguageSwitcherContext} from "../../util/hooks";
import {useContext} from "react";
import {useIntl} from "react-intl";

interface GoodiesButtonProps {
    title: string
    size: 'sm' | 'md' | 'lg'
    isPrimary: boolean
    onPress: () => void
}

export function GoodiesButton(props: GoodiesButtonProps) {
    return <Pressable onPress={props.onPress} style={tw.style(
        `rounded-lg font-bold m-2`,
        props.isPrimary ? `bg-[#797979]` : `bg-[#EAEAEA]`,
        props.size === 'lg' && `basis-1/2 p-4`,
        props.size === 'md' && `basis-1/2 p-2`,
        props.size === 'sm' && `basis-1/4 p-2`)}>
            <Text style={tw.style(`text-center`, props.isPrimary ? `text-white` : `text-black`)}>{props.title}</Text>
        </Pressable>

}

export default function LanguageSelect() {
    const t = useIntl()
    const {locale, setLocale} = useContext(LanguageSwitcherContext)

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
                               size="lg"/>
            </View>
            <View style={tw`flex flex-row w-full justify-center items-center`}>
                <GoodiesButton title={"Tiếng Việt"}
                               isPrimary={locale === 'vi'}
                               onPress={() => setLocale('vi')}
                               size="lg"/>
            </View>
            <View style={tw`flex-1`}></View>
            <View style={tw`flex flex-row w-full justify-center items-center mb-8`}>
                <GoodiesButton title={t.formatMessage({ id: 'languageSelector.next' })}
                               isPrimary={true}
                               onPress={() => {}}
                               size="lg"/>
            </View>
        </View>
    </SafeAreaView>)
}