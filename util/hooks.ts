import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback} from 'react';

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
