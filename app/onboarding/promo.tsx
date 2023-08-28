import {useIntl} from "react-intl";
import {Stack, useRouter} from "expo-router";
import {useEffect, useState} from "react";
import {Keyboard, Pressable, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {tw, useParamFetcher} from "../../util/utilities";
import {HeaderBackButtonProps} from "@react-navigation/native-stack/src/types";
import {MaterialIcons} from "@expo/vector-icons";
import {GoodiesTextInput} from "../../components/GoodiesTextInput";
import {GoodiesButton} from "../../components/GoodiesButton";

export default function PromoCodePage() {
    const { pncc, pnr, requestId, name } = useParamFetcher()
    const t = useIntl()
    const navigation = useRouter();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [promoCode, setPromoCode] = useState<string>('')

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const submit = async () => {
        navigation.push(`/onboarding/data?pncc=${
            pncc
        }&pnr=${
            pnr
        }&requestId=${
            requestId
        }&name=${
            encodeURIComponent(name)
        }&promoCode=${
            encodeURIComponent(promoCode)
        }`)
        Keyboard.dismiss()
    }

    const skip = async () => {
        navigation.push(`/onboarding/data?pncc=${
            pncc
        }&pnr=${
            pnr
        }&requestId=${
            requestId
        }&name=${
            encodeURIComponent(name)
        }`)
        Keyboard.dismiss()
    }

    return <SafeAreaView style={tw`bg-background flex flex-1`}>
        <Stack.Screen options={{
            title: t.formatMessage({ id: 'sign-up.title' }),
            headerLeft: (props: HeaderBackButtonProps) => (<MaterialIcons name="arrow-back" size={24} color="black" onPress={() => navigation.back()} />),
            headerShadowVisible: false,
            headerStyle: tw`bg-background`
        }}/>
        <View style={tw`p-4 flex flex-1`}>
            <View style={tw`mb-6`}>
                <GoodiesTextInput value={promoCode}
                                  onChangeText={setPromoCode}
                                  placeholder={t.formatMessage({ id: 'sign-up.promoCode.placeholder' })}
                                  label={t.formatMessage({ id: 'sign-up.promoCode.label' })}
                                  autoComplete={'off'}
                />
            </View>
            <Pressable onPress={() => Keyboard.dismiss()} style={tw.style([
                isKeyboardVisible ? `h-30` : `flex-1` // 40 is too low, name field blocked on ip 12 mini
            ])}></Pressable>
            <View style={tw`flex flex-row justify-center`}>
                <GoodiesButton title={'Skip'}
                               size={'xl'}
                               isPrimary={false}
                               onPress={skip}/>
                <GoodiesButton title={'Next'}
                               size={'xl'}
                               isPrimary={true}
                               onPress={submit}
                               active={promoCode.length > 0}/>
            </View>
        </View>
    </SafeAreaView>

}