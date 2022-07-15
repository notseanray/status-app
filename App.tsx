import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
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
          const r = response.data[i];
          details.push(<div key={r.host_name + "|" + r.ip}>
            <br />
            <br />
            <Text style={styles.hostName}>host: {r.host_name}  </Text> <br />
            <Text style={styles.cpuTemp}>cpu temp {r.cpu_temp ? r.cpu_temp.toFixed(1) : 0}°C </Text> <br />
            <Text style={styles.ip}>ip: {r.ip} </Text> <br />
            <Text style={styles.loadAvg}>load avg: {r.load_avg.join(" ")} </Text> <br />
            <Text style={styles.ram}>ram: {((r.memory_used / r.memory_total) * 100).toFixed(2)}% </Text> <br />
            <Text style={styles.uptime}>uptime: {(r.uptime / 3600).toFixed(1)} hrs </Text> <br />
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
      <Pressable
        onPress={async () => {
          let relay = load_relay_ips();
          relay = relay.filter((c: any) => c != ip && c != "");
          save_relay_ips(relay);
        }}
      >
        <Text style={styles.relayButton}>{ip}</Text>
      </Pressable>
    </div>);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Server Status</Text>
      <div className="styles.relayBox">
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder={"add relay"}
          value={text}
        />
        <Pressable
          style={styles.button}
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
        >
          <Text style={styles.relayButton}>add/refresh</Text>
        </Pressable>
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
    backgroundColor: '#282828',
    alignItems: 'center',
    color: '#fff',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  hostName: {
    color: '#7eb0a4',
    fontWeight: 'bold',
  },
  cpuTemp: {
    color: '#d3869b',
  },
  ip: {
    color: '#e98b4d',
  },
  loadAvg: {
    color: '#d76b68',
  },
  ram: {
    color: '#8ec07c',
  },
  uptime: {
    color: '#c69e6d',
  },
  input: {
    width: '15em',
    borderRadius: 3,
    padding: 5,
    color: '#fff',
    backgroundColor: '#474747',
    height: 40,
  },
  relayButton: {
    color: '#d5bf98',
    padding: 2,
  },
  title: {
    color: '#ec6863',
    fontSize: 40,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#665c53',
  },
});