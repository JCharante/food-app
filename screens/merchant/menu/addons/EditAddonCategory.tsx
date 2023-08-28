import {View, Text, RadioGroup, RadioButton} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import {useEffect, useState} from "react";
import {InternalTextField} from "../../../../components/InternalTextField";
import {CardItem} from "../../../../components/CardItem";
import {trpc} from "../../../../util/api";



export const EditAddonCategory = ({ navigation, route }) => {
    const { addonCategoryID } = route.params
    const [names, setNames] = useState<{[languageCode: string]: string}>({
        'en': '',
        'vi': ''
    })

    const [catType, setCatType] = useState<'pickOne' | 'multipleChoice'>('pickOne')
    const { restaurantID } = route.params
    const addonCategoriesReq = trpc.getRestaurantAddonCategories.useQuery({ restaurantID })

    if (!addonCategoriesReq.data) return <View><Text>Loading...</Text></View>

    const addonCat = addonCategoriesReq.data.find((f) => f._id === addonCategoryID)

    useEffect(() => {
        setCatType(addonCat.type)
        setNames(addonCat.names)
    }, [addonCat])

    const mutation = trpc.patchRestaurantFoodAddonCategory.useMutation()

    return <ScrollView >
        <View padding-15>
            {mutation.isLoading ? <Text>Loading...</Text> : (<>
                {mutation.isSuccess ? <Text>Success</Text> : null}
                {mutation.isError ? <Text>Error {mutation.error.message}</Text> : null}
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
                          disable={mutation.isLoading || mutation.isSuccess}
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
            </>)}

        </View>
    </ScrollView>
}