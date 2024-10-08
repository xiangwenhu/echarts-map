import axios from "axios";
import * as fs from "fs";
import { type AreaInfoItem, type GeoJSON } from "./type";
import * as path from "path";
import { delay } from "./util";

const ADCODE_CHINA = 100000;
const DIST = path.join(__dirname, "../public/data/geo");

const root: AreaInfoItem = {
    adcode: ADCODE_CHINA,
    name: '中国',
    level: 'country',
    childrenNum: 34,
}

function getFilename({ adcode, name, level, childrenNum }: AreaInfoItem) {
    if (adcode === ADCODE_CHINA) return `${adcode}_full.json`;
    if (childrenNum == 0) return `${adcode}.json`;
    return level == "district" ? `${adcode}.json` : `${adcode}_full.json`;
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
        adcode: p.properties.adcode,
        name: p.properties.name,
        level: p.properties.level,
        childrenNum: p.properties.childrenNum
    })).filter((it: any) => Boolean(it.name));

    return areaInfos;
}


async function downloadGeoData(areaInfo: AreaInfoItem) {
    const geoJSON = await getGeoJSON(areaInfo);
    console.log(`${areaInfo.name}: ${areaInfo.adcode}`);
    const children = geoJSONToAreaInfo(geoJSON);
    saveFile(geoJSON, `${areaInfo.adcode}.json`)
    if (!children || children.length == 0) return;
    if (children.length == 1 && children[0].adcode === areaInfo.adcode) return;

    areaInfo.children = children;
    for (let i = 0; i < areaInfo.children!.length; i++) {
        const aInfo = areaInfo.children[i];
        await delay(500);
        await downloadGeoData(aInfo)
    }
    return;
}


; (async function () {

    const startTime = new Date();
    await downloadGeoData(root);
    const endTime = new Date();

    console.log("starTime:", startTime.toLocaleTimeString());
    console.log("endTime:", endTime.toLocaleTimeString());
    console.log("cost:", Math.round((endTime.getTime() - startTime.getTime()) / 1000));

})();
