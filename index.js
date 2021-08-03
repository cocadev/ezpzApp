import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import config from "./config";
import Amplify from 'aws-amplify';
import Analytics from '@aws-amplify/analytics';
import PushNotification from '@aws-amplify/pushnotification';
import aws_exports from './aws-exports';

// PushNotification need to work with Analytics
PushNotification.configure(aws_exports);
// const analyticsConfig = { 
//   AWSPinpoint: {
//         // Amazon Pinpoint App Client ID
//         appId: 'effb5f996d8b420997d48f30bcf2351c',
//         // Amazon service region
//         region: 'us-east-1',
//         mandatorySignIn: false,
//   }
// }

//Analytics.configure(aws_exports)

Amplify.configure({
    Auth: {
      mandatorySignIn: false,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    Storage: {
      region: config.s3.REGION,
      bucket: config.s3.BUCKET,
      level:"public",
      identityPoolId: config.cognito.IDENTITY_POOL_ID
    },
    // Analytics: {   
    //   disabled: false,
    //   autoSessionRecord: false,     
    // },
    API: {
      endpoints: [
        {
          name: "get",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
        {
          name: "list",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
        {
          name: "post",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
        {
          name: "put",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
        {
          name: "delete",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
      ]
    }
  });
  

AppRegistry.registerComponent(appName, () => App);
