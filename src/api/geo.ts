import { get } from "./request";

export function getGeoJSON(filename: string) {
    return get({
        url: `/geo/areas_v3/bound/${filename}`
    })
}

export function getGeoJSONLocal(filename: string) {
    return get({
        url: `/data/geo/${filename}`
    })
}