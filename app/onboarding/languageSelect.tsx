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

interface GoodiesButtonProps {
    title: string
    size: 'sm' | 'md' | 'lg'
    isPrimary: boolean
    onPress: () => void
    leftSvg?: ReactElement
    fontBold?: boolean
}

export function GoodiesButton({ fontBold = true, ...props }: GoodiesButtonProps) {
    return <Pressable onPress={props.onPress} style={tw.style(
        `rounded-lg m-2`,
        props.isPrimary ? `bg-[#797979]` : `bg-[#EAEAEA]`,
        props.size === 'lg' && `basis-1/2 p-4`,
        props.size === 'md' && `basis-1/2 p-2`,
        props.size === 'sm' && `basis-1/4 p-2`)}>
            <>
                <View style={tw`flex flex-row w-full items-center justify-center`}>
                    {props.leftSvg}
                    <Text style={tw.style(`text-center`,
                        fontBold ? `font-bold` : null,
                        props.isPrimary ? `text-white` : `text-black`,
                        props.leftSvg !== undefined && `ml-2`
                    )}>{props.title}</Text>
                </View>
            </>
        </Pressable>

}

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
                               size="lg"/>
            </View>
            <View style={tw`flex flex-row w-full justify-center items-center`}>
                <GoodiesButton title={"Tiếng Việt"}
                               isPrimary={locale === 'vi'}
                               onPress={() => setLocale('vi')}
                               leftSvg={<VnFlag height={"100%"} width={"15%"}/>}
                               size="lg"/>
            </View>
            <View style={tw`flex-1`}></View>
            <View style={tw`flex flex-row w-full justify-center items-center mb-8`}>
                <GoodiesButton title={t.formatMessage({ id: 'languageSelector.next' })}
                               isPrimary={true}
                               onPress={() => navigation.push('/onboarding/enterPhoneNumber')}
                               size="lg"/>
            </View>
        </View>
    </SafeAreaView>)
}