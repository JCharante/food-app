import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {usePathname} from "expo-router";

export const useRefetchOnFocus = (refetch: () => void) => {
    // TODO: make this work for expo-router v1
    // useFocusEffect(() => {
    //     refetch();
    // });
    /* Maybe subscribe to App state here too */
};

export interface IRefetchContext {
    url: string,
    hasRefetched: boolean,
    setHasRefetched: (hasRefetched: boolean) => void,
}

export const RefetchContext = React.createContext<IRefetchContext>({
    url: '',
    hasRefetched: false,
    setHasRefetched: () => {}
})

export const useRefetch = (requests) => {
    const pathname = usePathname();
    const { url, hasRefetched, setHasRefetched } = React.useContext(RefetchContext)


    useEffect(() => {
        if (pathname === url) {
            if (!hasRefetched && requests.some(r => r.isFetched)) {
                setHasRefetched(true)
                requests.forEach(r => r.refetch().then(() => {}))
            }
        }
    }, [url, hasRefetched])
}

export interface ILanguageSwitcherContext {
    locale: string,
    setLocale: (language: string) => void,
}

export const LanguageSwitcherContext = React.createContext<ILanguageSwitcherContext>({
    locale: '',
    setLocale: (locale: string) => {}
})