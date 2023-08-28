import {tw, useParamFetcher} from "../../util/utilities";
import {useIntl} from "react-intl";
import {Stack, useRouter} from "expo-router";
import {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {HeaderBackButtonProps} from "@react-navigation/native-stack/src/types";
import {MaterialIcons} from "@expo/vector-icons";
import {View, Text, Pressable, Keyboard} from "react-native";
import {GoodiesButton} from "../../components/GoodiesButton";

interface OptionComponentProps {
    title: string,
    body: string,
    selected: boolean,
    onPress: () => void
}

const OptionComponent = (props: OptionComponentProps) => {
    return <Pressable style={tw.style(
        `rounded-xl bg-white py-2 px-3 shadow-md`,
        props.selected ? `border border-primary-600` : `border border-white`)}
        onPress={props.onPress}
    >
            <Text style={tw`mb-1 font-600 text-primary-800`}>{props.title}</Text>
            <Text style={tw`text-sm text-neutral-600 leading-relaxed`}>{props.body}</Text>
    </Pressable>
}

export default function DataCollectPage() {
    const { pncc, pnr, requestId, name, promoCode } = useParamFetcher()
    // note: promoCode might be ''
    const t = useIntl()
    const navigation = useRouter();
    const [selection, setSelection] = useState<string>("")

    const submit = async () => {
        // after saving token
        navigation.push(`/`)
    }

    return <SafeAreaView style={tw`bg-background flex flex-1`}>
        <Stack.Screen options={{
            title: t.formatMessage({ id: 'sign-up.title' }),
            headerLeft: (props: HeaderBackButtonProps) => (<MaterialIcons name="arrow-back" size={24} color="black" onPress={() => navigation.back()} />),
            headerShadowVisible: false,
            headerStyle: tw`bg-background`
        }}/>
        <View style={tw`p-4 flex flex-1`}>
            <Text style={tw`text-[18px] font-600 mb-3`}>
                {t.formatMessage({ id: 'sign-up.data.list.label' })}
            </Text>
            <View style={tw`mb-2`}>
                <OptionComponent
                    title={t.formatMessage({ id: 'sign-up.data.vegetarian.title'})}
                    body={t.formatMessage({ id: 'sign-up.data.vegetarian.description'})}
                    selected={selection === 'vegetarian'}
                    onPress={() => setSelection('vegetarian')}
                />
            </View>
            <View style={tw`mb-2`}>
                <OptionComponent
                    title={t.formatMessage({ id: 'sign-up.data.vegan.title'})}
                    body={t.formatMessage({ id: 'sign-up.data.vegan.description'})}
                    selected={selection === 'vegan'}
                    onPress={() => setSelection('vegan')}
                />
            </View>
            <View style={tw`mb-3`}>
                <OptionComponent
                    title={t.formatMessage({ id: 'sign-up.data.exploring.title'})}
                    body={t.formatMessage({ id: 'sign-up.data.exploring.description'})}
                    selected={selection === 'exploring'}
                    onPress={() => setSelection('exploring')}
                />
            </View>
            <Text style={tw`text-neutral-600 text-sm leading-relaxed`}>*{t.formatMessage({ id: 'sign-up.data.list.helperText'})}</Text>
            <View style={tw.style([
                `flex-1`
            ])}></View>
            <View style={tw`flex flex-row justify-center`}>
                <GoodiesButton title={'Skip'}
                               size={'xl'}
                               isPrimary={false}
                               onPress={submit}/>
                <GoodiesButton title={'Next'}
                               size={'xl'}
                               isPrimary={true}
                               onPress={submit}
                               active={selection !== ""}/>
            </View>
        </View>
     </SafeAreaView>
}