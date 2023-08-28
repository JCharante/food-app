import {useIntl} from "react-intl";
import {tw} from "../../util/utilities";
import {SafeAreaView} from "react-native-safe-area-context";
import {Stack, useRouter} from "expo-router";
import {Modal, Pressable, Text, TextInput, View} from "react-native";
import {GoodiesButton} from "./languageSelect";
import {useEffect, useMemo, useState} from "react";
import countryCodes, {CountryProperty} from "country-codes-list";
import { Entypo } from '@expo/vector-icons';
import { AlphabetList } from "react-native-section-alphabet-list";


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
    onChangeText: (text: string) => void
    countryCode: string
    setCountryCode: (text: string) => void
}


// const getFlagEmoji = countryCode=>String.fromCodePoint(...[...countryCode.toUpperCase()].map(x=>0x1f1a5+x.charCodeAt(0)))

const allCountryData = countryCodes.all()

export function GoodiesPhoneNumberInput(props: GoodiesPhoneNumberInput) {
    const countryData = useMemo(() => {
        return countryCodes.findOne('countryCode' as CountryProperty.countryCode, props.countryCode)
    }, [props.countryCode]);
    const [showModal, setShowModal] = useState<boolean>(false)

    const data = [
        { value: 'Lillie-Mai Allen', key: 'lCUTs2', countryCode: '' },
        { value: 'Emmanuel Goldstein', key: 'TXdL0c' },
        { value: 'Winston Smith', key: 'zqsiEw' },
        { value: 'William Blazkowicz', key: 'psg2PM' },
        { value: 'Gordon Comstock', key: '1K6I18' },
        { value: 'Philip Ravelston', key: 'NVHSkA' },
        { value: 'Rosemary Waterlow', key: 'SaHqyG' },
        { value: 'Julia Comstock', key: 'iaT1Ex' },
        { value: 'Mihai Maldonado', key: 'OvMd5e' },
        { value: 'Murtaza Molina', key: '25zqAO' },
        { value: 'Peter Petigrew', key: '8cWuu3' },
    ]

    const data2 = useMemo(() => countryCodes.all().map((countryData) => {
        return {
            value: countryData.countryNameEn,
            key: countryData.countryCode,
            countryCode: countryData.countryCode,
            countryCallingCode: countryData.countryCallingCode,
            flag: countryData.flag
        }
    }), [])


    return <>
        <Modal
            animationType="slide"
            visible={showModal}
            presentationStyle="fullScreen"
            onRequestClose={() => {
                setShowModal(false);
            }}
        >
            <SafeAreaView style={tw`flex-1 w-full pt-10`}>
                <AlphabetList
                    data={data2}
                    style={tw`mt-2 flex-1`}
                    sectionHeaderHeight={30}
                    getItemHeight={() => 35}
                    indexLetterStyle={{
                        color: '#2AC3EC',
                        fontSize: 15,
                        width: 20,
                        textAlign: 'center'
                    }}
                    indexContainerStyle={{
                        width: 20,
                        paddingRight: 2
                    }}
                    renderCustomItem={(item: any) => (
                        <Pressable style={tw``} onPress={() => {
                            props.setCountryCode(item.countryCode)
                            setShowModal(false)}
                        }>
                            <Text style={tw`text-black text-lg p-1`}>{item.flag} {item.value} (+{item.countryCallingCode})</Text>
                        </Pressable>
                    )}
                    renderCustomSectionHeader={(section) => (
                        <View style={tw`bg-gray-300`}>
                            <Text style={tw``}>{section.title}</Text>
                        </View>
                    )}
                />
            </SafeAreaView>
        </Modal>
        <View style={tw`flex flex-row w-full items-center h-10`}>
            <Pressable
                style={tw`flex flex-row rounded-l-lg border border-gray-300 p-2 basis-1/6 h-full`}
                onPress={() => setShowModal(true)}
            >
                <View style={tw`flex flex-row w-full items-center justify-center `}>
                    <Text style={tw`text-3xl h-9`}>{countryData.flag}</Text>
                    <Entypo name="chevron-down" size={12} color="black" style={tw`ml-0`}/>
                </View>
            </Pressable>
            <TextInput value={`+${countryData.countryCallingCode}`}
                       onChangeText={() => {}}
                       inputMode="tel"
                       clearButtonMode="never"
                       autoComplete="tel"
                       placeholder={`+${countryData.countryCallingCode}`}
                       returnKeyType="done"
                       editable={false}
                       style={tw`border-t border-b border-gray-300 pt-2 pb-2 pl-2 h-full text-gray-500`}/>
            <TextInput value={props.value}
                       onChangeText={(newValue) => {
                           if (newValue.length !== 0 && Math.abs(newValue.length - props.value.length) > 1) {
                               // detect country code
                               if (newValue.startsWith('+')) {
                                   for (let i = 0; i < allCountryData.length; i++) {
                                        if (newValue.startsWith('+' + allCountryData[i].countryCallingCode)) {
                                            // Exceptions for popular overlaps
                                            if (allCountryData[i].countryCallingCode === '1') {
                                                props.setCountryCode('US')
                                            } else {
                                                props.setCountryCode(allCountryData[i].countryCode)
                                            }
                                            // Subtract the country code & plus
                                            props.onChangeText(newValue.substring(allCountryData[i].countryCallingCode.length + 1))
                                        }
                                   }
                               }
                           } else {
                               props.onChangeText(newValue)
                           }
                       }}
                       inputMode="tel"
                       clearButtonMode="always"
                       autoComplete="tel"
                       autoFocus={true}
                       placeholder={"Phone number"}
                       returnKeyType="done"
                style={tw`rounded-r-lg border-t border-b border-r border-gray-300 py-2 pr-2 pl-1 flex-1  h-full`}/>
        </View>
    </>
}

export default function EnterPhoneMumber() {
    const t = useIntl()
    const navigation = useRouter();
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [countryCallingCode, setCountryCallingCode] = useState<string>("+84")
    const [countryCode, setCountryCode] = useState<string>("VN")

    return (<SafeAreaView style={tw`bg-white flex w-full h-full`}>
        <Stack.Screen options={{ title: t.formatMessage({ id: 'login.title' })}}/>
        <View style={tw`flex flex-col w-full h-full justify-between pl-8 pr-8`}>
            <View style={tw`flex flex-col justify-center items-center content-center w-full`}>
                <View style={tw`flex flex-row w-full justify-start`}>
                    <Text>Phone number</Text>
                </View>
                <View style={tw`flex flex-row w-full justify-center items-center mt-2`}>
                    <GoodiesPhoneNumberInput value={phoneNumber}
                                             onChangeText={setPhoneNumber}
                                             countryCode={countryCode}
                                             setCountryCode={setCountryCode}
                    />
                </View>
            </View>

            <View style={tw`flex-1`}></View>
            <View style={tw`flex flex-row w-full justify-center items-center mb-8`}>
                <GoodiesButton title={t.formatMessage({ id: 'languageSelector.next' })}
                               isPrimary={true}
                               onPress={() => {}}
                               size="xl"/>
            </View>
        </View>
    </SafeAreaView>);
}