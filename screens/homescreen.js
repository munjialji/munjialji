import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

export default class HomeScreen extends Component {
    static navigationOptions = {
        title: 'Home',
        headerTitle: "헤더",
        headerLeft: (
            <Button
                onPress={() => alert("this is a button~")}
                title="info"
            />
        )
    }

    render() {
        return (
            <View>
                <Text>Home Screen</Text>
                <Button
                    title="Go to Details"
                    onPress={() => this.props.navigation.navigate('Details', {
                        itemId: 97,
                        otherParam: "이상화"
                    })}
                    />
            </View>
        )
    }
}