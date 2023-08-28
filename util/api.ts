import {IGetUserRestaurantsObject} from "./types";

const baseURL = 'http://127.0.0.1:3000'


export const getRestaurants = async (token): Promise<Array<IGetUserRestaurantsObject>> => {
    const response = await fetch(`${baseURL}/user/restaurants`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    if (response.ok) {
        const data: Array<IGetUserRestaurantsObject> = await response.json()
        return data
    } else {
        console.error(response) // log this?
        throw (response)
    }
}