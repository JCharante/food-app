import {Card, View, Text} from "react-native-ui-lib";
import React from "react";

export interface CardItemProps {
    leftImageURL?: string
    children?: React.ReactNode,
    onPress?: () => void,
    label?: string
}

export const CardItem = (props: CardItemProps) => {
    return <Card style={{ marginBottom: 5, marginTop: 5 }}
                 borderRadius={20}
                 row
                 padding-15
                 centerV
                 onPress={props.onPress}
    >
        {props.label ? (
            <View padding-15 flex><Text>{props.label}</Text></View>
        ) : null}
        {props.children}
    </Card>
}