import React, {useState, useEffect} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  View,
  ImageEditor,
} from 'react-native';

const ScheduleApp = () =>{
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tietoja">
        <Stack.Screen name="Koti" component={KotiScreen} />
        <Stack.Screen name="Tietoja" component={TietojaScreen} />
        <Stack.Screen name="Kuva" component={ImageScreen} />
        <Stack.Screen name="Aikataulut" component={Schedule} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Schedule = () => {
  const [newTrain, setTrainsSchedule] = useState();
  const [trains, setTrainsSchedules] = useState([]);

  const keyHandler = (item, index) => {
    console.log(item.trainType1 + '. ' + item.trainNumber1 + '. ' + item.station1 + '. ' + item.scheduledTime1 + '. ' + item.actualTime1 + '. ' + item.latency1);
    return index.toString();
  };

  const fetchTrainSchedule = async () => {
    let trainScheduleList = [];
    try {
      console.log('Fetching data');
      let response = await fetch(
        'https://rata.digitraffic.fi/api/v1/live-trains',
      );
      console.log(response);
      console.log('JSONing data');
      let json = await response.json();
      for (let i = 0; i < json.features.length; i++) {
        const trainObject = {
          trainType1: json.features[i].trainType,
          trainNumber1: json.features[i].trainNumber,
          station1: json.features[i].stationShortCode,
          scheduledTime1: json.features[i].scheduledTime,
          actualTime1: json.features[i].actualTime,
          latency1: json.features[i].differenceInMinutes,
        };
        trainScheduleList.push(trainObject);
        console.log('Aikataulut saatu');
      }
    } catch (error) {
      console.log('error');
    }
    setTrainsSchedule(trainScheduleList);
    console.log(trainScheduleList);
  };
  const renderTrain = (item) => {
    console.log(
      'renderTrain A:xxxxxxxxxxxxxx ' + item.item.trainType1 + ' = ' + item.item.station1 + ' = ' + item.item.trainNumber1 + ' = ' + item.item.scheduledTime1 + ' = ' + item.item.actualTime1 + ' = ' + item.item.latency1,
    );
    return (
      <View style={styles.listItemStyle}>
        <Text>
        {item.item.trainType1} {item.item.trainNumber1} Asema:{item.item.station1} Tuloaika:{item.item.scheduledTime1} Oikea Tuloaika{item.item.actualTime1} Myöhästyminen: {item.item.differenceInMinutes}
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
          keyExtractor={keyHandler}
          data={trains}
          renderItem={renderTrain}
        />
      </View>
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
      <NavButton params={params} name="AikaTaulu" active={params.route.name} />
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
    marginTop: 20,
    wtrainNumberth: '100%',
  },
  listStyle: {
    flex: 8,
    width:'100%',
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

export default Schedule;