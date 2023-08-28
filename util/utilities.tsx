import {PixelRatio} from "react-native";

export const px = (units: number) => units * PixelRatio.get();

export const formatPrice = (price: number) => {
    return price.toLocaleString('en-US') + 'đ'
}

export const getName = (nameMap: { [languageCode: string]: string }, currentLanguage: string='en') => {
    if (currentLanguage in nameMap) {
        return nameMap[currentLanguage]
    } else if ('en' in nameMap) {
        return nameMap.en
    } else if ('vi' in nameMap) {
        return nameMap.vi
    } else {
        return ''
    }
}
