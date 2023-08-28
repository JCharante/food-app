import {PixelRatio} from "react-native";

export const px = (units: number) => units * PixelRatio.get();

export const formatPrice = (price: number) => {
    return price.toLocaleString('en-US') + 'đ'
}