import{
    LOGIN_USER,
    REGITSER_USER
}from '../_actions/types';

export default function(state={}, action){
    switch(action.type){
        case LOGIN_USER:
            return {...state, loginSuccess: action.payload}
        break;

        case REGITSER_USER:
            return {...state, register: action.payload}
        break;

        default:
            return state;
    }
}