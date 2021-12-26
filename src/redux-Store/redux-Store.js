import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from './authReducer'
import { promiseReducer } from './promiseReducer'
import { cartReducer } from './cartReducer'
import { actionPromise } from './promiseReducer';

export const backURL = 'http://shop-roles.asmer.fs.a-level.com.ua'

export const actionCatById = (_id) =>
    actionPromise('catById', gql(`query catById($q: String){
            CategoryFindOne(query: $q){
                subCategories{name, _id}
                _id name goods {
                    _id name price images {
                        url
                    }
                }
            }
        }`, { q: JSON.stringify([{ _id }]) }))


export const actionGoodById = (_id) =>
    actionPromise('goodById', gql(`query goodByID($q: String) {
                                        GoodFindOne(query: $q){
                                            name _id  description price images{url}
                                        }
        }`, {
        q: JSON.stringify([{ _id }])
    }))


export const actionMyOrders = () =>
    actionPromise('myOrders', gql(`query Order{
                                            OrderGoodFind(query:"[{}]"){
                                            good{ name _id} _id total price count
                                        }
    }`, {}))

const getGQL = url =>
    async (query, variables = {}) => {
        let obj = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.authToken ? 'Bearer ' + localStorage.authToken : {},
            },
            body: JSON.stringify({ query, variables })
        })

        let a = await obj.json()
        if (!a.data && a.errors)
            throw new Error(JSON.stringify(a.errors))
        return a.data[Object.keys(a.data)[0]]
    }

export const gql = getGQL(backURL + '/graphql');

export const store = createStore(combineReducers({
    promise: promiseReducer,
    auth: authReducer,
    cart: cartReducer
}),
    applyMiddleware(thunk))