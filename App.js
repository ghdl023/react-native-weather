import {StyleSheet, Text, View, ScrollView, Dimensions, Image } from 'react-native';
import * as Location from 'expo-location';
import {useEffect, useState} from "react";

const { width:SCREEN_WIDTH } = Dimensions.get('window');

const API_KEY = '463c72873fdd61e84a427b80d4b71628';

export default function App() {
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('Loading...');
  const [ok, setOk] = useState(true);
  const [list, setList] = useState([]);


  const getWeather = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log(status);
    if (status !== 'granted') {
      setOk(false);
      return false;
    }

    const { coords: { latitude, longitude }} = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, { useGoogleMaps: false});
    console.log(location);
    setRegion(location[0].region);
    setDistrict(location[0].district);

    const result = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
    const json = await result.json();
    // console.log(json.list);
    const _list = [
      { id:0, list: json.list.slice(0,8) },
      { id:1, list: json.list.slice(8,16) },
      { id:2, list: json.list.slice(16,24) },
      { id:3, list: json.list.slice(24,32) },
      { id:4, list: json.list.slice(32,40) },
    ];
    console.log(_list);
    setList(_list);
  }

  useEffect(()=>{
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.region}>{ region }</Text>
        <Text style={styles.district}>{ district }</Text>
      </View>
      <View style={styles.body}>
        <ScrollView
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bodyTop}>
          { list.length === 0 ? '' : list.map((row, pIndex) => (
              <View style={styles.weatherDailyBox} key={pIndex}>
                <View style={{ width: '100%', paddingLeft: 60, marginBottom: 50}}>
                  <Text style={styles.weatherDate}>{ row.list[0].dt_txt.split(" ")[0] }</Text>
                </View>
                { row.list.map((it, index)=>{
                    return <View style={styles.weatherHourlyBox} key={index}>
                      <Text style={styles.weatherTime}>~ { it.dt_txt.split(" ")[1].substring(0,5) }</Text>
                      <Image style={styles.weatherIcon} source={{ uri: `http://openweathermap.org/img/w/${it.weather[0].icon}.png` }} />
                      <Text style={styles.weatherName}>{ it.weather[0].main }</Text>
                    </View>
                })}
              </View>
          )) }
        </ScrollView>
        <View style={styles.bodyBottom}>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  header: {
    flex:1,
    backgroundColor: '#7540EE',
    justifyContent: 'flex-end',
    paddingLeft: 60,
    paddingBottom: 20,
  },
  region: {
    fontSize: 20,
    color: "#FFFFFF",
    marginLeft: 10,
  },
  district: {
    fontSize: 60,
    fontWeight: '500',
    color: "#FFFFFF",
  },
  body: {
    flex:3.5,
    backgroundColor: '#7540EE',
    alignItems: 'center',
  },
  bodyTop: {
    marginTop: 50,
  },
  weatherDailyBox: {
    width: SCREEN_WIDTH,
    height: '80%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
  },
  weatherDate: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  weatherHourlyBox: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  weatherTime: {
    fontSize: 16,
    fontWeight: '500',
    color: "#FFFFFF",
  },
  weatherName: {
    color: "#FFFFFF",
  },
  bodyBottom: {
    flex: 1,
    backgroundColor: 'yellow',
  },
});