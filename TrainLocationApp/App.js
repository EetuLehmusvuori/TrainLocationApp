import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ToastAndroid,
} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Koti">
        <Stack.Screen name="Koti" component={KotiScreen} />
        <Stack.Screen name="Tietoja" component={TietojaScreen} />
        <Stack.Screen name="Aikataulut" component={AikataulutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const KotiScreen = props => {
  const [updateId, setUpdateId] = useState(0);
  const [newTrain, setTrain] = useState();
  const [trains, setTrains] = useState([]);
  const selectItemToUpdate = trainNumber1 => {
    //setUpdateId(trainNumber1);
    //setTrain(trains[trainNumber1].trainNumber1);

    //console.log("dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd", trainNumber1);
    props.navigation.navigate('Tietoja', {train: trainNumber1});
  };

  const keyHandler = (item, index) => {
    //console.log(item.trainNumber1 + '. ' + item.speed1);
    return index.toString();
  };
  const fetchTrain = async () => {
    let trainList = [];
    try {
      console.log('Fetching data');
      let response = await fetch(
        'https://rata.digitraffic.fi/api/v1/train-locations.geojson/latest',
      );
      console.log(response);
      console.log('JSONing data');
      let json = await response.json();
      for (let i = 0; i < json.features.length; i++) {
        const trainObject = {
          coordinates1: json.features[i].geometry.coordinates,
          trainNumber1: json.features[i].properties.trainNumber,
          speed1: json.features[i].properties.speed,
        };
        trainList.push(trainObject);
        console.log('Juna lisätty');
      }
    } catch (ex) {
      console.log('dadwdasd');
    }
    setTrains(trainList);
    console.log(trainList);
  };
  const renderTrain = item => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => selectItemToUpdate(item)}>
        <View style={styles.listItemStyle}>
          <Text>
            Juna nro: {item.item.trainNumber1} Nopeus: {item.item.speed1}km/h
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1}}>
      <Button
        style={styles.buttonStyle}
        title="Näytä junat"
        onPress={fetchTrain}
      />
      <View style={styles.listStyle}>
        <Text>Junat</Text>
        <FlatList
          style={styles.flatliststyle}
          keyExtractor={keyHandler}
          data={trains}
          renderItem={renderTrain}
        />
      </View>
      <NavButtons params={props} />
    </View>
  );
};
const TietojaScreen = props => {
  const [mapRegion, setMapRegion] = useState({
    latitude: props.route.params.train.item.coordinates1[1],
    longitude: props.route.params.train.item.coordinates1[0],
    latitudeDelta: 0,
    longitudeDelta: 0.2,
  });
  const [mapType, setMapType] = useState('satellite');
  const [latlng, setLatlng] = useState('Not yet');
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 3, alignItems: 'center', justifyContent: 'center'}}>
        {props.route.params ? (
          <Text>
            Junan nro: {props.route.params.train.item.trainNumber1} Nopeus:
            {props.route.params.train.item.speed1} km/h
          </Text>
        ) : null}
      </View>
      <SafeAreaView style={{flex: 8}}>
        <View style={{flex: 10}}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{flex: 1}}
            initialRegion={mapRegion}
            mapType={mapType} // standard, none, satellite, terrain (Android only), mutedStandard (IOS 11.0+ only)
            region={mapRegion}
            showUserLocation={true}>
            <Marker
              coordinate={mapRegion} //Could be: coordinate={{longitude:61.1234, latitude:24.1234}}
            />
          </MapView>
        </View>
      </SafeAreaView>
      <NavButtons params={props} />
    </View>
  );
};
// Aikatauli sivun alku
const AikataulutScreen = props => {
  const [newTrain, setTrainsSchedule] = useState();
  const [trains2, setTrainsSchedules] = useState([]);

  const keyHandler2 = (item, index) => {
    // console.log(
    // item.trainType1 +
    // '. ' +
    // item.trainNumber1 +
    // '. ' +
    // item.stationShortCode1 +
    // '. ' +
    // item.scheduledTime1 +
    // '. ' +
    // item.actualTime1 +
    // '. ' +
    // item.latency1,
    // );
    return index.toString();
  };

  const fetchTrainSchedule = async () => {
    let trainScheduleList = [];
    try {
      console.log('Fetching data');
      let response = await fetch(
        'https://rata.digitraffic.fi/api/v1/live-trains',
      );
      console.log('response');
      console.log(response);
      console.log('JSONing data');
      let json = await response.json();
      console.log('dadadwadsd');
      for (let i = 0; i < json[0].timeTableRows.length; i++) {
        const trainObject2 = {
          trainType1: json[i].trainType,
          trainNumber1: json[i].trainNumber,
          station1: json[0].timeTableRows[i].stationShortCode,
          scheduledTime1: json[0].timeTableRows[i].scheduledTime,
          actualTime1: json[0].timeTableRows[i].actualTime,
          latency1: json[0].timeTableRows[i].differenceInMinutes,
        };
        trainScheduleList.push(trainObject2);
        console.log('Aikataulut saatu');
      }
    } catch (error) {
      console.log('error');
    }
    setTrainsSchedules(trainScheduleList);
    console.log(trainScheduleList);
  };
  const renderTrainSchedule = item => {
    // console.log(
    // 'renderTrain A: ' +
    // item.item.trainType1 +
    // ' = ' +
    // item.item.station1 +
    // ' = ' +
    // item.item.trainNumber1 +
    // ' = ' +
    // item.item.scheduledTime1 +
    // ' = ' +
    // item.item.actualTime1 +
    // ' = ' +
    // item.item.latency1,
    // );
    return (
      <View style={styles.listItemStyle}>
        <Text>
          {item.item.trainType1} {item.item.trainNumber1} Asema:
          {item.item.station1} Tuloaika: {item.item.scheduledTime1} Oikea
          Tuloaika {item.item.actualTime1} Myöhästyminen:
          {item.item.latency1} minuuttia
        </Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Button
        style={styles.buttonStyle}
        title="Näytä Junien Aikataulut"
        onPress={fetchTrainSchedule}
      />
      <View style={styles.listStyle}>
        <FlatList
          style={styles.flatliststyle}
          keyExtractor={keyHandler2}
          data={trains2}
          renderItem={renderTrainSchedule}
        />
      </View>
    </View>
  );
};

const NavButton = par => {
  if (par.name != par.active) {
    return (
      <Button
        onPress={() => par.params.navigation.navigate(par.name)}
        title={par.name}
      />
    );
  }
  return null;
};
const NavButtons = ({params}) => {
  return (
    <View style={styles.navbuttonstyle}>
      <NavButton params={params} name="Koti" active={params.route.name} />
      <NavButton params={params} name="Tietoja" active={params.route.name} />
      <NavButton params={params} name="Aikataulut" active={params.route.name} />
    </View>
  );
};

const styles = StyleSheet.create({
  navbuttonstyle: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#def',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  imageContainer: {
    height: 200,
    width: '50%',
    borderRadius: 200,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'blue',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  listItemStyle: {
    borderWidth: 2,
    borderColor: 'blue',
    padding: 8,
    backgroundColor: '#abc',
    width: '80%',
    alignSelf: 'center',
  },
  listStyle: {
    flex: 8,
    alignItems: 'center',
    backgroundColor: '#eee',
    borderColor: 'blue',
    borderWidth: 2,
    width: '100%',
  },
  flatliststyle: {
    width: '100%',
    backgroundColor: 'blue',
  },
});
export default App;
