import { Card, View, Text } from "react-native-ui-lib";
import React from "react";

export interface CardItemProps {
    leftImageURL?: string;
    children?: React.ReactNode;
    onPress?: () => void;
    label?: string;
    disable?: boolean;
    color?: "info" | "action" | "disabled";
}

const colors = {
    info: "#FEFCF3", // https://colorhunt.co/palette/fefcf3f5ebe0f0dbdbdba39a
    action: "#B9F3FC", // https://colorhunt.co/palette/b9f3fcaee2ff93c6e7fedeff
    disabled: "#FEDEFF",
};

export const CardItem = (props: CardItemProps) => {
    const backgroundColor = props.disable ? colors.disabled : colors[props.color || "info"];

    return (
        <Card
            style={{ marginBottom: 5, marginTop: 5 }}
            borderRadius={20}
            row
            padding-15
            centerV
            onPress={props.disable ? () => {} : props.onPress}
            backgroundColor={backgroundColor}
        >
            {props.label ? (
                <View padding-15 flex>
                    <Text>{props.label}</Text>
                </View>
            ) : null}
            {props.children}
        </Card>
    );
};