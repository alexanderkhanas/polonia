export default function MainReducer(state, action) {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload,
      };
    case 'SET_ID':
      return {
        ...state,
        appId: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'USER_DATA':
      return {
        ...state,
        user: { ...action.payload },
      };
    case 'HISTORY':
      return {
        ...state,
        history: action.payload,
      };
    case 'SET_STACK':
      return {
        ...state,
        stack: action.payload,
      };
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    case 'LINK':
      return {
        ...state,
        referralLink: action.payload,
      };
    default:
      return { ...state };
  }
}
