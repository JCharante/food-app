import {View, Text, RadioGroup, RadioButton} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import {useState} from "react";
import {InternalTextField} from "../../../../components/InternalTextField";
import {CardItem} from "../../../../components/CardItem";
import {trpc} from "../../../../util/api";



export const CreateFoodAddonCategoryScreen = ({ navigation, route }) => {
    const [names, setNames] = useState<{[languageCode: string]: string}>({
        'en': '',
        'vi': ''
    })

    const [catType, setCatType] = useState<'pickOne' | 'multipleChoice'>('pickOne')
    const { restaurantID } = route.params
    const mutation = trpc.createRestaurantFoodAddonCategory.useMutation()

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

                <CardItem label='Create'
                          disable={mutation.isLoading || mutation.isSuccess}
                          color='action'
                          onPress={() => { mutation.mutate({
                              restaurantID,
                              names,
                              type: catType
                          }) }}/>
            </>)}

        </View>
    </ScrollView>
}