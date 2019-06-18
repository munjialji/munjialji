import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

export default class FirstScreen extends Component {
    render() {
        return (
            <View>
                <Text>Home Screen</Text>
                <Image
                    source={require('../assets/images/logo.png')}
                />
                <Button
                    title="Go to Details"
                    onPress={() => this.props.navigation.navigate('Details')}
                    />
            </View>
        )
    }
}