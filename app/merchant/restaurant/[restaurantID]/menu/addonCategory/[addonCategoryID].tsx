import {View, Text, RadioGroup, RadioButton} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import {useEffect, useMemo, useState} from "react";
import {InternalTextField} from "../../../../../../components/InternalTextField";
import {CardItem} from "../../../../../../components/CardItem";
import {trpc} from "../../../../../../util/api";
import {AIEACT, ANMS, getName, useParamFetcher} from "../../../../../../util/utilities";
import {Stack, useRouter } from "expo-router";

const ViewWrapper = ({ children }) => {
    return <ScrollView>
        <Stack.Screen options={{ title: 'Edit Addon Category' }}/>
        {children}
    </ScrollView>
}

export const Edit = ({ route }) => {
    const navigation = useRouter()
    const { restaurantID, addonCategoryID } = useParamFetcher()
    const [names, setNames] = useState<{[languageCode: string]: string}>({
        'en': '',
        'vi': ''
    })

    const [catType, setCatType] = useState<'pickOne' | 'multipleChoice'>('pickOne')
    const addonCategoriesReq = trpc.getRestaurantAddonCategories.useQuery({ restaurantID })
    const addonsReq = trpc.getRestaurantFoodAddons.useQuery({ restaurantID })

    if (!addonCategoriesReq.data || !addonsReq.data) return <ViewWrapper><Text>Loading...</Text></ViewWrapper>

    const addonCat = addonCategoriesReq.data.find((f) => f.id === addonCategoryID)

    useEffect(() => {
        setCatType(AIEACT(addonCat.type))
        setNames(ANMS(addonCat.names))
    }, [addonCat])

    const mutation = trpc.patchRestaurantFoodAddonCategory.useMutation()
    const selectedAddons = useMemo(() => {
        // addon is in addonCat's addons list
        return addonsReq.data.filter((addon) => addonCat.addons.map((a) => a.id).includes(addon.id))
    }, [addonsReq, addonCategoriesReq])

    const unselectedAddons = useMemo(() => {
        // addon is in addonCat's addons list
        return addonsReq.data.filter((addon) => !addonCat.addons.map((a) => a.id).includes(addon.id))
    }, [addonsReq, addonCategoriesReq])

    const addAddon = async (addonID) => {
        await mutation.mutateAsync({
            restaurantID,
            addonCategoryID,
            addons: addonCat.addons.map((a) => a.id).concat(addonID)
        })
        await addonCategoriesReq.refetch()
    }

    const removeAddon = async (addonID) => {
        await mutation.mutateAsync({
            restaurantID,
            addonCategoryID,
            addons: addonCat.addons.map((a) => a.id).filter((a) => a !== addonID)
        })
        await addonCategoriesReq.refetch()
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
            <RadioGroup
                initialValue={catType}
                onValueChange={setCatType}
                style={{ flexDirection: 'column', alignItems: 'flex-start' }}
            >
                <RadioButton value="multipleChoice" label="Multiple Choice" />
                <RadioButton value="pickOne" label="Pick One" />
            </RadioGroup>

            <CardItem label='Save'
                      color='action'
                      onPress={() => { mutation.mutate({
                          restaurantID,
                          addonCategoryID,
                          names,
                          type: catType
                      }) }}/>
            <View style={{ height: 20 }}></View>
            {/* https://stackoverflow.com/a/61611734 */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                <View>
                    <Text style={{width: 50, textAlign: 'center'}}>Addons</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            </View>
            {selectedAddons.map((a) => <CardItem key={a.id}>
                <View padding-15>
                    <Text>{getName(a.names)}</Text>
                </View>
                <View flex right>
                    <Text style={{ color: 'red' }}
                          onPress={() => removeAddon(a.id)}>
                        Remove
                    </Text>
                </View>
            </CardItem>)}
            {unselectedAddons.map((a) => <CardItem key={a.id}>
                    <View padding-15>
                        <Text>{getName(a.names)}</Text>
                    </View>
                    <View flex right>
                        <Text style={{ color: 'green' }}
                              onPress={() => addAddon(a.id)}>
                            Add
                        </Text>
                    </View>
                </CardItem>)}


        </View>
    </ViewWrapper>
}

export default Edit