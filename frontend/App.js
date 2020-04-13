import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

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

class LoginScreen extends Component {
  constructor () {
    super()
  }
  render () {
    return (
      <View>
        <Text>Login</Text>
      </View>
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
        {username: "user1",
        password: "password1"},
        {username: "user2",
        password: "password2"}
      ]
    }
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
  render () {
    return (
      <View style={styles.container}>
        {this.state.ready ? (
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
                pinColor={"green"}
              />
              <Marker
                coordinate={{
                  latitude: 23.401851,
                  longitude: 85.370213
                }}
                pinColor={"red"}
                onPress={() => this.setState({
                  detailView: !this.state.detailView,
                  selectedPinDetails: {
                    title: "Pin2",
                    red: 1,
                    yellow: 2,
                    green: 3,
                    white: 4
                  }
                })}
              />
            </MapView>
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
      margin: 20
  }
});
