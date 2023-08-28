import {ReactElement} from "react";
import {ActivityIndicator, Modal, Pressable, Text, View} from "react-native";
import {tw} from "../util/utilities";

export interface GoodiesButtonProps {
    title: string
    size: 'sm' | 'md' | 'lg' | 'xl'
    isPrimary: boolean
    onPress: () => void
    leftSvg?: ReactElement
    fontBold?: boolean
    active?: boolean // disabled
    isLoading?: boolean
    loadingType?: 'spinner' | 'modal'
}


export function GoodiesButton({ fontBold = true, active = true, isLoading = false, loadingType = 'spinner', ...props }: GoodiesButtonProps) {
    return <><Pressable onPress={props.onPress} disabled={!active} style={tw.style(
        `rounded-[22] m-2`,
        props.isPrimary ? (
            active && !isLoading ? `bg-primary-600` : `bg-primary-100`
        ) : `bg-opacity-0 border border-primary-600`,
        props.size === 'xl' && `basis-1/2 pt-[12] pb-[12] pl-[32] pr-[32]`,
        props.size === 'lg' && `basis-1/2 p-4`,
        props.size === 'md' && `basis-1/2 p-2`,
        props.size === 'sm' && `basis-1/4 p-2`)}>
        <>
            <View style={tw`flex flex-row w-full items-center justify-center`}>
                {isLoading && loadingType === 'spinner'
                    ? <ActivityIndicator style={tw`mr-2`} size={"small"} color={"white"}/>
                    : <>
                    {props.leftSvg}
                    <Text style={tw.style(`text-center`,
                    fontBold ? `font-bold` : null,
                    props.isPrimary ? `text-white` : `text-primary-600`,
                    props.leftSvg !== undefined && `ml-2`
                    )}>{props.title}</Text>
                    </>
                }
            </View>
        </>
    </Pressable>
    {loadingType === 'modal' &&
        <Modal visible={isLoading}
               transparent={true}
               style={tw`flex flex-1 `}>
            <View style={tw`flex flex-1 bg-white bg-opacity-80 justify-center items-center`}>
                <View style={tw`p-5 border rounded-2xl border-[#F9F9F9] bg-white`}>
                    <ActivityIndicator style={tw`mr-0`} size={"large"} color={"#2AC3EC"}/>
                </View>
            </View>
        </Modal>
    }
    </>

}