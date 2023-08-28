import {PixelRatio} from "react-native";
import * as PrismaClient from "@prisma/client"
import {useSearchParams} from "expo-router";
import {NameMap} from "./types";
import { create } from 'twrnc'

export const px = (units: number) => units * PixelRatio.get();

export const formatPrice = (price: number) => {
    return price.toLocaleString('en-US') + 'đ'
}

export const getName = (nameMap: { [languageCode: string]: string } | PrismaClient.Prisma.JsonValue, currentLanguage: string='en') => {
    if (typeof nameMap !== 'object') return ''

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

export const getNumber = (input: string | string[]): number => {
    if (typeof input === 'string') {
        return parseInt(input)
    } else if (Array.isArray(input)) {
        return getNumber(input[0])
    } else {
        throw new Error('getNumber got invalid input')
    }
}

export const getString = (input: string | string[]): string => {
    if (typeof input === 'string') {
        return input
    } else if (Array.isArray(input)) {
        return getString(input[0])
    } else {
        throw new Error('getString got invalid input')
    }
}

export const useParamFetcher = () => {
    const searchParams = useSearchParams()
    return {
        get restaurantID () {
            return getNumber(searchParams.restaurantID?.toString() || '0')
        },
        get foodItemID () {
            return getNumber(searchParams.foodItemID?.toString() || '0')
        },
        get categoryID () {
            return getNumber(searchParams.categoryID?.toString() || '0')
        },
        get addonID () {
            return getNumber(searchParams.addonID?.toString() || '0')
        },
        get addonCategoryID () {
            return getNumber(searchParams.addonCategoryID?.toString() || '0')
        },
        get requestId () {
            return getString(searchParams.requestId || '0')
        },
        get pncc () {
            return getString(searchParams.pncc || '0')
        },
        get pnr () {
            return getString(searchParams.pnr || '0')
        },
        get name () {
            return getString(searchParams.name || '')
        },
        get promoCode() {
            return getString(searchParams.promoCode || '')
        }
    }
}

export const assertNameMapShape = (nameMap: PrismaClient.Prisma.JsonValue): NameMap => {
    // nameMap is a JSON value, first assert it is a JSON object
    if (typeof nameMap !== 'object') throw new Error('nameMap is not a JSON object')
    // then assert it has properties 'en' and 'vi'
    if (!('en' in nameMap)) throw new Error('nameMap does not have property "en"')
    if (!('vi' in nameMap)) throw new Error('nameMap does not have property "vi"')
    // then assert the values of properties 'en' and 'vi' are strings
    if (typeof nameMap.en !== 'string') throw new Error('nameMap.en is not a string')
    if (typeof nameMap.vi !== 'string') throw new Error('nameMap.vi is not a string')
    // finally, return the nameMap as a NameMap
    return nameMap as NameMap
}

export const ANMS = assertNameMapShape

export const assertIsEnumAddonCategoryType = (type: string): 'pickOne' | 'multipleChoice' => {
    if (type !== 'pickOne' && type !== 'multipleChoice') throw new Error('type is not a valid enum value')
    return type as 'pickOne' | 'multipleChoice'
}

export const AIEACT = assertIsEnumAddonCategoryType

export const tw = create(require('../tailwind.config.js'))
