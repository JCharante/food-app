import countryCodes, {CountryProperty} from "country-codes-list";
import {useEffect, useMemo, useState} from "react";
import {Modal, Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {tw} from "../util/utilities";
import {AlphabetList} from "react-native-section-alphabet-list";
import {Entypo} from "@expo/vector-icons";

export interface GoodiesPhoneNumberInput {
    countryCode: string // e.g. US | VN
    setCountryCode: (text: string) => void
    setFullPhoneNumber: (text: string) => void
    setIsValidPhoneNumber: (value: boolean) => void
}


// const getFlagEmoji = countryCode=>String.fromCodePoint(...[...countryCode.toUpperCase()].map(x=>0x1f1a5+x.charCodeAt(0)))

const allCountryData = countryCodes.all()

export function GoodiesPhoneNumberInput(props: GoodiesPhoneNumberInput) {
    const countryData = useMemo(() => {
        return countryCodes.findOne('countryCode' as CountryProperty.countryCode, props.countryCode)
    }, [props.countryCode]);
    const [showModal, setShowModal] = useState<boolean>(false)
    const [value, setValue] = useState<string>("")



    const data2 = useMemo(() => countryCodes.all().map((countryData) => {
        return {
            value: countryData.countryNameEn,
            key: countryData.countryCode,
            countryCode: countryData.countryCode,
            countryCallingCode: countryData.countryCallingCode,
            flag: countryData.flag
        }
    }), [])

    useEffect(() => {
        // only 0-9 digits
        const newValue = value.replace(/[^0-9]/g, '')
        // if value length is between 8 and 14, set value to true, and always update full phone number
        props.setIsValidPhoneNumber(newValue.length >= 8 && newValue.length <= 14)
        props.setFullPhoneNumber(`+${countryData.countryCallingCode}${newValue}`)
    }, [value])


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
                    initialNumToRender={30}
                    maxToRenderPerBatch={50}
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
            <TextInput value={value}
                       onChangeText={(newValue) => {
                           if (newValue.length !== 0 && Math.abs(newValue.length - value.length) > 1) {
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
                                           setValue(newValue.substring(allCountryData[i].countryCallingCode.length + 1))
                                       }
                                   }
                               }
                           } else {
                               setValue(newValue)
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