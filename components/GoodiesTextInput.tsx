import {TextInput, View, Text} from "react-native";
import {tw} from "../util/utilities";

export interface GoodiesTextInputProps {
    value: string
    onChangeText: (text: string) => void
    placeholder: string
    label: string
    helperText?: string
    autoComplete?: 'off' | 'given-name'
}

export const GoodiesTextInput = (props: GoodiesTextInputProps) => {
    return <View>
        <Text style={tw`mb-3 text-lg font-semibold`}>{props.label}</Text>
        <TextInput
            value={props.value}
            onChangeText={props.onChangeText}
            placeholder={props.placeholder}
            // @ts-ignore
            autoComplete={props.autoComplete === undefined ? 'off': props.autoComplete}
            style={tw.style(`rounded-lg border-primary-100 border text-primary-800 bg-white p-3 mb-1 shadow`)}
        />
        {props.helperText && <Text style={tw`text-xs text-neutral-600`}>*{props.helperText}</Text>}
    </View>
}