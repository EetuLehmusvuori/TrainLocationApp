import React, {useState} from 'react';
// Import required components
import {SafeAreaView, 
  StyleSheet, 
  View, 
  Button,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Switch,
  Text,
  ToastAndroid,
} from 'react-native';

// Import Map and Marker
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import {hasPermissionIOS, hasLocationPermission} from './permissions/Permissions';
import {getLocation} from './location/Location';

//Next two: Do not show Warn messages on UI
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

// let watchId=null;
const App = () => {
  const [forceLocation, setForceLocation] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [locationDialog, setLocationDialog] = useState(true);
  const [significantChanges, setSignificantChanges] = useState(false);
  const [isObserving, setObserving] = useState(false);
  const [foregroundService, setForegroundService] = useState(false);
  const [useLocationManager, setUseLocationManager] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRegion, setMapRegion]=useState({ latitude: 61.46894, longitude: 24.0215659, latitudeDelta: 0, longitudeDelta: 0.0421 });
  const [location, setLocation]=useState({coords: {latitude: 61.46894, longitude: 24.0215659, latitudeDelta: 0, longitudeDelta: 0.0421}});
  const [mapType, setMapType]=useState('satellite');
  const [latlng, setLatlng]=useState("Not yet");

  const setCurrentLocation=(position)=>{
    setLocation(position);
    setLatlng("("+position.coords.latitude+", "+position.coords.longitude+")")
  }


  const getLocationUpdates = async () => {
    if (isObserving==true){//if already observing
      return;
    }
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }
    //setting state variable isObserving
    setObserving(true);

    Geolocation.watchPosition(
          (position) => {
        setLocation(position);
        setLatlng("("+position.coords.latitude+", "+position.coords.longitude+")")
        console.log(position);
      },
      (error) => {
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: highAccuracy,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
        useSignificantChanges: significantChanges,
      },
    );
  };
  const stopLocationUpdates=()=>{
    Geolocation.stopObserving();
    setObserving(false);
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapStyle}
          initialRegion={{
            latitude: 61.78825,
            longitude: 24.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          // mapType can be standard, none, satellite, terrain (Android only), mutedStandard (IOS 11.0+ only)
          mapType={mapType} 
          region={mapRegion}
          showUserLocation={true}
          // customMapStyle={mapStyle}
          >
          <Marker
            draggable
            coordinate={mapRegion}
            onDragEnd={
              (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
            }
            title={'Test Marker'}
            description={'This is a description of the marker'}
          />
        </MapView>
      </View>
      <View style={styles.buttonView}>
        {/* Button press calls function getLocation of file ./location/Location.js */}
        <Button title="Get location" onPress={()=>getLocation(setCurrentLocation, highAccuracy, forceLocation, useLocationManager,locationDialog)} />
        <Button title="Start continuous" onPress={()=>getLocationUpdates()} />
        <Button title="Stop observing" onPress={()=>stopLocationUpdates()} />
        <Text>{latlng}</Text>
      </View>

    </SafeAreaView>
  );
};

export default App;


const styles = StyleSheet.create({
  container: {
    flex:7,
  },
  mapStyle: {
    flex:1,
  },
  buttonView:{
    flex:2,
  }
});