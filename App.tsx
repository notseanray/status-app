import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button } from 'react-native';
import { load_relay_ips, save_relay_ips } from './src/storage';
import React from 'react';
const axios = require('axios').default;
let details: any = [];

export default function App() {
  for (const server of load_relay_ips()) {
    axios.get("http://" + server)
      .then((response: { data: any }) => {
        if (!response.data) {
          return;
        }
        details = [];
        for (let i = 0; i < response.data.length; i ++) {
          console.log(response.data[i].host_name)
          const r = response.data[i];
          details.push(<div key={r.host_name + "|" + r.ip}>
            Host Name: {r.host_name}  CPU Temp {r.cpu_temp ? r.cpu_temp.toFixed(1) : 0}°C<br />
            IP: {r.ip} <br />
            LA: {r.load_avg.join(" ")} <br />
            RAM: {((r.memory_used / r.memory_total) * 100).toFixed(2)}% <br />
            UPTIME: {(r.uptime / 3600).toFixed(1)} hrs <br />
          </div>)
        }
      })
  }
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
        color="#373737"
      />
    </div>);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Server Status</Text>
      <div className="styles.relayBox">
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder={"add relay"}
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
          color="#373737"
        />
      </div>
      <Text>{final}</Text>
      <Text style={styles.text}>{details}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  relayBox: {
    display: 'flex',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    color: '#fff',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    width: '15em',
    borderRadius: 3,
    padding: 5,
    color: '#fff',
    backgroundColor: '#474747',
    height: 40,
  },
});


