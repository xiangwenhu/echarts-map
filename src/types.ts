export type LevelValue = "country" | "province" | "city" | "district";

export interface AreaInfoItem {
    adcode: number;
    name: string;
    level: LevelValue;
    childrenNum: number;
    children?: AreaInfoItem[]
}


export interface GeoJSON {
    type: "FeatureCollection";
    features: {
        type: "Feature";
        properties: {
            adcode: number;
            name: string;
            childrenNum: number,
            level: LevelValue,
            parent: {
                adcode: number;
            },
            subFeatureIndex: number,
        },
    }[]
}