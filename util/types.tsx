export interface IGetUserRestaurantsObject {
    _id: string
    name: string
    address: string
}

export interface IFoodItem {
    _id: string
    name: string
    englishName: string | null
    description: string
    englishDescription: string | null,
    price: number
}

export interface IMenuCategory {
    _id: string
    name: string
    englishName?: string
    foodItems: IFoodItem[]
}