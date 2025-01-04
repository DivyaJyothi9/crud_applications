import * as types from "./actionTypes";

const initialState = {
  users: [],
  user: {},
  msg: "",
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_USERS:
      return {
        ...state,
        users: action.payload, // This correctly updates the users list
      };
    case types.ADD_USER:
    case types.DELETE_USER: // Corrected the syntax here
    case types.UPDATE_USER:
      return {
        ...state,
        msg: action.payload, // Keeps the message, can be useful for showing notifications
        // If needed, you can add or remove users here based on the action type.
        users: [...state.users, action.payload],
      };

      case types.GET_SINGLE_USER:
        return {
            ...state,
            user: action.payload,
        };
    default:
      return state;
  }
};

export default userReducer;