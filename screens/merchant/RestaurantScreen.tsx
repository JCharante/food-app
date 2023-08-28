import {View, Text} from "react-native-ui-lib";
import {CardItem} from "../../components/CardItem";
import {getName} from "../../util/utilities";
import {trpc} from "../../util/api";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import {Platform} from "react-native";
import * as FileSystem from 'expo-file-system';
import base64 from 'react-native-base64';


export const RestaurantScreen = ({ navigation, route  }) => {
    const restaurantID = route.params.restaurantID
    const restaurants = trpc.userGetRestaurants.useQuery()
    const postImageMutation = trpc.postRestaurantImage.useMutation()
    if (!restaurants.data) return <View><Text>Loading...</Text></View>

    const data = restaurants.data

    const shop = data[data.findIndex((r) => r._id.toString() === restaurantID)]

    const getBlob = async (fileUri) => {
        const resp = await fetch(fileUri);
        const imageBody = await resp.blob();
        return imageBody;
    };

    const uploadImage = async (uploadUrl, fields, data) => {
        const imageBody = await getBlob(data);

        return fetch(uploadUrl, {
            ...fields,
            method: "POST",
            body: imageBody,
        });
    };

    const newPictureFlow = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1
        });

        console.log(pickerResult)

        if (pickerResult.canceled === true) return

        const img = await manipulateAsync(
            pickerResult.assets[0].uri,
            [{ resize: { width: 500 } }],
            { format: SaveFormat.JPEG, compress: 1, base64: false }
        )

        console.log(img)


        const url = await postImageMutation.mutateAsync({ restaurantID })
        console.log({ url })

        const localUri = img.uri;
        const fileExtension = localUri.split('.').pop();
        const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;


        // Append the file to the FormData instance
        if (Platform.OS === 'android') {
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
            } else {
                const errorText = await uploadResponse.text();
                console.error('Error uploading image', errorText);
            }
        }
    };


    return <View padding-10>
        <Text>Restaurant Name: {getName(shop.names, 'en')}</Text>
        <Text>Address: {shop.address}</Text>

        <CardItem onPress={() => { navigation.navigate('UpdateMenu', { restaurantID }) }} label="Edit Menu"/>
        <CardItem onPress={newPictureFlow} label="Upload new picture"/>
    </View>
}