import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button, Modal, Alert } from 'react-native';

import MapView, { Marker } from 'react-native-maps'
import axios from 'axios'

const screen = Dimensions.get("window")
const ASPECT_RATIO = screen.width / screen.height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

class Card extends Component {
  constructor () {
    super()
  }
  render () {
    return (
      <View style={styles.card}>
        <Text>{this.props.title}</Text>
        <Text>Red: {this.props.red}</Text>
        <Text>Yellow: {this.props.yellow}</Text>
        <Text>Green: {this.props.yellow}</Text>
        <Text>White: {this.props.white}</Text>
      </View>
    )
  }
}

class Login extends Component {
  constructor () {
    super()
    this.state = {
      username: "",
      password: ""
    }
  }
  checkLogin = (e) => {
    e.preventDefault()
    this.props.checkLogin(this.state)
  }
  render () {
    return (
      <Fragment>
        <View style={styles.card}>
          <Text>LoginScreen: </Text>
        </View>
        <View style={styles.card}>
          <Text>Username</Text>
          <TextInput
            placeholder="Username"
            onChangeText={text => this.setState({username: text})}
          />
        </View>
        <View style={styles.card}>
          <Text>Password</Text>
          <TextInput
            placeholder="Password"
            onChangeText={text => this.setState({password: text})}
          />
        </View>
        <View style={styles.card}>
          <Button
            title="Login"
            onPress={(e) => this.checkLogin(e)}
          />
        </View>
      </Fragment>
    )
  }
}

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      ready: false,
      where: {lat: null, long: null},
      err: null,
      detailView: false,
      selectedPinDetails: {
        title: "",
        red: 0,
        white: 0,
        yellow: 0,
        green: 0
      },
      users: [
        {
          username: "user1",
          password: "password1"
        },
        {
          username: "user2",
          password: "password2"
        },
        {username: "U"}
      ],
      locations: [
        {
          id: 1,
          name: "Seventh Day Adventist Hospital",
          lat: 23.401261,
          long: 85.369805,
          type: "hospital",
          time_ranges: [
            {
              time: "05:47PM",
              red: 6,
              green: 2,
              yellow: 3
            },
            {
              time: "06:30PM",
              red: 4,
              green: 3,
              yellow: 5
            },
            {
              time: "07:25PM",
              red: 0,
              green: 5,
              yellow: 1
            }
          ]
        },
        {
          id: 2,
          name: "Food Plaza",
          lat: 23.400897,
          long: 85.370577,
          type: "NR",
          time_ranges: [
            {
              time: "05:47PM",
              red: 1,
              green: 5,
              yellow: 1
            },
            {
              time: "06:30PM",
              red: 0,
              green: 9,
              yellow: 2
            },
            {
              time: "07:25PM",
              red: 0,
              green: 5,
              yellow: 1
            }
          ]
        },
        {
          id: 3,
          name: "Shree Shurbhi Bhandar",
          lat: 23.403122,
          long: 85.367745,
          type: "GeneralStore",
          time_ranges: [
            {
              time: "05:47PM",
              red: 5,
              green: 2,
              yellow: 3
            },
            {
              time: "06:30PM",
              red: 4,
              green: 3,
              yellow: 5
            },
            {
              time: "07:25PM",
              red: 0,
              green: 5,
              yellow: 1
            }
          ]
        },
        {
          id: 4,
          name: "Pramanik Bhandar",
          lat: 0,
          long: 1,
          type: "GeneralStore",
          time_ranges: [
            {
              time: "05:47PM",
              red: 1,
              green: 2,
              yellow: 3
            },
            {
              time: "06:30PM",
              red: 4,
              green: 3,
              yellow: 5
            },
            {
              time: "07:25PM",
              red: 0,
              green: 5,
              yellow: 1
            }
          ]
        },
        {
          id: 5,
          name: "Hi5 Mart",
          lat: 23.399706,
          long: 85.375813,
          type: "GeneralStore",
          time_ranges: [
            {
              time: "05:47PM",
              red: 1,
              green: 5,
              yellow: 2
            },
            {
              time: "06:25PM",
              red: 2,
              green: 6,
              yellow: 4
            }
          ]
        }
      ],
      loginScreen: true,
      cur_user: {},
      selected_loc: {},
      crowdModal: false
    }
  }

  checkLogin = (profile) => {
    const { users } = this.state
    if (users.filter(user => user.username === profile.username).length > 0) {
      this.setState({
        cur_user: profile,
        loginScreen: false
      })
    }
    else {}
  }

  componentDidMount() {
    let geoOptions = {
      enableHighAccuracy: true,
      timeOut: 20000,
      maximumAge: 60 * 60 * 24
    }
    this.setState({ready: false, err: null})
    navigator.geolocation.getCurrentPosition(this.geoSuccess,
                                             this.geoFail,
                                             geoOptions)
  }

  geoSuccess = (position) => {
    console.log(position)
    console.log(position.coords)
    this.setState({
      ready: true,
      where: {lat: position.coords.latitude, long: position.coords.longitude}
    })
  }

  geoFail = (err) => {
    console.log(err)
  }

  pressMarker = loc => {
    this.setState({selected_loc: loc, detailView: !this.state.detailView})
  }

  getIcon = (loc) => {
    let latest_tr = loc.time_ranges[loc.time_ranges.length - 1]
    let gr = latest_tr.green
    let yl = latest_tr.yellow
    let rd = latest_tr.red
    if (loc.type == "GeneralStore") {
      if (rd > yl && rd > gr) {
        return require("./assets/red-store.png")
      }
      if (yl > gr) {
        return require("./assets/yellow-store.png")
      }
      return require("./assets/green-store.png")
    }
    else if (loc.type == "hospital") {
      if (rd > yl && rd >gr) {
        return require("./assets/red-hosp.png")
      }
      if (yl > gr) {
        return require("./assets/yellow-hosp.png")
      }
      return require("./assets/green-hosp.png")
    }
    return require("./assets/q.png")
  }

  addPeople = () => {
    this.setState({crowdModal: false})
  }

  render () {
    return (
      <View style={styles.container}>
        {this.state.loginScreen ?
          (
            <Login
              checkLogin={this.checkLogin}
            />
          )
        : this.state.ready ? (
          <Fragment>
            <MapView
            style={styles.map}
            initialRegion={{
              latitude:  this.state.where.lat,
              longitude: this.state.where.long,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }}
            >
              <Marker
                coordinate={{
                  latitude: this.state.where.lat,
                  longitude: this.state.where.long
                }}
                title="Current Location"
                onPress={() => this.setState({
                  detailView: !this.state.detailView,
                  selectedPinDetails: {
                    title: "Pin1",
                    red: 12,
                    yellow: 3,
                    green: 4,
                    white: 4
                  }
                })}
                pinColor={"blue"}
              />
              {this.state.locations.map(loc => (
                <Marker
                  coordinate={{
                    latitude: loc.lat,
                    longitude: loc.long
                  }}
                  icon={this.getIcon(loc)}
                  onPress={(loc) => this.pressMarker(loc)}
                />
              ))}
            </MapView>
            <View style={styles.topCard}>
                <Text>Welcome {this.state.cur_user.username}</Text>
            </View>
            <View style={styles.topButtonCard}>
                <Button
                  title="Set crowd"
                />
            </View>
            <Modal
              animationType="slide"
              visible={this.state.crowdModal}
              onRequestClose={() => {
                Alert.alert("Modal has been closed")
              }}
            >
              <View>
                <Text>Average number of people</Text>
                <TextInput
                  placeholder="Number of people"
                  onChangeText={(text) => {this.setState({numberOfPeople: text})}}
                />
                <Button
                  title="Add"
                  onPress={() => this.addPeople()}
                />
              </View>
            </Modal>
            {this.state.detailView && (
              <Card
                title="Tesst Card"
                red="5"
                yellow="2"
                white="3"
                green="6"
              />
            )}
          </Fragment>
        ): 
        <Text>Please enable location</Text>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1
  },
  inMapContainer: {},
  card: {
      width: 300,
      maxWidth: '80%',
      alignItems: 'center',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      shadowOpacity: 0.26,
      elevation: 8,
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      margin: 20,
      zIndex: 5
  },
  topCard: {
    width: 150,
    maxWidth: '40%',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 9,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    bottom: 560,
    left: -85,
  },
  topButtonCard: {
    width: 150,
    maxWidth: '40%',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    bottom: 620,
    left: 90
  }
});
