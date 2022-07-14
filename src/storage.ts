import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

export const load_relay_ips = () => {
    const result = storage.getString("relays")?.split("|");
    if (!result) {
        return [];
    }
    return result;
};

export const save_relay_ips = (relays: String[]) => {
    if (relays.length == 0) {
        storage.delete("relays");
        return;
    } 
    storage.set("relays", relays.join("|"));
};