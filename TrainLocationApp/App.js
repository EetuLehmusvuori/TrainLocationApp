import { DEFAULT_EXTENSIONS } from '@babel/core';

import React, {useState, useEffect} from 'react';

import { Button, StyleSheet, Text, TextInput, FlatList, View } from 'react-native';

 

const App=() => {
const [newTrain, setTrain]=useState();
const [trainlist, addTrain]=useState();
const [loading, setLoading]=useState(true)

const setTrainList=()=>{
    addTrain=(list);
}
const keyHandler=(item)=>{
    console.log(item.coordinates+". "+item.trainNumber+". "+item.speed);
    return item.trainNumber.toString
}
 
   const fetch = require("node-fetch");

   const fetchTrain=async()=>{
    try{
    console.log("Fetching data");
    let response=await fetch("https://rata.digitraffic.fi/api/v1/train-locations.geojson/latest");
    console.log(response);
    console.log("JSONing data");
    let json=await response.json();

    console.log(json);
    var s = "";
    for(var i = 0; i < json.features.length; i ++) {
      s += json.features[i] + "<br>";
    
    console.log(json.features[i].geometry.coordinates);
    console.log(json.features[i].properties.trainNumber);
    console.log(json.features[i].properties.speed);
    }
        setTrainList(json)
        console.log("Juna lisätty")
    }
    catch(error){
      console.log("error");
    
    }}
    const renderTrain=(item)=>{
        console.log("RenderTrain A:"+item.item.coordinates+"="+item.item.trainNumber+"="+item.item.speed);
        return <View>
            <Text>{item.index} {fetchTrain.item.coordinates} {fetchTrain.item.trainNumber} {fetchTrain.item.speed}</Text>
            </View>;
            
    }

      return(<View>
        <Text>Trains</Text>
        <Button title="Näytä junat" onPress={fetchTrain}/>
        <View>
        <FlatList
        keyExtractor={keyHandler}
        data={fetchTrain.trainlist}
        renderItem={renderTrain}
        />
        </View>
        </View>);
    
    }

export default App;
   

  
 

  

 

   

    