
const standardColors = {
  appGreenColor: '#127a3c', // Green Color
  appGreen_light:'#e7f2ec',
  appDarkBrownColor: '#170a06', // Dark Brown
  applightBrown:'#897975',
  appOrangeColor: '#ff6000', // Thick Orange
  miniTextColor: '#504D4C',
  titleTextColor: '#000000',
  black: '#000000',
  white: '#FFFFFF',
  lightgrey: '#d3d3d3',
  danger: 'red'
}
const standardText = { // Sidemenu Modal and Tab texts
  tabMenu: 'MORE',
  tabFoodMenu: 'MENU',
  home: 'Home',
  favourites: 'Favourites',
  paymentInfo: 'Payment Info',
  ordersHistory: 'Orders History',
  myCart: 'My Cart',
  settings: 'Settings',
  logout: 'Logout',
  thankyouText: 'Thank You',
  editText: 'Edit Profile',
  reviewOrderText: 'Review Order',
  paymentDetailsText: 'Payment Details',
  paymentInfoText: 'Payment Information',
  favoriteText: 'Favorites',
  profiledetailsText: 'Profile Details',
  myOrderText: 'My Orders',
  successfullorderedText: 'Order placed successfully',
  orderhasreceivedText: 'Your order has been placed successfully. Please allow us 30-45 mins to prepare your meal.'
}
const localIcons = {
  foodInActiveIcon: require('../images/foodmenu-footer-icon.png'),
  rest: require('../images/download.jpeg'),
  cat: require('../images/cat.jpg'),
  foodActiveIcon: require('../images/foodmenu-rollover-footer-icon.png'),
  menuActiveIcon: require('../images/more-rollover-footer-icon.png'),
  menuInActiveIcon: require('../images/more-footer-icon.png'),
  userAccountbgImg: require('../images/wooden-bg.jpg'),
  entireBackgorundImg: require('../images/wooden-bg.jpg'),
  settingsTopBackground: require('../images/setting-top-img.jpg'),
  settingsProfileImg: require('../images/profile1.jpeg'),
  applogo: require('../images/EZPZ_Logo.png'),
  mycartIcon: require('../images/my-cart-icon.png'),
  addcartIcon: require('../images/add-cart-icon.png'),
  favIconSelected: require('../images/favicon-selected.png'),
  favIconUnSelected: require('../images/un-fav-icon.png'),
  addIcon: require('../images/add.png'),
  editIcon: require('../images/edit.png'),
  substractIcon: require('../images/substract.png'),
  successfulmarkLogo: require('../images/scucessfully-order-checkmark.png'),
  backIcon: require('../images/back-icon.png'),
  checkMarkIcon: require('../images/checkmark-icon.jpg'),
}
const menulist_Array = [
  { id: 0, icon_name: 'home', icon_title: standardText.home, key: 'home' },
  { id: 1, icon_name: 'phone', icon_title: 'Call EzPzOrder', key: 'CallKitchen' },
  { id: 3, icon_name: 'credit-card', icon_title: standardText.paymentInfo, key: 'CardDetails' },
  { id: 4, icon_name: 'first-order', icon_title: standardText.ordersHistory, key: 'MyOrders' },
  { id: 5, icon_name: 'shopping-cart', icon_title: standardText.myCart, key: 'ReviewOrder' },
  { id: 6, icon_name: 'sign-out', icon_title: standardText.logout, key: 'logout' }
]
const menulist_Array_nologin = [
  { id: 0, icon_name: 'home', icon_title: standardText.home, key: 'home' },
  { id: 1, icon_name: 'phone', icon_title: 'Call EzPzOrder', key: 'CallKitchen' },
  { id: 6, icon_name: 'sign-out', icon_title: 'Login', key: 'Login_form' }
]

export {
  localIcons,
  standardText,
  standardColors,
  menulist_Array,
  menulist_Array_nologin
}