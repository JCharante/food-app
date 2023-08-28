import React from 'react'

export interface IRestaurantInContext {
    _id: string,
    name: string,
    address: string
}


export interface IRestaurantContext {
    restaurant: IRestaurantInContext | null,
    setRestaurant(restaurant: object): void
}

export const RestaurantContext = React.createContext<IRestaurantContext>({
    restaurant: null,
    setRestaurant: (restaurant: object) => {}
})