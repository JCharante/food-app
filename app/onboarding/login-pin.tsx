import {FormattedMessage, useIntl} from "react-intl";
import {KeyboardAvoidingView, View, Text, TextInput, Keyboard, Pressable} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Stack, useRouter} from "expo-router";
import {HeaderBackButtonProps} from "@react-navigation/native-stack/src/types";
import { MaterialIcons } from '@expo/vector-icons';
import {tw, useParamFetcher} from "../../util/utilities";
import {GoodiesButton} from "../../components/GoodiesButton";
import {useContext, useEffect, useState} from "react";
import {trpc} from "../../util/api";
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {TokenContext} from "../../util/tokenContext";

export default function SMSOTPPage () {
    const t = useIntl()
    const navigation = useRouter();
    const { token, setToken } = useContext(TokenContext)
    const { pncc, pnr, requestId } = useParamFetcher()
    const checkPIN = trpc.user.checkPIN.useMutation()

    const [code, setCode] = useState<string>("")
    const [showInvalidCode, setShowInvalidCode] = useState<boolean>(false)

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [showLoading, setShowLoading] = useState<boolean>(false)

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
        try {
            const req = await checkPIN.mutateAsync({
                phoneNumber: pncc + pnr,
                vonageRequestId: requestId,
                pin: code
            })
            if (req.sessionKey) {
                setToken(req.sessionKey)
                await AsyncStorage.setItem('token', req.sessionKey)
                setShowLoading(false)
                navigation.replace(`/`)
            } else {
                console.error(req, 'no session key')
                setShowLoading(false)
            }
        } catch (error) {
            console.error(error)
            setShowLoading(false)
            setShowInvalidCode(true)
        }
    }

    const onCodeChange = (text: string) => {
        if (showInvalidCode) {
            setShowInvalidCode(false)
        }
        setCode(text)
    }

    return <View style={tw`bg-background flex-1`}>
        <Stack.Screen options={{
            title: t.formatMessage({ id: 'sign-in.pin.signIn' }),
            headerLeft: (props: HeaderBackButtonProps) => (<MaterialIcons name="arrow-back" size={24} color="black" onPress={() => navigation.back()} />),
            headerShadowVisible: false,
            headerStyle: tw`bg-background shadow-none`
        }}/>
        <View style={tw`p-4 flex-1`}>
            <View style={tw`mb-6`}>
                <Text style={tw`text-primary-800 font-semibold mb-3`}>
                    {t.formatMessage({ id: 'sign-in.pin.title-1' })}
                </Text>
                <Text style={tw`mb-3 text-primary-800 `}>
                    {t.formatMessage({ id: 'sign-in.pin.title-2'}, { b: (chunks) => <Text style={tw`font-semibold`}>{chunks}</Text>, phoneNumber: `+${pncc} ${pnr}` } )}
                </Text>
                <TextInput value={code}
                           onChangeText={onCodeChange}
                           placeholder="000000"
                           style={tw`text-2xl`}
                           autoFocus={true}
                           inputMode="numeric"
                           autoComplete="password" // TODO: check if this is correct value
                           textContentType="oneTimeCode"
                />
                {showInvalidCode && <View style={tw`flex flex-row items-center mt-1`}>
                    <AntDesign name="closecircle" size={12} color="#EA3942" />
                    <Text style={tw`ml-2 text-bad-600`}>{t.formatMessage({ id: 'sign-in.pin.wrongPIN'})}</Text>
                </View>}
            </View>
            <View>
                <Text style={tw`text-primary-600 font-semibold mb-1`}>{t.formatMessage({ id: 'sign-in.pin.forgotPIN'})}</Text>
            </View>
            <Pressable onPress={() => Keyboard.dismiss()} style={tw.style([
                isKeyboardVisible ? `h-30` : `flex-1`
            ])}></Pressable>
            <View style={tw`flex flex-row justify-start mb-6`}>
                <Text style={tw`font-semibold`}>{t.formatMessage({id: 'sign-in.pin.notMyAccount'}, { a: (chunks) => <Text style={tw`text-primary-600`}>{chunks}</Text>})}</Text>
            </View>
            <View style={tw`flex flex-row justify-center`}>
                <GoodiesButton title={t.formatMessage({ id: 'sign-in.pin.signIn'})}
                               size={'xl'}
                               isPrimary={true}
                               onPress={submit}
                               isLoading={showLoading}
                               active={code.length === 6}/>
            </View>
        </View>
    </View>
}