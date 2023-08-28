import {useIntl} from "react-intl";
import {tw} from "../../util/utilities";
import {SafeAreaView} from "react-native-safe-area-context";
import {Stack, useRouter} from "expo-router";
import {Keyboard, Pressable, Text, TextInput, View} from "react-native";
import {useEffect, useState} from "react";
import {GoodiesPhoneNumberInput} from "../../components/GoodiesPhoneNumberInput";
import {GoodiesButton} from "../../components/GoodiesButton";
import {HeaderBackButtonProps} from "@react-navigation/native-stack/src/types";
import {MaterialIcons} from "@expo/vector-icons";


interface GoodiesTextInputProps {
    placeholder: string
    inputMode: 'none' | 'text' | 'tel' | 'numeric' | 'search' | 'email' | 'url' // https://reactnative.dev/docs/textinput#inputmode
    autoComplete?: 'off' | 'tel' | 'name' // https://reactnative.dev/docs/textinput#textcontenttype-ios
    clearButtonMode?: 'never' | 'while-editing' | 'unless-editing' | 'always' // iOS only, shows clear button on the right https://reactnative.dev/docs/textinput#clearbuttonmode-ios
    onChangeText: (text: string) => void
    value: string
    autoFocus?: boolean
}

export function GoodiesTextInput({ clearButtonMode = 'while-editing',
                                    autoFocus = false,
                                    autoComplete = 'off',
                                     ...props}: GoodiesTextInputProps) {
    return <TextInput inputMode={props.inputMode}
                      value={props.value}
                      onChangeText={props.onChangeText}
                      placeholder={props.placeholder}
                      clearButtonMode={clearButtonMode}
                      autoFocus={autoFocus}
                      autoComplete={autoComplete}
                      returnKeyType="done"
                      style={tw`rounded-lg border border-gray-300 p-2 basis-1/2`}
    />
}



export default function EnterPhoneMumber() {
    const t = useIntl()
    const navigation = useRouter();

    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [validPhoneNumber, setValidPhoneNumber] = useState<boolean>(false)
    const [countryCode, setCountryCode] = useState<string>("VN")

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


    return (<SafeAreaView style={tw`bg-white flex w-full h-full`}>
        <Stack.Screen options={{
            title: t.formatMessage({ id: 'login.title' }),
            headerLeft: (props: HeaderBackButtonProps) => (<MaterialIcons name="arrow-back" size={24} color="black" onPress={() => navigation.back()} />),
            headerShadowVisible: false
        }}/>
        <View style={tw`flex flex-col w-full h-full justify-between pl-8 pr-8`}>
            <View style={tw`flex flex-col justify-center items-center content-center w-full`}>
                <View style={tw`flex flex-row w-full justify-start`}>
                    <Text>Phone number</Text>
                </View>
                <View style={tw`flex flex-row w-full justify-center items-center mt-2`}>
                    <GoodiesPhoneNumberInput countryCode={countryCode}
                                             setCountryCode={setCountryCode}
                                             setIsValidPhoneNumber={setValidPhoneNumber}
                                             setFullPhoneNumber={setPhoneNumber}
                    />
                </View>
            </View>
            <Pressable onPress={() => Keyboard.dismiss()} style={tw`flex-1`}></Pressable>
            <View style={tw`flex flex-row w-full justify-center items-center mb-8`}>
                <GoodiesButton title={t.formatMessage({ id: 'languageSelector.next' })}
                               isPrimary={true}
                               onPress={() => navigation.push(`/onboarding/sms-otp?phoneNumber=${encodeURIComponent(phoneNumber)}`)}
                               active={validPhoneNumber}
                               size="xl"/>
            </View>
            {/*Quick hack to reduce the space the other flex-1 has so the next button appears above the keyboard view*/}
            { isKeyboardVisible ? <View style={tw`flex-1`}></View> : null}
            { isKeyboardVisible ? <View style={tw`flex-1`}></View> : null}
        </View>
    </SafeAreaView>);
}