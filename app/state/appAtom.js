import Cookies from "js-cookie";
import { atom, selector } from "recoil";

export const counterState = atom({
  key: "counterState",
  default: 0,
});

export const doubleCounterState = selector({
  key: "doubleCounterState", // Unique ID
  get: ({ get }) => {
    const count = get(counterState);
    return count * 2;
  },
});

export const navigateState = atom({
  key: "navigateState",
  default: "",
});

const loadUserDataFromCookies = () => {
  console.log("cookies:- ",Cookies.get('email'))
  if(!!Cookies.get('email')){
    let obj = {
      username: Cookies.get("username"),
      email: Cookies.get("email"),
      id: Cookies.get("userId"),
    };
    return obj
  } else {
    let obj2 = {}
    return obj2
  }
}

export const cookiesState = atom({
  key: "cookiesState",
  default: loadUserDataFromCookies(),
});

export const cart = atom({
  key: "cart",
  default: [],
});

export const cartLoading = atom({
  key: "cartLoading",
  default: false,
});

export const wishlistArray = atom({
  key: "wishlistArray",
  default: [],
});

export const prevOrderArray = atom({
  key: "prevOrderArray",
  default: undefined,
});

export const placedOrders = atom({
  key: "placedOrders",
  default: [],
});

export const shopCartLoader = atom({
  key: "shopCartLoader",
  default: null,
});

export const orderDiscount = atom({
  key: "orderDiscount",
  default: null,
});

export const couponObject = atom({
  key: "couponObject",
  default: {},
});
