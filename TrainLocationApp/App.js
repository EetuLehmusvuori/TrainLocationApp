import React, {useState, useEffect} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  View,
} from 'react-native';

const App = () => {
  const [newTrain, setTrain] = useState();
  const [trains, setTrains] = useState([]);

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
  const renderTrain = (item) => {
    console.log(
      'renderTrain A:xxxxxxxxxxxxxx ' + item.item.trainNumber1 + ' = ' + item.item.speed1,
    );
    return (
      <View style={styles.listItemStyle}>
        <Text>
          {item.item.trainNumber1} {item.item.speed1}
        </Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Button
        style={styles.buttonStyle}
        title="Read train"
        onPress={fetchTrain}
      />
      <View style={styles.listStyle}>
        <FlatList
          style={styles.flatliststyle}
          keyExtractor={keyHandler}
          data={trains}
          renderItem={renderTrain}
        />
      </View>
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
    wtrainNumberth: '80%',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    wtrainNumberth: '100%',
  },
  formView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#def',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
    wtrainNumberth: '100%',
  },
  listStyle: {
    flex: 8,
    alignItems: 'center',
    backgroundColor: '#eee',
    borderColor: 'green',
    borderWtrainNumberth: 2,
    wtrainNumberth: '100%',
  },
  inputStyle: {
    backgroundColor: '#abc',
    borderColor: 'black',
    borderWtrainNumberth: 2,
    margin: 2,
    padding: 5,
    wtrainNumberth: '50%',
  },
  buttonStyle: {
    margin: 2,
    padding: 5,
    wtrainNumberth: '20%',
  },
});

export default App;
