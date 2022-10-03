import React from 'react';
import {Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
//Import exported function hasLocationPermission from ../permissions/Permissions.js
import {hasLocationPermission} from '../permissions/Permissions';

// Function is called from App.js
export const getLocation = async (setCurrentLocation, ...props) => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation(position);
        console.log("Current location: "+position.coords.latitude+","+position.coords.longitude);
      },
      (error) => {
        Alert.alert(`Code ${error.code}`, error.message);
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: props.highAccuracy,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: props.forceLocation,
        forceLocationManager: props.useLocationManager,
        showLocationDialog: props.locationDialog,
      },
    );
  };
  