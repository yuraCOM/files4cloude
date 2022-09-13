const SET_USER = "SET_USER"
const LOGOUT = "LOGOUT"



const defaultState = {
    currentUser: {},
    isAuth: false

}

export default function userRducer(state = defaultState, action) {
    switch (action.type) {

        case SET_USER:
            return {
                ...state,
                currentUser: action.payload,
                isAuth: true
            }
        case LOGOUT:
            localStorage.removeItem('token')
            return {
                ...state,
                currentUser: {},
                isAuth: false
            }
        default:
            return state

    }

}


// создаем action creater - это функц принимает на вход данны и возращает объект
// с типом экшена и данными
export const setUser = user => ({ type: SET_USER, payload: user })
export const logout = () => ({ type: LOGOUT })

