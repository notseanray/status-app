import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button } from 'react-native';
import { load_relay_ips, save_relay_ips } from './src/storage';
import React from 'react';
const axios = require('axios').default;

const MyComponent = () => {

  return <Text>Hello world</Text>;
};

setInterval(() => {
  //let newServers = servers;
  for (const server of load_relay_ips()) {
    axios.get("http://" + server)
      .then((response: { data: any }) => {
        if (!response.data) {
          return;
        }
        for (let i = 0; i < response.data.length; i ++) {
          console.log(response.data[i].host_name)
          const r = response.data[i];
          // newServers.push({ name: response.data[i].host_name, ip: )
        }
      })
  }
  //serverUpdate(newServers);
}, 10000);

export default function App() {
  console.log("s")
  const [text, onChangeText] = React.useState("");
  let [relay, RelayUpdate] = React.useState(load_relay_ips());
  const [, updateState] = React.useState();
  // @ts-expect-error
  const forceUpdate = React.useCallback(() => updateState({}), []);
  let final = [];
  for (const ip of load_relay_ips()) {
    final.push(<div key={ip.toString()}>
      <Button
        onPress={() => {
          let relay = load_relay_ips();
          relay = relay.filter(c => c != ip && c != "");
          save_relay_ips(relay);
        }}
        title={ip.toString()}
        color="#841584"
      />
    </div>);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello world</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder={"Add relay"}
        value={text}
      />
      <Button
        onPress={() => {
          if (!relay.includes(text)) {
            if (text && text.length > 1) {
              let updated = relay;
              updated.push(text);
              RelayUpdate(updated);
              onChangeText(text);
              save_relay_ips(relay);
            }
          }
          onChangeText("");
          forceUpdate();
        }}
        title="add/refresh"
        color="#841584"
      />
      <Text>{final}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    color: '#fff',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  input: {
    color: '#fff',
    backgroundColor: '#194D33',
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
});


