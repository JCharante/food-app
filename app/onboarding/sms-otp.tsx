import {FormattedMessage, useIntl} from "react-intl";
import {KeyboardAvoidingView, View, Text, TextInput, Keyboard, Pressable} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Stack, useRouter} from "expo-router";
import {HeaderBackButtonProps} from "@react-navigation/native-stack/src/types";
import { MaterialIcons } from '@expo/vector-icons';
import {tw, useParamFetcher} from "../../util/utilities";
import {GoodiesButton} from "../../components/GoodiesButton";
import {useEffect, useState} from "react";
import {trpc} from "../../util/api";
import { AntDesign } from '@expo/vector-icons';

export default function SMSOTPPage () {
    const t = useIntl()
    const navigation = useRouter();
    const { pncc, pnr, requestId } = useParamFetcher()
    const verify = trpc.user.authSMSVerify.useMutation()
    const phoneNumberStatus = trpc.user.phoneNumberStatus.useMutation()

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
        setShowLoading(true)
        let req = await verify.mutateAsync({
            requestId: requestId,
            code: code
        })
        if (req.success) {
            console.log(`SMS OTP Verified ${requestId}`)
            // TODO: show correct code success?
        } else {
            // TODO: show wrong code
            setShowLoading(false)
            setShowInvalidCode(true)
            console.log(req)
            return
        }

        try {
            // do next request to find out what to do
            req = await phoneNumberStatus.mutateAsync({
                phoneNumber: pncc + pnr,
                vonageRequestId: requestId
            })
            setShowLoading(false)
            if (req.accountExists) {
                console.log('Account exists, should redirect to ask for pin')
            } else {
                console.log(`Account doesn't exist, should redirect to name page`)
                navigation.push(`/onboarding/name?${`pncc=${pncc}&pnr=${pnr}&requestId=${req.requestId}`}`)
            }
        } catch (error) {
            console.log(error)
        }

        // () => navigation.push(`/onboarding/name?${encodeURIComponent(
        //     `phoneNumber=` + phoneNumber
        // )}`)
    }

    const onCodeChange = (text: string) => {
        if (showInvalidCode) {
            setShowInvalidCode(false)
        }
        setCode(text)
    }

    return <View style={tw`bg-background flex-1`}>
        <Stack.Screen options={{
            title: t.formatMessage({ id: 'login.title' }),
            headerLeft: (props: HeaderBackButtonProps) => (<MaterialIcons name="arrow-back" size={24} color="black" onPress={() => navigation.back()} />),
            headerShadowVisible: false,
            headerStyle: tw`bg-background shadow-none`
        }}/>
        <View style={tw`p-4 flex-1`}>
            <View style={tw`mb-6`}>
                <Text style={tw`text-primary-800 `}>
                    {t.formatMessage({ id: 'sms-otp.text-1' })}
                </Text>
                <Text style={tw`mb-3 text-primary-800 `}>
                    {t.formatMessage({ id: 'sms-otp.text-2'}, { b: (chunks) => <Text style={tw`font-semibold`}>{chunks}</Text>, phoneNumber: `+${pncc} ${pnr}` } )}
                </Text>
                <TextInput value={code}
                           onChangeText={onCodeChange}
                           placeholder="000000"
                           style={tw`text-2xl`}
                           autoFocus={true}
                           inputMode="numeric"
                           autoComplete="sms-otp"
                           textContentType="oneTimeCode"
                />
                {showInvalidCode && <View style={tw`flex flex-row items-center mt-1`}>
                    <AntDesign name="closecircle" size={12} color="#EA3942" />
                    <Text style={tw`ml-2 text-bad-600`}>Invalid or expired code</Text>
                </View>}
            </View>
            <View>
                <Text style={tw`text-primary-600 font-semibold mb-1`}>Didn't receive it?</Text>
                <View style={tw`flex flex-row`}>
                    <Text style={tw`text-neutral-900`}>Get a new code in</Text>
                    <Text style={tw`text-primary-800 font-semibold`}> 90s</Text>
                </View>
            </View>
            <Pressable onPress={() => Keyboard.dismiss()} style={tw.style([
                isKeyboardVisible ? `h-35` : `flex-1`
            ])}></Pressable>
            <View style={tw`flex flex-row justify-center`}>
                <GoodiesButton title={'Next'}
                               size={'xl'}
                               isPrimary={true}
                               onPress={submit}
                               isLoading={showLoading}
                               active={code.length === 6}/>
            </View>
        </View>
    </View>
}