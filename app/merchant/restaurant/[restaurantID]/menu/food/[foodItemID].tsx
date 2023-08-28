import {View, Text, Incubator, Card, Button} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import {KeyboardAvoidingView, Platform} from "react-native";
import {useContext, useEffect, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {manipulateAsync, SaveFormat} from "expo-image-manipulator";
import {Stack, useRouter, useSearchParams} from "expo-router";
import {NameMap} from "../../../../../../util/types";
import {trpc} from "../../../../../../util/api";
import {useRefetchOnFocus} from "../../../../../../util/hooks";
import {InternalTextField} from "../../../../../../components/InternalTextField";
import {CardItem} from "../../../../../../components/CardItem";
import {getName} from "../../../../../../util/utilities";

const { TextField } = Incubator

const ViewWrapper = ({ children }) => {
    return <ScrollView>
        <Stack.Screen options={{ title: 'Edit Food' }}/>
        {children}
    </ScrollView>
}
export const EditFoodScreen = ({ }) => {
    const navigation = useRouter()
    const restaurantID = useSearchParams().restaurantID?.toString() || ''
    const foodItemID = useSearchParams().foodItemID?.toString() || ''
    const [names, setNames] = useState<NameMap>({
        'en': '',
        'vi': ''
    })
    const [descriptions, setDescriptions] = useState<NameMap>({
        'en': '',
        'vi': ''
    })
    const [price, setPrice] = useState(0)

    const foodItemsReq = trpc.getRestaurantFoodItems.useQuery({ restaurantID })
    useRefetchOnFocus(foodItemsReq.refetch)
    const addonCatsReq = trpc.getRestaurantAddonCategories.useQuery({ restaurantID })
    useRefetchOnFocus(addonCatsReq.refetch)
    const foodItemMutation = trpc.patchRestaurantFoodItem.useMutation()
    const putImageMutation = trpc.requestPutFoodItemPicture.useMutation()

    const foodItem = foodItemsReq.data.find((f) => f._id === foodItemID)

    useEffect(() => {
        if (!foodItemsReq.data) {
            return
        }
        setNames(foodItem.names)
        setDescriptions(foodItem.descriptions)
        setPrice(foodItem.price)
    }, [foodItem])

    if (!foodItemsReq.data || !addonCatsReq.data) return <ViewWrapper><Text>Loading...</Text></ViewWrapper>
    if (foodItem === undefined) return <ViewWrapper><Text>An error occurred.</Text></ViewWrapper>


    const addons = addonCatsReq.data

    const addonCatsSelected = addons.filter((cat) => foodItem.addons.includes(cat._id))
    const addonCatsUnselected = addons.filter((cat) => !foodItem.addons.includes(cat._id))

    const addAddonCat = async (addonCatID) => {
        await foodItemMutation.mutateAsync({
            restaurantID,
            foodItemID,
            names,
            descriptions,
            price,
            addons: foodItem.addons.concat(addonCatID)
        })
        await foodItemsReq.refetch()
    }

    const removeAddonCat = async (addonCatID) => {
        await foodItemMutation.mutateAsync({
            restaurantID,
            foodItemID,
            names,
            descriptions,
            price,
            addons: foodItem.addons.filter((id) => id !== addonCatID)
        })
        await foodItemsReq.refetch()
    }

    const newPictureFlow = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1
        });

        if (pickerResult.assets.length === 0) return

        const img = await manipulateAsync(
            pickerResult.assets[0].uri,
            [{ resize: { width: 500 } }],
            { format: SaveFormat.JPEG, compress: 1, base64: false }
        )

        const url = await putImageMutation.mutateAsync({ restaurantID, foodItemID: foodItem._id })

        const localUri = img.uri;
        const fileExtension = localUri.split('.').pop();
        const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

        // Append the file to the FormData instance
        if (Platform.OS === 'android') {
            console.error('Uploading from android not yet supported')
        } else {
            const response = await fetch(localUri);
            const blob = await response.blob();


            const uploadResponse = await fetch(url, {
                method: 'PUT',
                body: blob,
                headers: {
                    'Content-Type': mimeType,
                },
            });

            if (uploadResponse.ok) {
                console.log('Image uploaded successfully');
                await foodItemsReq.refetch()
            } else {
                const errorText = await uploadResponse.text();
                console.error('Error uploading image', errorText);
            }
        }
    };

    const content = () => <KeyboardAvoidingView>
        <ViewWrapper>
            <View padding-15 flex>
                <View>
                    <Card
                        height={200}
                        width={200}
                    >
                        <Card.Image height={200} width={200} source={{ uri: foodItem.pictureURL }} />
                    </Card>
                </View>
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
                <CardItem label="Upload Picture"
                          color="action"
                          onPress={newPictureFlow}
                          />
                <CardItem label="Save Changes"
                          color="action"
                          onPress={() => {
                                foodItemMutation.mutate({
                                    restaurantID,
                                    foodItemID,
                                    names,
                                    descriptions,
                                    price
                                })
                          }}
                />
            </View>
            {/* https://stackoverflow.com/a/61611734 */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                <View>
                    <Text style={{width: 50, textAlign: 'center'}}>Addon Categories</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            </View>
            <View padding-15 flex>
                {addonCatsSelected.map((cat) => <>
                    <CardItem
                        key={cat._id.toString()}
                        color="info"
                        onPress={() => {}}
                    >
                        <View padding-15>
                            <Text>{getName(cat.names)}</Text>
                        </View>
                        <View flex right>
                            <Text style={{ color: 'red' }}
                                  onPress={() => removeAddonCat(cat._id)}>
                                Remove
                            </Text>
                        </View>
                    </CardItem>
                </>)}
                {addonCatsUnselected.map((cat) => <>
                    <CardItem
                        key={cat._id.toString()}
                        color="info"
                        onPress={() => {}}
                    >
                        <View padding-15>
                            <Text>{getName(cat.names)}</Text>
                        </View>
                        <View flex right>
                            <Text style={{ color: 'green' }}
                                  onPress={() => addAddonCat(cat._id)}>
                                Add
                            </Text>
                        </View>
                    </CardItem>
                </>)}
            </View>
        </ViewWrapper>
    </KeyboardAvoidingView>

    return foodItem === null ? <Text>Loading...</Text> : content()
}

export default EditFoodScreen