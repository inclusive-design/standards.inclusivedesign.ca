export default function objectArrayPush(obj, key, value) {
    if (Array.isArray(value)) {
        obj[key] = [...new Set([...obj[key], ...value])];
    } else {
        if (!obj[key].includes(value)) {
            obj[key].push(value);
        }
    }
    return obj;
}
