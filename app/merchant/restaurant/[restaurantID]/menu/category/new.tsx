import {View, Text, Incubator} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import {useState} from "react";
import {CardItem} from "../../../../../../components/CardItem";
import {trpc} from "../../../../../../util/api";
import {InternalTextField} from "../../../../../../components/InternalTextField";
import {Stack, useRouter, useSearchParams} from "expo-router";

const { TextField } = Incubator


export const CreateCategoryScreen = ({ route }) => {
    const navigation = useRouter()
    const restaurantID = useSearchParams().restaurantID?.toString() || ''
    const [names, setNames] = useState<{[languageCode: string]: string}>({
        'en': '',
        'vi': ''
    })

    const mutation = trpc.createRestaurantCategory.useMutation()

    return <ScrollView >
        <Stack.Screen options={{ title: 'New Category' }}/>
        <View padding-15>
            {mutation.isLoading ? <Text>Loading...</Text> : (<>
                {mutation.isSuccess ? <Text>Success</Text> : null}
                {mutation.isError ? <Text>Error {mutation.error.message}</Text> : null}
                <InternalTextField value={names['en']}
                           label='English'
                           onChangeText={(v) => setNames({ ...names, 'en': v })}
                           maxLength={50}
                />
                <InternalTextField value={names['vi']}
                           label='Vietnamese'
                           onChangeText={(v) => setNames({ ...names, 'vi': v })}
                           maxLength={50}
                />
                <CardItem label='Create'
                          disable={mutation.isLoading || mutation.isSuccess}
                          color='action'
                          onPress={() => { mutation.mutate({ restaurantID, names}) }}/>
            </>)}

        </View>
    </ScrollView>
}

export default CreateCategoryScreen