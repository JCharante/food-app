import {View, Text} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import {useEffect, useState} from "react";
import {CardItem} from "../../../../../../components/CardItem";
import {trpc} from "../../../../../../util/api";
import {InternalTextField} from "../../../../../../components/InternalTextField";
import {Switch} from "react-native";
import {Stack, useRouter, useSearchParams} from "expo-router";
import {ANMS, useParamFetcher} from "../../../../../../util/utilities";

const ViewWrapper = ({ children }) => {
    return <ScrollView>
        <Stack.Screen options={{ title: 'Edit Addon' }}/>
        {children}
    </ScrollView>
}

export const EditFoodAddon = ({ route }) => {
    const navigation = useRouter()
    const { restaurantID, addonID } = useParamFetcher()
    const [names, setNames] = useState<{[languageCode: string]: string}>({
        'en': '',
        'vi': ''
    })
    const [descriptions, setDescriptions] = useState<{[languageCode: string]: string}>({
        'en': '',
        'vi': ''
    })
    const [price, setPrice] = useState(0)
    const [inStock, setInStock] = useState(true)
    const [visible, setVisible] = useState(true)

    const addonsReq = trpc.getRestaurantFoodAddons.useQuery({ restaurantID })
    const mutation = trpc.patchFoodAddon.useMutation()

    if (!addonsReq.data) {
        return <ViewWrapper><Text>Loading...</Text></ViewWrapper>
    }

    const addon = addonsReq.data.find(a => a.id === addonID)
    if (!addon) {
        return <ViewWrapper><Text>Cannot find addon</Text></ViewWrapper>
    }

    useEffect(() => {
        setNames(ANMS(addon.names))
        setDescriptions(ANMS(addon.descriptions))
        setPrice(addon.price)
        setInStock(addon.inStock)
        setVisible(addon.visible)
    }, [addon])

    const save = async () => {
        await mutation.mutateAsync({
            restaurantID,
            addonID,
            names,
            descriptions,
            price: Math.floor(price),
            inStock,
            visible
        })
        await addonsReq.refetch()
    }

    return <ViewWrapper>
        <View padding-15>
            <InternalTextField value={names['en']}
                               label='Name in English'
                               onChangeText={(v) => setNames({ ...names, 'en': v })}
                               maxLength={50}
            />
            <InternalTextField value={names['vi']}
                               label='Name in Vietnamese'
                               onChangeText={(v) => setNames({ ...names, 'vi': v })}
                               maxLength={50}
            />
            <InternalTextField value={descriptions['en']}
                               label='Description in English'
                               onChangeText={(v) => setDescriptions({ ...descriptions, 'en': v })}
                               maxLength={200}
            />
            <InternalTextField value={descriptions['vi']}
                               label='Description in Vietnamese'
                               onChangeText={(v) => setDescriptions({ ...descriptions, 'vi': v })}
                               maxLength={200}
            />
            <InternalTextField value={price.toString()}
                               label="Price"
                               validate={'number'}
                               onChangeText={(v) => v === '' ? setPrice(0) : setPrice(parseInt(v))}
            />
            <Text>In Stock:</Text>
            <Switch
                value={inStock}
                onValueChange={(newValue) => setInStock(newValue)}
            />
            <Text>Visible:</Text>
            <Switch
                value={visible}
                onValueChange={(newValue) => setVisible(newValue)}
            />
            <CardItem label='Save'
                      color='action'
                      onPress={save}/>
        </View>
    </ViewWrapper>
}

export default EditFoodAddon