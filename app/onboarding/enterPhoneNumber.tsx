import {useIntl} from "react-intl";
import {tw} from "../../util/utilities";
import {SafeAreaView} from "react-native-safe-area-context";
import {Stack, useRouter} from "expo-router";
import {Pressable, Text, TextInput, View} from "react-native";
import {GoodiesButton} from "./languageSelect";
import {useEffect, useMemo, useState} from "react";
import VnFlag from "../../assets/flag-icons/vn.svg"
import {Octicons} from '@expo/vector-icons';
import countryCodes, {CountryProperty} from "country-codes-list";

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

interface GoodiesPhoneNumberInput {
    value: string
    onChangeText: (text: string) => void,
    countryCallingCode: string
    setCountryCallingCode: (text: string) => void
}


// const getFlagEmoji = countryCode=>String.fromCodePoint(...[...countryCode.toUpperCase()].map(x=>0x1f1a5+x.charCodeAt(0)))

export function GoodiesPhoneNumberInput(props: GoodiesPhoneNumberInput) {
    const [countryCode, setCountryCode] = useState<string>("US")

    const countryData = useMemo(() => {
        return countryCodes.findOne('countryCode' as CountryProperty.countryCode, countryCode)
    }, [countryCode]);

    useEffect(() => {
        const matchedCountry = countryCodes.findOne('countryCallingCode' as CountryProperty.countryCallingCode, props.countryCallingCode.replace("+", ""))
        const notOverriding = countryData.countryCallingCode !== props.countryCallingCode.replace('+', '')
        if (matchedCountry && notOverriding) {
            setCountryCode(matchedCountry.countryCode)
        }
    }, [props.countryCallingCode])

    return <>
        <View style={tw`flex flex-row w-full justify-center items-center h-10`}>
            <Pressable style={tw`flex flex-row rounded-l-lg border border-gray-300 p-2 basis-1/6 h-full`}>
                <View style={tw`flex flex-row w-full items-center justify-center `}>
                    <Text style={tw`text-3xl h-9`}>{countryData.flag}</Text>
                    <Octicons name="single-select" size={12} color="black" style={tw`ml-1`} />
                </View>
            </Pressable>
            <TextInput value={props.countryCallingCode}
                       onChangeText={props.setCountryCallingCode}
                       inputMode="tel"
                       clearButtonMode="never"
                       autoComplete="tel"
                       placeholder={`+${countryData.countryCallingCode}`}
                       returnKeyType="done"
                style={tw`border border-gray-300 p-2 basis-1/7 h-full`}/>
            <TextInput value={props.value}
                       onChangeText={props.onChangeText}
                       inputMode="tel"
                       clearButtonMode="always"
                       autoComplete="tel"
                       autoFocus={true}
                       placeholder={"Phone number"}
                       returnKeyType="done"
                style={tw`rounded-r-lg border border-gray-300 p-2 basis-1/2 h-full`}/>
        </View>
    </>
}

export default function EnterPhoneMumber() {
    const t = useIntl()
    const navigation = useRouter();
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [countryCallingCode, setCountryCallingCode] = useState<string>("+1")

    return (<SafeAreaView style={tw`bg-white flex w-full h-full`}>
        <Stack.Screen options={{ title: t.formatMessage({ id: 'login.title' })}}/>
        <View style={tw`flex flex-col w-full h-full justify-between`}>
            <View style={tw`flex flex-row w-full justify-center items-center mt-2`}>
                {/*<GoodiesTextInput*/}
                {/*    placeholder={"Phone number"}*/}
                {/*    value={phoneNumber}*/}
                {/*    onChangeText={setPhoneNumber}*/}
                {/*    autoFocus={true}*/}
                {/*    autoComplete="tel"*/}
                {/*    clearButtonMode="always"*/}
                {/*    inputMode={"tel"}/>*/}
                <GoodiesPhoneNumberInput value={phoneNumber} onChangeText={setPhoneNumber}
                                         countryCallingCode={countryCallingCode}
                                         setCountryCallingCode={setCountryCallingCode}
                />
            </View>
            <View style={tw`flex-1`}></View>
            <View style={tw`flex flex-row w-full justify-center items-center mb-8`}>
                <GoodiesButton title={t.formatMessage({ id: 'languageSelector.next' })}
                               isPrimary={true}
                               onPress={() => {}}
                               size="lg"/>
            </View>
        </View>
    </SafeAreaView>);
}