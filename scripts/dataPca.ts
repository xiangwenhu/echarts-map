import axios from "axios";
import * as fs from "fs";
import { AreaInfoItem, GeoJSON } from "./dataPca.type";
import * as path from "path";

const ADCODE_CHINA = 100000;
const DIST = path.join(__dirname, "../data/pca");

const root: AreaInfoItem = {
    code: ADCODE_CHINA,
    name: '中国',
    level: 'country',
    childrenNum: 34,
}

function getFilename({ code, name, level, childrenNum }: AreaInfoItem) {
    if (code === ADCODE_CHINA) return `${code}_full.json`;
    if (childrenNum == 0) return `${code}.json`;
    return level == "district" ? `${code}.json` : `${code}_full.json`;
}

async function getGeoJSON(areaInfo: AreaInfoItem) {
    const fName = getFilename(areaInfo);
    const geoJSON = await axios.get(`https://geo.datav.aliyun.com/areas_v3/bound/${fName}`)
        .then(res => res.data);
    return geoJSON as GeoJSON
}


function saveFile(data: Record<string, any>, filename: string) {
    const fullFilename = path.join(DIST, filename);
    fs.writeFileSync(fullFilename, JSON.stringify(data, undefined, "\t"))
}


function geoJSONToAreaInfo(geoJSON: GeoJSON) {
    if (!Array.isArray(geoJSON.features) || geoJSON.features.length == 0) return undefined
    const areaInfos: AreaInfoItem[] = geoJSON.features.map((p: any) => ({
        code: p.properties.adcode,
        name: p.properties.name,
        level: p.properties.level,
        childrenNum: p.properties.childrenNum
    })).filter((it: any) => Boolean(it.name));

    return areaInfos;
}


async function getAreaData(areaInfo: AreaInfoItem) {
    if (areaInfo.childrenNum == 0) return areaInfo;
    const geoJSON = await getGeoJSON(areaInfo);
    const children = geoJSONToAreaInfo(geoJSON);
    if (!children || children.length == 0) return areaInfo;

    areaInfo.children = children;
    for (let i = 0; i < areaInfo.children!.length; i++) {
        const aInfo = areaInfo.children[i];
        if (aInfo.childrenNum == 0) continue;
        console.log(`${areaInfo.name} => ${aInfo.name}`);
        await getAreaData(aInfo)
    }
    return areaInfo;
}


; (async function () {

    const startTime = new Date();
    const result = await getAreaData(root);
    saveFile(result, "pca-code.json")
    const endTime = new Date();

    console.log("starTime:", startTime.toLocaleTimeString());
    console.log("endTime:", endTime.toLocaleTimeString());
    console.log("cost:", Math.round((endTime.getTime() - startTime.getTime()) / 1000));

})();
