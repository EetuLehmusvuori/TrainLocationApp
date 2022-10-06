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

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tietoja">
        <Stack.Screen name="Koti" component={KotiScreen} />
        <Stack.Screen name="Tietoja" component={TietojaScreen} />
        <Stack.Screen name="Kuva" component={ImageScreen} />
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
    props.route.params == undefined ? '' : props.route.params.train.trainNumber1,
  );
  useEffect(() => {
    setTrain(
      props.route.params == undefined ? '' : props.route.params.train.trainNumber1,
    );
  }, [props.route.params]);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
      {props.route.params ?
          <Text>
            Junan nro: {props.route.params.train.trainNumber1} Nopeus:
            {props.route.params.train.speed1}km/h
          </Text>
      : null}
      </View>
      <NavButtons params={props} />
    </View>
  );
};
const ImageScreen = props => {
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.imageContainer}>
          <Image
            source={require('./assets/stop.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>
      <NavButtons params={props} />
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
      <NavButton params={params} name="Kuva" active={params.route.name} />
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
