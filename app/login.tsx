import {createRef, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SafeAreaView} from "react-native-safe-area-context";
import {ScrollView, Text } from "react-native";
import {Button, Colors, TextField, View} from "react-native-ui-lib";
import {px} from "../util/utilities";
import {baseURL, trpc} from "../util/api";
import {Stack, useRouter} from "expo-router";
import {useIntl} from "react-intl";

export default function LoginScreen () {
    const navigation = useRouter()
    const loginMutation = trpc.loginWithEmail.useMutation()
    const t = useIntl()

    const [email, setEmail] = useState('email');
    const [password, setPassword] = useState('');
    const textFieldDefaults = { 'migrate': true, 'floatingPlaceholder': true } // TODO: don't autocap

    const submit = async () => {
        // TODO: have to re-load app before this works
        console.log('Sending login request')
        const req = await loginMutation.mutateAsync({ email, password })
        if (req.sessionKey) {
            console.log('Saving token')
            await AsyncStorage.setItem('token', req.sessionKey)
            navigation.push('/')
        }
    }

    let emailField = createRef()

    useEffect(() => {
        // @ts-ignore
        emailField.current.focus()
    }, [])
    // Update to use keyboard avoiding view
    return (
        <ScrollView style={{ 'display': 'flex' }}
                    contentContainerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 200
                    }}
        >
            <Stack.Screen options={{ title: t.formatMessage({ id: 'login.title'}), headerBackVisible: false }}/>
            <View flex style={{ maxWidth: 400, width: '70%'}}>
                <View flex centerH>
                    <Text>Login with Email</Text>
                    <TextField placeholder='Email'
                               {...textFieldDefaults}
                               onChangeText={setEmail}
                               validate={['required', 'email', (value) => value.length > 6]}
                               validationMessage={['Field is required', 'Email is invalid', 'Email is too short']}
                               style={{ marginTop: px(5) }}
                               ref={emailField}
                    />
                    <TextField placeholder='Password'
                               {...textFieldDefaults}
                               onChangeText={setPassword}
                               style={{ marginTop: px(5) }}
                    />
                </View>
                <Button label={'Login'}
                        size={Button.sizes.medium}
                        backgroundColor={Colors.red30}
                        style={{ marginTop: px(10) }}
                        onPress={submit}
                />
            </View>
        </ScrollView>
    )
}