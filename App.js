/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet, PermissionsAndroid } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { CircularProgress } from 'react-native-svg-circular-progress';
import { LineChart, Grid } from 'react-native-svg-charts'
import { createDrawerNavigator, createStackNavigator, createAppContainer, DrawerNavigator } from 'react-navigation'

import Screen1 from './pages/Screen1';
import Screen2 from './pages/Screen2';
import Screen3 from './pages/Screen3';
import Bluetooth from './screens/bluetooth';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      situation: 1,
      arduino_dust_type: 1,
      airkorea_dust_type: 1,
      isLoading: true,
      hasLocationPermissions: false,
      locationResult: null,
      stationDataSource: {},
      dataSource: {},
      arduinoData_1: [10,48,52,22,8,3,18],
      arduinoData_2: [52,10,22,48,18,3,8],
      arduinoData_3: [45,18,3,106,48,3,41]
    };
  }
  static navigationOptions = {
    drawerLabel: 'Home'
  }

  async componentWillMount() {
    await this._getLocationAsync();

  }

  _getLocationAsync = async () => {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    await this.setState({
      hasLocationPermissions: true
    })
    await navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          locationResult: position
        }, () => this._connect_server()
          .then((response) => response.json())
          .then((responseJson) => {
            if (!responseJson.hasOwnProperty('distance')) {
              responseJson.distance = null
            }
            this.setState({
              stationDataSource: responseJson
            })
          })
          .then(() => {
            fetch(`http://133.186.208.249/api/concentrations?station=${this.state.stationDataSource.id}`)
              .then((response) => response.json())
              .then((responseJson) => {
                this.setState({
                  isLoading: false,
                  dataSource: responseJson,
                })
              })
          })
        )
      },
      (error) => alert(error.message),
      { timeout: 5000 },
    )
  }

  _connect_server = () => {
    if (this.state.locationResult === null) {
      return fetch('http://133.186.208.249/api/stations/140')
    }
    else {
      return fetch(`http://133.186.208.249/api/stations?lon=${this.state.locationResult.coords.longitude}&lat=${this.state.locationResult.coords.latitude}`)
    }
  }

  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer();
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 100 }}>
          <ActivityIndicator />
        </View>
      )
    }

    else if (!this.state.hasLocationPermissions) {
      return (
        <View style={{ flex: 1, paddingTop: 40 }}>
          <Text>Location permissions are not granted.</Text>
        </View>
      )
    }

    else if (this.state.stationDataSource === {}) {
      return (
        <View style={{ flex: 1, paddingTop: 40 }}>
          <Text>Finding your current location...</Text>
        </View>
      )
    }

    else {
      return (
        <View>
          {/* 상단 부분 */}
          <View style={{ height: 60, flexDirection: 'row', backgroundColor: 'rgb(41, 128, 185)' }}>
            <TouchableOpacity>
              <EntypoIcon
                name="menu"
                color="white"
                size={30}
                onPress={() => this.props.navigation.toggleDrawer()}
                style={{ margin: 10 }}>
              </EntypoIcon>
            </TouchableOpacity>
            <View style={{ flexDirection: 'column', width: 350 }}>
              <View>
                <Text style={{ fontSize: 17, marginTop: 10, color: 'white', fontWeight: 'bold' }}>상황에 맞게 하단의 버튼을 눌러주세요.</Text>
              </View>
              <View>
                <Text style={{ color: 'white', textAlign: 'right', fontWeight: 'bold' }}>5분동안 적용됩니다. 기본값은 '걷기'입니다.</Text>
              </View>
            </View>
          </View>

          {/* 아두이노 */}
          <View style={{ borderBottomWidth: 1, paddingBottom: 50 }}>
            <View style={{ margin: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>아두이노</Text>
            </View>

            <View>
              <View style={{ marginLeft: 100, flexDirection: 'row' }}>
                <TouchableOpacity
                  style={this.state.situation == 1 ? styles.onclick_situation : styles.unclick_situation}
                  onPress={() => this.setState({ situation: 1 })}>
                  <Text style={this.state.situation == 1 ? styles.onclick_text : styles.unclick_text}>걷기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={this.state.situation == 2 ? styles.onclick_situation : styles.unclick_situation}
                  onPress={() => this.setState({ situation: 2 })}>
                  <Text style={this.state.situation == 2 ? styles.onclick_text : styles.unclick_text}>버스</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={this.state.situation == 3 ? styles.onclick_situation : styles.unclick_situation}
                  onPress={() => this.setState({ situation: 3 })}>
                  <Text style={this.state.situation == 3 ? styles.onclick_text : styles.unclick_text}>지하철</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={this.state.situation == 4 ? styles.onclick_situation : styles.unclick_situation}
                  onPress={() => this.setState({ situation: 4 })}>
                  <Text style={this.state.situation == 4 ? styles.onclick_text : styles.unclick_text}>실내</Text>
                </TouchableOpacity>

              </View>
              <View style={{ flexDirection: 'row' }}>
                <View>
                  <TouchableOpacity
                    style={this.state.arduino_dust_type == 1 ? styles.onclick_dust_type : styles.unclick_dust_type}
                    onPress={() => this.setState({ arduino_dust_type: 1 })}>
                    <Text style={this.state.arduino_dust_type == 1 ? styles.onclick_text : styles.unclick_text}>미세먼지</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={this.state.arduino_dust_type == 2 ? styles.onclick_dust_type : styles.unclick_dust_type}
                    onPress={() => this.setState({ arduino_dust_type: 2 })}>
                    <Text style={this.state.arduino_dust_type == 2 ? styles.onclick_text : styles.unclick_text}>초미세먼지</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={this.state.arduino_dust_type == 3 ? styles.onclick_dust_type : styles.unclick_dust_type}
                    onPress={() => this.setState({ arduino_dust_type: 3 })}>
                    <Text style={this.state.arduino_dust_type == 3 ? styles.onclick_text : styles.unclick_text}>극초미세먼지</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ borderWidth: 1, marginTop: 30, marginLeft: 30, width: 200 }}>
                  <LineChart style={{ height: 150 }}
                    data={this.state.arduino_dust_type == 1 ? this.state.arduinoData_1 : this.state.arduino_dust_type == 2 ? this.state.arduinoData_2 : this.state.arduinoData_3}
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                    contentInset={{ top: 20, bottom: 20 }}>

                    <Grid />
                  </LineChart>
                </View>
              </View>
            </View>
          </View>

          {/* 에어코리아 */}
          <View>
            <View style={{ margin: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>에어코리아</Text>
            </View>
            <View>
              <View>
                <Text style={{ textAlign: 'center', fontSize: 18, color: 'black' }}>
                  {this.state.dataSource.data_time}
                </Text>
              </View>
              <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                <View>
                  <MaterialIcon
                    name="gps-fixed"
                    color='black'
                    backgroundColor='transparent'
                    size={20}>
                  </MaterialIcon>
                </View>
                <View>
                  <Text style={{ textAlign: 'center', fontSize: 15, color: 'black' }}>
                    {this.state.stationDataSource.distance === null ? this.state.stationDataSource.name : this.state.stationDataSource.name + '(' + this.state.stationDataSource.distance + 'km)'}
                  </Text>
                </View>
              </View>

            </View>
          </View>

          {/* 중간 부분의 미세먼지*/}
          <View style={{ alignItems: 'center' }}>
            <View style={{ marginTop: 10, width: 200, borderRadius: 50, backgroundColor: 'rgb(41, 128, 185)' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white', textAlign: 'center' }}>
                {this.state.airkorea_dust_type == 1 ? '미세먼지(PM10)' : '초미세먼지(PM2.5)'}
              </Text>
            </View>
            <View style={{ marginTop: 20, alignItems: 'center', flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => this.setState({
                  airkorea_dust_type: 1
                })}>
                <AntDesignIcon
                  name="left"
                  color="black"
                  backgroundColor="transparent"
                  size={40}
                  style={{ marginRight: 30 }}>
                </AntDesignIcon>
              </TouchableOpacity>
              <CircularProgress
                size={100}
                progressWidth={30}
                percentage={this.state.airkorea_dust_type == 1 ? this.state.dataSource.fine_dust / 2 : this.state.dataSource.ultra_fine_dust}
                donutColor={this.state.airkorea_dust_type == 1 ?
                  this.state.dataSource.fine_dust_grade == 1 ? 'skyblue' :
                    this.state.dataSource.fine_dust_grade == 2 ? 'green' :
                      this.state.dataSource.fine_dust_grade == 3 ? 'orange' : 'red' :
                  this.state.dataSource.ultra_fine_dust_grade == 1 ? 'skyblue' :
                    this.state.dataSource.ultra_fine_dust_grade == 2 ? 'green' :
                      this.state.dataSource.ultra_fine_dust_grade == 3 ? 'orange' : 'red'}
              >
                <Text style={{ fontSize: 18, color: 'black' }}>
                  {this.state.airkorea_dust_type == 1 ? this.state.dataSource.fine_dust : this.state.dataSource.ultra_fine_dust}
                </Text>
                <Text style={{ fontSize: 18, color: 'black' }}>
                  {this.state.airkorea_dust_type == 1 ?
                    this.state.dataSource.fine_dust_grade == 1 ? '좋음' :
                      this.state.dataSource.fine_dust_grade == 2 ? '보통' :
                        this.state.dataSource.fine_dust_grade == 3 ? '나쁨' : '매우 나쁨' :
                    this.state.dataSource.ultra_fine_dust_grade == 1 ? '좋음' :
                      this.state.dataSource.ultra_fine_dust_grade == 2 ? '보통' :
                        this.state.dataSource.ultra_fine_dust_grade == 3 ? '나쁨' : '매우 나쁨'}
                </Text>
              </CircularProgress>
              <TouchableOpacity
                onPress={() => this.setState({
                  airkorea_dust_type: 2
                })}>
                <AntDesignIcon
                  name="right"
                  color="black"
                  backgroundColor="transparent"
                  size={40}
                  style={{ marginLeft: 30 }}>
                </AntDesignIcon>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }
  }
}
class NavigationDrawerStructure extends Component {
  //Structure for the navigatin Drawer
  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity>
          <EntypoIcon
                name="menu"
                color="white"
                size={30}
                onPress={this.toggleDrawer.bind(this)}
                style={{ margin: 10 }}>
              </EntypoIcon>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  onclick_situation: {
    backgroundColor: 'rgb(41, 128, 185)',
    marginLeft: 20,
    borderRadius: 10,
    width: 55
  },
  onclick_dust_type: {
    backgroundColor: 'rgb(41, 128, 185)',
    marginLeft: 30,
    marginTop: 30,
    width: 110,
    borderRadius: 10
  },
  onclick_text: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center'
  },
  unclick_situation: {
    backgroundColor: 'rgb(224, 224, 224)',
    marginLeft: 20,
    borderRadius: 10,
    width: 55
  },
  unclick_dust_type: {
    backgroundColor: 'rgb(224, 224, 224)',
    marginLeft: 30,
    marginTop: 30,
    width: 110,
    borderRadius: 10
  },
  unclick_text: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center'
  }
})

const FirstActivity_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  First: {
    screen: Screen1,
    navigationOptions: ({ navigation }) => ({
      title: 'Demo Screen 1',
      headerLeft: <App navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

const Screen2_StackNavigator = createStackNavigator({
  //All the screen from the Screen2 will be indexed here
  Second: {
    screen: Screen2,
    navigationOptions: ({ navigation }) => ({
      title: 'Alarm setting',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#0080FF',
      },
      headerTintColor: '#fff',
    }),
  },
});

const Screen3_StackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Third: {
    screen: Screen3,
    navigationOptions: ({ navigation }) => ({
      title: 'Demo Screen 3',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

const Screen4_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  First: {
    screen: Bluetooth,
    navigationOptions: ({ navigation }) => ({
      title: '블루투스 설정',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#0080FF',
      },
      headerTintColor: '#fff',
    }),
  },
});

const DrawerNavigatorExample = createDrawerNavigator({
  //Drawer Optons and indexing
  Screen1: {
    //Title
    screen: App,
    navigationOptions: {
      drawerLabel: '홈으로',
    },
  },
  Screen2: {
    screen: Screen4_StackNavigator,
    navigationOptions:{
      drawerLabel: '아두이노 설정'
    }
  },
  Screen3: {
    //Title
    screen: Screen2_StackNavigator,
    navigationOptions: {
      drawerLabel: '알림 설정',
    },
  },
  Screen4: {
    screen: Screen2_StackNavigator,
    navigationOptions:{
      drawerLabel: '공유'
    }
  },
},
{
  drawerPosition: 'left',
  initialRouterName: 'Home',
  drawerWidth: 300
});

export default createAppContainer(DrawerNavigatorExample)