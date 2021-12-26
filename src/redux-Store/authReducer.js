import { gql } from "./redux-Store";
import { actionPromise } from './promiseReducer';

function jwtDecode  (token)  {
    try {
        let arrToken = token.split('.')
        let base64Token = atob(arrToken[1])
        return JSON.parse(base64Token)
    }
    catch (e) {
        console.log('Лажа, Бро ' + e);
    }
}

export function authReducer(state, { type, token }) {
    if (!state) {
        if (localStorage.authToken) {
            type = 'AUTH_LOGIN'
            token = localStorage.authToken
        } else state = {}
    }

    if (type === 'AUTH_LOGIN') {
        localStorage.setItem('authToken', token)

        let payload = jwtDecode(token)
        if (typeof payload === 'object') {
            return {
                ...state,
                token,
                payload
            }
        } else return state
    }
    if (type === 'AUTH_LOGOUT') {
        localStorage.removeItem('authToken')
        return {}
    }
    return state
}

const actionAuthLogin = token => ({ type: 'AUTH_LOGIN', token })

export const actionAuthLogout = () => ({ type: 'AUTH_LOGOUT' })

export const actionFullLogin = (login, password) =>
    async dispatch => {
        let token = await dispatch(actionLogin(login, password))
        if (token) {
            dispatch(actionAuthLogin(token))
        }
    }

const actionLogin = (login, password) =>
    actionPromise('login', gql(`query NameForMe1($login:String, $password:String){
            login(login:$login, password:$password)
        }`, { login, password }))

const actionRegister = (login, password) =>
    actionPromise('register', gql(`
                mutation reg($login:String, $password:String){
                UserUpsert(user:{
                    login:$login,
                        password:$password,
                        nick:$login}){
                _id login
                }
            }
            `, { login, password }))

export const actionFullRegister = (login, password) =>
    async dispatch => {
        await actionRegister(login, password)
        let token = await dispatch(actionLogin(login, password))
        if (token) {
            dispatch(actionAuthLogin(token))
        }
    }