import React, { Component } from 'react';
import { View,
   Text,
    StyleSheet,
     Picker,
     Switch,
     PushNotificationIOS,
      AppState,
       Platform } from 'react-native';
import PushController from './PushController';
import PushNotification from 'react-native-push-notification';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    backgroundColor: '#FFFFFF',
  },
  welcome: {
    
    fontSize: 22,
    margin: 12,
  },
  welcome2: {
    margin : 5,
    fontSize: 18,
  
  },
  picker: {
    width: 265,
  },
  box: {
    
    flexDirection: 'row', // 혹은 'column'
  },
  item1: {
    flex : 1,
    fontSize: 20,
    margin: 10,
  },
  item2: {
    flex : 3,
    
  },

});

export default class Screen2 extends Component {
  constructor(props) {
    super(props);

    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.state = {
      switchValue: true,
      seconds: 5,
      PM10 : 90,
      PM2 : 40,
    };
  }

  toggleSwitch = (value) => {
    //onValueChange of the switch this function will be called
    this.setState({switchValue: value}) 
    //state changes according to switch
    //which will result in re-render the text
 }

    componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(appState) {
    if (appState === 'background') {
      let date = new Date(Date.now() + (this.state.seconds * 1000));

      if (Platform.OS === 'android') {
        date = date.toISOString();
      }

      PushNotification.localNotificationSchedule({
        message: "My Notification Message",
        date,
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box}>
        <Text style={styles.welcome}>
          Push Alarm (OFF/ON)
        </Text>
        <Switch style = {styles.item1}
          onValueChange = {this.toggleSwitch}
          value = {this.state.switchValue}/>
        </View>
        <View style = {styles.box}>
          <View style ={styles.item1}>
            <Text style={styles.welcome2}>
              PM 2.5 : 
            </Text>
          </View>
          <View style = {styles.item2}>
        <Picker
          style={styles.picker}
          selectedValue={this.state.PM2}
          onValueChange={(PM2) => this.setState({ PM2 })}
        >
          <Picker.Item label="25 (보통)" value={25} />
          <Picker.Item label="30 (보통)" value={30} />
          <Picker.Item label="35 (보통)" value={35} />
          <Picker.Item label="40 (나쁨) : 권고" value={40} />
          <Picker.Item label="45 (나쁨)" value={45} />
          <Picker.Item label="50 (나쁨)" value={50} />
          <Picker.Item label="55 (나쁨)" value={55} />
          <Picker.Item label="60 (나쁨)" value={60} />
          <Picker.Item label="65 (나쁨)" value={65} />
          <Picker.Item label="70 (나쁨)" value={70} />
          <Picker.Item label="75 (나쁨)" value={75} />
          <Picker.Item label="80 이상 (매우나쁨)" value={80} />

        </Picker>
        
        <PushController />
        </View>
        </View>
        <View style = {styles.box}>
          <View style ={styles.item1}>
            <Text style={styles.welcome2}>
              PM 10  : 
            </Text>
          </View>
          <View style = {styles.item2}>
        <Picker
          style={styles.picker}
          selectedValue={this.state.PM10}
          onValueChange={(PM10) => this.setState({ PM10 })}
        >
          
          <Picker.Item label="50 (보통)" value={50} />
          <Picker.Item label="60 (보통)" value={60} />
          <Picker.Item label="70 (보통)" value={70} />
          <Picker.Item label="80 (보통)" value={80} />
          <Picker.Item label="90 (나쁨) : 권고" value={90} />
          <Picker.Item label="100 (나쁨)" value={100} />
          <Picker.Item label="110 (나쁨)" value={110} />
          <Picker.Item label="120 (나쁨)" value={120} />
          <Picker.Item label="130 (나쁨)" value={130} />
          <Picker.Item label="140 (나쁨)" value={140} />
          <Picker.Item label="150 이상 (매우나쁨)" value={150} />

        </Picker>
        
        <PushController />
        </View>
        </View>
      </View>
    );
  }
}

