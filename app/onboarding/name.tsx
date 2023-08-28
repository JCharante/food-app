import {SafeAreaView} from "react-native-safe-area-context";
import {tw, useParamFetcher} from "../../util/utilities";
import {Stack, useRouter} from "expo-router";
import {HeaderBackButtonProps} from "@react-navigation/native-stack/src/types";
import {MaterialIcons} from "@expo/vector-icons";
import {Keyboard, KeyboardAvoidingView, Pressable, Text, TextInput, View} from "react-native";
import {GoodiesButton} from "../../components/GoodiesButton";
import {useEffect, useState} from "react";
import {useIntl} from "react-intl";
import {GoodiesTextInput} from "../../components/GoodiesTextInput";


export default function OnboardingNamePage() {
    const { pncc, pnr, requestId } = useParamFetcher()
    const t = useIntl()
    const navigation = useRouter();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [name, setName] = useState<string>('')

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
        navigation.push(`/onboarding/promo?pncc=${
            pncc
        }&pnr=${
            pnr
        }&requestId=${
            requestId
        }&name=${
            encodeURIComponent(name)
        }`)
    }

    return <SafeAreaView style={tw`bg-[#F9F9F9] flex flex-1`}>
        <Stack.Screen options={{
            title: t.formatMessage({ id: 'sign-up.title' }),
            headerLeft: (props: HeaderBackButtonProps) => (<MaterialIcons name="arrow-back" size={24} color="black" onPress={() => navigation.back()} />),
            headerShadowVisible: false,
            headerStyle: tw`bg-[#F9F9F9]`
        }}/>
        <View style={tw`p-4 flex-1 flex`}>
            <View style={tw`mb-6`}>
                <GoodiesTextInput value={name}
                                  onChangeText={setName}
                                  placeholder={'Placeholder text'}
                                  label={t.formatMessage({ id: 'sign-up.getName' })}
                                  helperText={t.formatMessage({ id: 'sign-up.getNameHelper'})}
                                  autoComplete={'given-name'}
                />
            </View>
            <Pressable onPress={() => Keyboard.dismiss()} style={tw.style([
                isKeyboardVisible ? `h-30` : `flex-1` // 40 is too low, name field blocked on ip 12 mini
            ])}></Pressable>
            <View style={tw`flex flex-row justify-center`}>
                <GoodiesButton title={'Next'}
                               size={'xl'}
                               isPrimary={true}
                               onPress={submit}
                               active={name.length > 0}/>
            </View>
        </View>
    </SafeAreaView>
}