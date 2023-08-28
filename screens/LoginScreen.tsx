import {createRef, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SafeAreaView} from "react-native-safe-area-context";
import {ScrollView, Text } from "react-native";
import {Button, Colors, TextField, View} from "react-native-ui-lib";
import {px} from "../util/utilities";

export const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('email');
    const [password, setPassword] = useState('');

    const textFieldDefaults = { 'migrate': true, 'floatingPlaceholder': true } // TODO: don't autocap

    const submit = async () => {
        console.log('Sending login request')
        const res = await fetch('http://127.0.0.1:3000/login/email', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        const body = await res.json()
        console.log(body)
        await AsyncStorage.setItem('token', body.sessionKey)
        navigation.navigate('Home')
    }

    let emailField = createRef()

    useEffect(() => {
        // @ts-ignore
        emailField.current.focus()
    }, [])
    // Update to use keybaord avoiding view
    return (
        <ScrollView style={{ 'display': 'flex' }}
                    contentContainerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 200
        }}
        >
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