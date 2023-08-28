import {ReactElement} from "react";
import {Pressable, Text, View} from "react-native";
import {tw} from "../util/utilities";

export interface GoodiesButtonProps {
    title: string
    size: 'sm' | 'md' | 'lg' | 'xl'
    isPrimary: boolean
    onPress: () => void
    leftSvg?: ReactElement
    fontBold?: boolean
    active?: boolean // disabled
}

export function GoodiesButton({ fontBold = true, active = true, ...props }: GoodiesButtonProps) {
    return <Pressable onPress={props.onPress} disabled={!active} style={tw.style(
        `rounded-[22] m-2`,
        props.isPrimary ? (
            active ? `bg-primary-600` : `bg-primary-100`
        ) : `bg-opacity-0 border border-primary-600`,
        props.size === 'xl' && `basis-1/2 pt-[12] pb-[12] pl-[32] pr-[32]`,
        props.size === 'lg' && `basis-1/2 p-4`,
        props.size === 'md' && `basis-1/2 p-2`,
        props.size === 'sm' && `basis-1/4 p-2`)}>
        <>
            <View style={tw`flex flex-row w-full items-center justify-center`}>
                {props.leftSvg}
                <Text style={tw.style(`text-center`,
                    fontBold ? `font-bold` : null,
                    props.isPrimary ? `text-white` : `text-primary-600`,
                    props.leftSvg !== undefined && `ml-2`
                )}>{props.title}</Text>
            </View>
        </>
    </Pressable>

}