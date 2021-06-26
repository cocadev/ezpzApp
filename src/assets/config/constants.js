import { AsyncStorage } from 'react-native';
const emailValidation = (email) => {
    var re = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    return re.test(email);
};
const addOrReplace = (array, item) => {
    const i = array.findIndex(_item => _item.id === item.id);
    if (i > -1) {
        array[i] = item;
        if (item.qty === 0) {
            array.splice(i, 1);
        }
    } else {
        array.push(item);
    }
    return array;
};
const ASYNC_ITEMS = {
    items_Array: 'items_Array',
    my_cart: 'my_cart',
    cardDetails: 'card_details'
};
var ASYNC_STORE = {
    async store(item, data) {
        try {
            let response = await AsyncStorage.setItem(item, JSON.stringify(data));
            return await response;
        } catch (err) {
            return err;
        }
    },
    async retrieve(item) {
        try {
            const value = await AsyncStorage.getItem(item);
            if (value !== null) {
                return await JSON.parse(value);
            }
        } catch (err) {
            return err;
        }
    }
};
export {
    ASYNC_STORE,
    ASYNC_ITEMS,
    addOrReplace,
    emailValidation
}