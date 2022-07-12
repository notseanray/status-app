import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

const load_ips = (): String[] => {
    const result = storage.getString("ips")?.split("|");
    if (!result) {
        return [];
    }
    return result;
};

const save_ips = (ips: String[]) => {
    storage.set("ips", ips.join("|"));
};

const load_blacklist = (): String[] => {
    const result = storage.getString("blacklist")?.split("|");
    if (!result) {
        return [];
    }
    return result;
};

const save_blacklist = (blacklist: String[]) => {
    storage.set("blacklist", blacklist.join("|"));
};

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