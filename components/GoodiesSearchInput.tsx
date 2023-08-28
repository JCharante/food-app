import {TextInput, View} from "react-native";
import {tw, twConfig} from "../util/utilities";
import { Ionicons } from '@expo/vector-icons';

export interface GoodiesSearchInputProps {
    value: string
    setValue: (text: string) => void
    placeholder?: string
}

export const GoodiesSearchInput = (props: GoodiesSearchInputProps) => {
    return <View style={tw`flex flex-row bg-white shadow-sm w-10/12 py-[10px] pl-3 rounded-lg`}>
        <Ionicons
            name="search-outline"
            size={24}
            color={twConfig.theme.colors.neutral[800]}
        />
        <TextInput
            value={props.value}
            onChangeText={props.setValue}
            placeholder={props.placeholder}
            style={tw.style(`bg-white text-neutral-600 pl-2`)}
            autoFocus={false}
        />
    </View>
}