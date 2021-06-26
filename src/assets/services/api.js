import {stage} from '../../components/SelectState.js';
import React, { Component } from 'react'; 
export var url={
    baseURL:'http://admin.hawkslandingcc.com',
    stripeKey:'pk_live_qlk4dmAt2gRv9mTaoiq7PVtB'
};
export default class Api extends Component {
    constructor(props) {
        super(props);
        if(stage==='dev'){
            url={
                baseURL : "https://adminstage.hawkslandingcc.com",
                stripeKey : 'sk_test_pTlP8v9XNBz06H10bPOuOtSK'
            }
        }
        else{
            url={
              baseURL:'http://admin.hawkslandingcc.com',
              stripeKey:'pk_live_qlk4dmAt2gRv9mTaoiq7PVtB'
           }
        }
	}
    componentWillMount(){
        console.log(url)
        if(stage==='dev'){
            url={
                baseURL : "https://adminstage.hawkslandingcc.com",
                stripeKey : 'sk_test_pTlP8v9XNBz06H10bPOuOtSK'
            }
        }
        else{
            url={
              baseURL:'http://admin.hawkslandingcc.com',
              stripeKey:'pk_live_qlk4dmAt2gRv9mTaoiq7PVtB'
           }
        }
        console.log(url);
    }
};