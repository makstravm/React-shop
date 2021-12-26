import { gql } from "./redux-Store";
import { actionPromise } from './promiseReducer';

export function cartReducer(state = {}, { type, good = {}, count = 1 }) {
    const { _id } = good
    const types = {
        CART_ADD() {
            count = +count
            if (!count) return state
            return {
                ...state,
                [_id]: {
                    good,
                    count: count + (state[_id]?.count || 0)
                }
            }
        },
        CART_CHANGE() {
            count = +count
            if (!count) return state
            return {
                ...state,
                [_id]: {
                    good,
                    count: count
                }
            }
        },
        CART_REMOVE() {
            let { [_id]: remove, ...newState } = state
            return {
                ...newState
            }
        },
        CART_CLEAR() {
            return {}
        },
    }
    if (type in types) {
        return types[type]()
    }
    return state
}

export const actionAddCart = (good, count) => ({ type: 'CART_ADD', good, count })
export const actionCleanCart = () => ({ type: 'CART_CLEAR' })
export const actionRemoveCart = good => ({ type: 'CART_REMOVE', good })
export const actionChangeCart = (good, count) => ({ type: 'CART_CHANGE', good, count })

export const actionOrder = () =>
    async (dispatch, getState) => {
        let { cart } = getState()
        const orderGoods = Object.entries(cart).map(([_id, { count }]) => ({ good: { _id }, count }))
        let result = await dispatch(actionPromise('order', gql(`
                    mutation newOrder($order:OrderInput){
                      OrderUpsert(order:$order)
                        { _id total }
                    }
            `, { order: { orderGoods } })))

        if (result?._id) {
            dispatch(actionCleanCart())
        }
    }