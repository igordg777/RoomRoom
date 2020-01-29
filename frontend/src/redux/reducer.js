import {
  ADD_PHOTO,
  ADD_ISLOGIN,
  ADD_LIKED_BY_USERS,
  ADD_MUTUAL_USERS,
  REMOVE_LIKED_BY_USERS,
  ADD_USERS_DASHBOARD
} from "./actions";

const initialState = {
  photos: [],
  isLogin: false,
  likedByUsers: [],
  mutualUsers: [],
  usersDashBoard:[]
};

export default function(oldState = initialState, action) {
  switch (action.type) {
    case ADD_PHOTO:
      return {
        photos: action.photo,
        isLogin: oldState.isLogin,
        likedByUsers: [...oldState.likedByUsers],
        mutualUsers: [...oldState.mutualUsers],
        usersDashBoard: [...oldState.usersDashBoard]
      };
    case ADD_ISLOGIN:
      return {
        photos: oldState.photos,
        isLogin: action.isLogin,
        likedByUsers: [...oldState.likedByUsers],
        mutualUsers: [...oldState.mutualUsers],
        usersDashBoard: [...oldState.usersDashBoard]
      };
    case ADD_LIKED_BY_USERS:
      return {
        photos: oldState.photos,
        isLogin: oldState.isLogin,
        likedByUsers: action.likedByUsers,
        mutualUsers: [...oldState.mutualUsers],
        usersDashBoard: [...oldState.usersDashBoard]
      };
    case ADD_MUTUAL_USERS:
      return {
        photos: oldState.photo,
        isLogin: oldState.isLogin,
        likedByUsers: [...oldState.likedByUsers],
        mutualUsers: action.mutualUsers,
        usersDashBoard: [...oldState.usersDashBoard]
      };
    case REMOVE_LIKED_BY_USERS:
      const newlikedByUsers = oldState.likedByUsers.filter(
        user => user.id !== action.user.id
      );
      return {
        photos: action.photo,
        isLogin: oldState.isLogin,
        likedByUsers: newlikedByUsers,
        mutualUsers: [...oldState.mutualUsers],
        usersDashBoard: [...oldState.usersDashBoard]
      };
    case ADD_USERS_DASHBOARD:
      return {
        photos: oldState.photos,
        isLogin: oldState.isLogin,
        likedByUsers: [...oldState.likedByUsers],
        mutualUsers: [...oldState.mutualUsers],
        usersDashBoard:action.users
      }

    default:
      return oldState;
  }
}
