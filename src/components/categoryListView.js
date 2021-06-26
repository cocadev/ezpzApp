/**
 * Created by mac on 27/02/19.
 */
import React, {Component} from 'react';
import Proptypes from 'prop-types';
import {
    View,
    AsyncStorage,
    ScrollView
} from 'react-native';

import {items_Array} from '../assets/config/localdata';
import CategoryItems from "./categoryItems";

export default class CategoryListView extends Component {

    constructor(props){
        super(props);
        this.state = {

        }
    }




    render() {
        return (
            <View style={{ flex: 1 }}>
                {
                    items_Array.length !== 0 &&
                    <ScrollView>
                        {(items_Array.map((item, index) => {
                                return (
                                    <CategoryItems key={index} item={item}/>
                                )
                            })
                        )}
                    </ScrollView>
                }
            </View>
        );
    }
}

CategoryListView.propTypes = {};

