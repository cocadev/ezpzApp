import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { standardColors } from '@assets/config/localdata';
import { Metrics } from '@assets/config';
import { Dimensions } from 'react-native';
const { paddings, margins } = Metrics;
const { width, height } = Dimensions.get('window');
export default {
  incdecWrapper: {  flexDirection: 'row', justifyContent: 'space-evenly', 
  paddingHorizontal: 5,flex:0.5,height:30,alignItems:'center',marginTop:-6,
  borderRadius: 2,borderColor:standardColors.appGreenColor,borderWidth:1 },
  quantityLabel: { fontSize: 14, fontWeight: '900', color: 'grey', textAlign: 'left' },
  incDecIcon: { borderRadius: 2,fontWeight:'100'},
    modalContainer: {
        backgroundColor: standardColors.white,
        height: height,
        width: width,
        alignSelf: 'center',
      },
      closeWrapper: {
        flexDirection: 'row-reverse',
        marginTop:scale(20),
        padding:10,
        paddingLeft:scale(15)
      },
      contentContainer: {
        flexDirection: 'column',
        ...{ ...paddings.pB10 },
        ...{ ...paddings.pH20 },
      },
      headerSectionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      leftSection: {
        flex: 0.5
      },
      chooseTextLable: {
        fontSize: moderateScale(16), fontWeight: 'bold'
      },
      sizeButtonContainer: {
        flex: 0.5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
      },
      sizeButton: {
        height: verticalScale(20),
        width: scale(20),
        borderWidth: 1,
        borderColor: standardColors.appDarkBrownColor,
        justifyContent: 'center', alignItems: 'center',
        ...{ ...margins.mL10 }
      },
      sizeButtonText: {
        fontSize: moderateScale(12)
      },
      horizontalBar: {
        marginTop:scale(15),
        borderTopWidth: 0.5,
        borderColor: standardColors.lightGrey,
      },
      bodySectionContainer: {
        ...{ ...paddings.pT10 },
      },
      addCartButton: {
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: standardColors.appGreenColor,
        ...{ ...paddings.pV10 },
        ...{ ...paddings.pH20 },
      },
      addCartButtonText: {
        color: standardColors.white, fontWeight: 'bold'
      }
}
