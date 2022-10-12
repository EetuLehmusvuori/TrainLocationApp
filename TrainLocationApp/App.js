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
} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Schedule from './Schedule';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Koti">
        <Stack.Screen name="Koti" component={KotiScreen} />
        <Stack.Screen name="Tietoja" component={TietojaScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const KotiScreen = props => {
  const [updateId, setUpdateId] = useState(0);
  const [newTrain, setTrain] = useState();
  const [trains, setTrains] = useState([]);
  const selectItemToUpdate = trainNumber1 => {
    setUpdateId(trainNumber1);
    setTrain(trains[trainNumber1].trainNumber1);
    props.navigation.navigate('Tietoja', {train: trains[trainNumber1]});
  };

  const keyHandler = (item, index) => {
    console.log(item.trainNumber1 + '. ' + item.speed1);
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
    console.log(
      'renderTrain A:xxxxxxxxxxxxxx ' +
        item.item.trainNumber1 +
        ' = ' +
        item.item.speed1,
    );
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => selectItemToUpdate(item.index)}>
        <View style={styles.listItemStyle}>
          <Text>
            Junan nro: {item.item.trainNumber1} Nopeus: {item.item.speed1}km/h
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Button
        style={styles.buttonStyle}
        title="Read train"
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
  const [newTrain, setTrain] = useState(
    props.route.params == undefined
      ? ''
      : props.route.params.train.trainNumber1,
  );
  useEffect(() => {
    setTrain(
      props.route.params == undefined
        ? ''
        : props.route.params.train.trainNumber1,
    );
  }, [props.route.params]);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
        {props.route.params ? (
          <Text>
            Junan nro: {props.route.params.train.trainNumber1} Nopeus:
            {props.route.params.train.speed1}km/h
          </Text>
        ) : null}
      </View>
      <NavButtons params={props} />
    </View>
  );
};

// Aikatauli sivun alku
const ScheduleScreen = props => {
  const [newTrain, setTrainsSchedule] = useState();
  const [trains2, setTrainsSchedules] = useState([]);

  const keyHandler2 = (item, index) => {
    console.log(
      item.trainType +
        '. ' +
        item.trainNumber +
        '. ' +
        item.stationShortCode +
        '. ' +
        item.scheduledTime +
        '. ' +
        item.actualTime +
        '. ' +
        item.latency,
    );
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

      console.log(json[0].trainType);
      console.log(json[0].trainNumber);
      for (let i = 0; i < json[0].timeTableRows.length; i++) {
        console.log(json[0].timeTableRows[i].stationShortCode);
        console.log(json[0].timeTableRows[i].scheduledTime);
        console.log(json[0].timeTableRows[i].actualTime);
        console.log(json[0].timeTableRows[i].differenceInMinutes);
      }

      // for (let i = 0; i < json.length; i++) {
      //   const trainObject2 = {
      //     trainType1: json[i].trainType,
      //     trainNumber1: json[i].trainNumber,
      //     // station1: json.features[i].stationShortCode,
      //     // scheduledTime1: json.features[i].scheduledTime,
      //     // actualTime1: json.features[i].actualTime,
      //     // latency1: json.features[i].differenceInMinutes,
      //   };
      trainScheduleList.push(trainObject2);
      console.log('Aikataulut saatu');
      // }
    } catch (error) {
      console.log('error');
    }
    setTrainsSchedules(trainScheduleList);
    console.log(trainScheduleList);
  };
  const renderTrainSchedule = item => {
    console.log(
      'renderTrain A: ' +
        item.item.trainType +
        ' = ' +
        item.item.station +
        ' = ' +
        item.item.trainNumber +
        ' = ' +
        item.item.scheduledTime +
        ' = ' +
        item.item.actualTime +
        ' = ' +
        item.item.latency,
    );
    return (
      <View style={styles.listItemStyle}>
        <Text>
          {item.item.trainType1} {item.item.trainNumber1} Asema:
          {item.item.station1} Tuloaika:{item.item.scheduledTime1} Oikea
          Tuloaika{item.item.actualTime1} Myöhästyminen:{' '}
          {item.item.differenceInMinutes}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
      <NavButton params={params} name="Schedule" active={params.route.name} />
    </View>
  );
};

const styles = StyleSheet.create({
  flatliststyle: {
    wtrainNumberth: '80%',
    backgroundColor: 'blue',
  },
  listItemStyle: {
    borderWtrainNumberth: 1,
    borderColor: 'blue',
    padding: 5,
    backgroundColor: '#abc',
    alignSelf: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    wtrainNumberth: '100%',
    width: '100%',
  },
  formView: {
    flex: 1,

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

    alignSelf: 'center',
    width: '100%',
  },

  listStyle: {
    flex: 8,
    width: '100%',
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
