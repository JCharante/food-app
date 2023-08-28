import {View, Text, Pressable} from "react-native";
import {tw, twConfig} from "../util/utilities";
import { Ionicons } from '@expo/vector-icons';

export interface GoodiesBoxProps {
    text: string
    onPress?: () => void
}

export const GoodiesBox = (props: GoodiesBoxProps) => {
    return <Pressable
        style={tw`flex flex-row h-[44px] bg-white shadow-md rounded-lg justify-between my-1`}
        onPress={props.onPress}
    >
        <Text style={tw`py-3 pl-3 pr-2 text-primary-800 font-semibold`}>{props.text}</Text>
        <Ionicons style={tw`py-2 pr-3`} name="chevron-forward-outline" size={24} color={twConfig.theme.colors.neutral[800]} />
    </Pressable>
}