import {IFoodItem, IGetUserRestaurantsObject, IMenuCategory} from "./types";

const baseURL = 'http://127.0.0.1:3000'

// TODO: handle errors
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

export const getMenuCategories = async (token, restaurantID): Promise<Array<IMenuCategory>> => {
    const response = await fetch(`${baseURL}/restaurant/${restaurantID}/food/categories`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        console.error(response) // log this?
        throw (response)
    }
}

export const getRestaurantFoodItems = async (token, restaurantID): Promise<Array<IFoodItem>> => {
    const response = await fetch(`${baseURL}/restaurant/${restaurantID}/food/foodItems`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        console.error(response) // log this?
        throw (response)
    }
}

export const PatchMenuCategoryFoodItems = async (token, restaurantID, categoryID, foodItemIDs): Promise<void> => {
    const response = await fetch(`${baseURL}/restaurant/${restaurantID}/food/category/${categoryID}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "foodItems": foodItemIDs
        })
    })
    if (response.ok) {
        return // good
    } else {
        console.error(response) // log this?
        throw (response)
    }
}