import {View, Text, Incubator} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import {useState} from "react";
import {CardItem} from "../../../../components/CardItem";
import {trpc} from "../../../../util/api";
import {InternalTextField} from "../../../../components/InternalTextField";

const { TextField } = Incubator


export const CreateCategoryScreen = ({ navigation, route }) => {
    const [names, setNames] = useState<{[languageCode: string]: string}>({
        'en': '',
        'vi': ''
    })

    const restaurantID: string = route.params.restaurantID
    const mutation = trpc.createRestaurantCategory.useMutation()

    return <ScrollView >
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