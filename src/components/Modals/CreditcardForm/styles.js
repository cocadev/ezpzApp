import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { standardColors } from '@assets/config/localdata';
import { Metrics } from '@assets/config';
const { paddings, margins } = Metrics
export default {
  modalContainer: {
    backgroundColor: standardColors.white,
    height: verticalScale(400),
    width: scale(300),
    borderRadius: 10,
    alignSelf: 'center'
  },
  closeWrapper: {
    flexDirection: 'row-reverse',
  },
  contentContainer: {    
    flex:1,
    flexDirection: 'column',    
    ...{ ...paddings.pH20 },   
  },
  inputLabel: { fontSize: moderateScale(12), color: standardColors.black, ...{ ...margins.mB5 } },
  input: {
    height: 35, width: '100%', borderWidth: 0.5, borderColor: standardColors.lightgrey,
    fontSize: moderateScale(12), backgroundColor: '#f2f2f2', ...{ ...paddings.pH10 }, 
  },
  submitButton: {
    backgroundColor: standardColors.appGreenColor, paddingVertical: 10, paddingHorizontal: 40
  },
  submitButtonText: { color: 'white', textAlign: 'center' }
}