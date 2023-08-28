import {View, Text} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import {useState} from "react";
import {CardItem} from "../../../../../../components/CardItem";
import {trpc} from "../../../../../../util/api";
import {InternalTextField} from "../../../../../../components/InternalTextField";


export const CreateFoodScreen = ({ navigation, route }) => {
    const [names, setNames] = useState<{[languageCode: string]: string}>({
        'en': '',
        'vi': ''
    })
    const [descriptions, setDescriptions] = useState<{[languageCode: string]: string}>({
        'en': '',
        'vi': ''
    })
    const [price, setPrice] = useState(0)

    const restaurantID: string = route.params.restaurantID
    const mutation = trpc.createRestaurantFoodItem.useMutation()

    return <ScrollView>
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
                <Text>If you want to edit the visibility, availability, or add-ons to this Food Item, please create
                it first and then edit the food item to see those fields.</Text>
                <CardItem label='Create'
                          disable={mutation.isLoading || mutation.isSuccess}
                          color='action'
                          onPress={() => { mutation.mutate({
                              restaurantID,
                              names,
                              descriptions,
                              price: Math.floor(price),
                              inStock: true,
                              visible: true
                          }) }}/>
            </>)}
        </View>
    </ScrollView>
}

export default CreateFoodScreen