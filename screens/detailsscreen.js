import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

export default class DetailScreen extends Component {
    static navigationOptions = {
        title: "Details"
    }
    render() {

        const { navigation } = this.props;
        const itemId = navigation.getParam('itemId', 0);
        const otherParam = navigation.getParam('otherParam', "이름");

        return (
            <View>
                <Text>Details Screen</Text>
                <Text>{itemId} 년생 {otherParam} </Text>
                <Button
                    title="Go to Details...again"
                    onPress={() => this.props.navigation.push('Details', {
                        itemId: (Math.floor(Math.random() * 100))
                    })}
                />
                <Button
                    title="Go to Home"
                    onPress={() => this.props.navigation.navigate('Home')}
                />
                <Button
                    title="Go back"
                    onPress={() => this.props.navigation.goBack()}
                />
            </View>
        )
    }
}