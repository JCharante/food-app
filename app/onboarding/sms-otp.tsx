import {FormattedMessage, useIntl} from "react-intl";
import {KeyboardAvoidingView, View, Text, TextInput, Keyboard, Pressable} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Stack, useRouter} from "expo-router";
import {HeaderBackButtonProps} from "@react-navigation/native-stack/src/types";
import { MaterialIcons } from '@expo/vector-icons';
import {tw, useParamFetcher} from "../../util/utilities";
import {GoodiesButton} from "../../components/GoodiesButton";
import {useEffect, useState} from "react";
export default function SMSOTPPage () {
    const t = useIntl()
    const navigation = useRouter();
    const { phoneNumber } = useParamFetcher()

    const [code, setCode] = useState<string>("")

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

    if (phoneNumber === '0') {
        // error, props missing
    }

    return <SafeAreaView style={tw`bg-white flex w-full h-full`}>
        <Stack.Screen options={{
            title: t.formatMessage({ id: 'login.title' }),
            headerLeft: (props: HeaderBackButtonProps) => (<MaterialIcons name="arrow-back" size={24} color="black" onPress={() => navigation.back()} />),
            headerShadowVisible: false
        }}/>
        <KeyboardAvoidingView style={tw`flex flex-1`} behavior="padding">
            <View style={tw`p-4 flex-1`}>
                <View style={tw`mb-6`}>
                    <Text style={tw`mb-3 text-primary-800 `}>
                        {t.formatMessage({ id: 'sms-otp.text' }, { phoneNumber } )}
                    </Text>
                    <TextInput value={``}
                               placeholder="000000"
                               style={tw`text-2xl`}
                               autoFocus={true}
                               inputMode="numeric"
                               autoComplete="sms-otp"
                               textContentType="oneTimeCode"
                    />
                </View>
                <View>
                    <Text style={tw`text-primary-600 font-semibold mb-1`}>Didn't receive it?</Text>
                    <View style={tw`flex flex-row`}>
                        <Text style={tw`text-neutral-900`}>Get a new code in</Text>
                        <Text style={tw`text-primary-800 font-semibold`}> 90s</Text>
                    </View>
                </View>
                <Pressable onPress={() => Keyboard.dismiss()} style={tw.style([
                    isKeyboardVisible ? `h-40` : `flex-1`
                ])}></Pressable>
                <View style={tw`flex flex-row justify-center`}>
                    <GoodiesButton title={'Next'} size={'xl'} isPrimary={true} onPress={() => {}} active={code.length === 6}/>
                </View>
            </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
}