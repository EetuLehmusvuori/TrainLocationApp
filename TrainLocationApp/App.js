import { DEFAULT_EXTENSIONS } from '@babel/core';

import React, {useState, useEffect} from 'react';

import { Button, StyleSheet, Text, TextInput, FlatList, View } from 'react-native';

 

const App=() => {
const [newTrain, setData]=useState();
 const [loading, setLoading]=useState(true)
 
   const fetch = require("node-fetch");
const fetchTrain=async()=>{

    try{
  
console.log("Fetching data");

    let response=await fetch("https://rata.digitraffic.fi/api/v1/train-locations.geojson/latest");

    console.log(response);

    console.log("JSONing data");

    let json=await response.json();

    console.log(json);
    console.log("Ensimmäinen juna");
    console.log(json.features[0].geometry.coordinates);
    console.log(json.features[0].properties.trainNumber);
    console.log(json.features[0].properties.speed);


   

    }

    catch(ex){
        console.log("dadwdasd");
     

    }
  }

 return(<View>
    <Text>Hello train</Text>
    <Button title="Näytä junat" onPress={fetchTrain}/>
    </View>);

}

export default App;
 

  

 

   

    