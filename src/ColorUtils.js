import convert from "color-convert";

export function getColorDataFromHex(hex, colorMode) {
    let newColor;
    // ["HSB", "HSL", "RGB", "CMYK"]
    switch (colorMode) {
        case "HSB":
            newColor = convert.hex.hsv.raw(hex);
            break;
        case "HSL":
            newColor = convert.hex.hsl.raw(hex);
            break;
        case "RGB":
            newColor = convert.hex.rgb.raw(hex);
            break;
        case "CMYK":
            newColor = convert.hex.cmyk.raw(hex);
            break;
    }
    return newColor;
}

export function getHexFromColorData(colorData, colorMode) {
    let newColorData;
    // ["HSB", "HSL", "RGB", "CMYK"]
    switch (colorMode) {
        case "HSB":
            newColorData = convert.hsv.hex(colorData);
            break;
        case "HSL":
            newColorData = convert.hsl.hex(colorData);
            break;
        case "RGB":
            newColorData = convert.rgb.hex(colorData);
            break;
        case "CMYK":
            newColorData = convert.cmyk.hex(colorData);
            break;
    }
    return newColorData;
}

export function getColorDataFromHSB(hsbColorData, colorMode) {
    let newColorData;
    // ["HSB", "HSL", "RGB", "CMYK"]
    switch (colorMode) {
        case "HSB":
            newColorData = hsbColorData.concat();
            break;
        case "HSL":
            newColorData = convert.hsv.hsl.raw(hsbColorData);
            break;
        case "RGB":
            newColorData = convert.hsv.rgb.raw(hsbColorData);
            break;
        case "CMYK":
            newColorData = convert.hsv.cmyk.raw(hsbColorData);
            break;
    }
    return newColorData;
}

export function getHSBFromColorData(colorData, colorMode) {
    let newColorData;
    switch (colorMode) {
        case "HSB":
            newColorData = colorData.concat();
            break;
        case "HSL":
            newColorData = convert.hsl.hsv.raw(colorData);
            break;
        case "RGB":
            newColorData = convert.rgb.hsv.raw(colorData);
            break;
        case "CMYK":
            newColorData = convert.cmyk.hsv.raw(colorData);
            break;
    }
    return newColorData;
}

export function getColorRotatedHSB(hsbColorData, degreeClockwise) {
    let newHsb = hsbColorData.concat();
    newHsb[0] = (newHsb[0] + degreeClockwise + 360) % 360;
    return newHsb;
}

export function getColorRotatedHex(colorHex, degreeClockwise) {
    let hsl = convert.hex.hsl(colorHex);
    hsl[0] = (hsl[0] + degreeClockwise) % 360;
    return convert.hsl.hex(hsl);
}

function getSplitComplementaryColorFromHSBRoot(hsbRoot, colorMode = "HSB") {
    const hsbRotatedOne = getColorRotatedHSB(hsbRoot, 150);
    const hsbRotatedTwo = getColorRotatedHSB(hsbRoot, 210);

    return [
        { hex: "#" + convert.hsv.hex(hsbRotatedOne), colorData: getColorDataFromHSB(hsbRotatedOne, colorMode) },
        { hex: "#" + convert.hsv.hex(hsbRotatedTwo), colorData: getColorDataFromHSB(hsbRotatedTwo, colorMode) },
    ];
}

export function getSplitComplementaryColorFromHex(hex, colorMode = "HSB") {
    return getSplitComplementaryColorFromHSBRoot(convert.hex.hsv.raw(hex), colorMode);
}

export function getSplitComplementaryColorFromColorData(colorData, colorMode = "HSB") {
    return getSplitComplementaryColorFromHSBRoot(getHSBFromColorData(colorData, colorMode));
}

export function getHSBSplitComplementaryColor(color, colorMode) {
    if (colorMode === "HSB") {
        return getSplitComplementaryColorFromColorData(color.colorData, colorMode);
    } else {
        return getSplitComplementaryColorFromHex(color.hex, colorMode);
    }
}

function getTriadColorFromHSBRoot(hsbRoot, colorMode = "HSB") {
    const hsbRotatedOne = getColorRotatedHSB(hsbRoot, 120);
    const hsbRotatedTwo = getColorRotatedHSB(hsbRoot, 240);

    return [
        { hex: "#" + convert.hsv.hex(hsbRotatedOne), colorData: getColorDataFromHSB(hsbRotatedOne, colorMode) },
        { hex: "#" + convert.hsv.hex(hsbRotatedTwo), colorData: getColorDataFromHSB(hsbRotatedTwo, colorMode) },
    ];
}

export function getTriadColorFromHex(hex, colorMode = "HSB") {
    return getTriadColorFromHSBRoot(convert.hex.hsv.raw(hex), colorMode);
}

export function getTriadColorFromColorData(colorData, colorMode = "HSB") {
    return getTriadColorFromHSBRoot(getHSBFromColorData(colorData, colorMode));
}

export function getHSBTriadColor(color, colorMode) {
    if (colorMode === "HSB") {
        return getTriadColorFromColorData(color.colorData, colorMode);
    } else {
        return getTriadColorFromHex(color.hex, colorMode);
    }
}

function getComplementaryColorFromHSBRoot(hsbRoot, colorMode = "HSB") {
    const hsbRotatedOne = getColorRotatedHSB(hsbRoot, 180);
    return { hex: "#" + convert.hsv.hex(hsbRotatedOne), colorData: getColorDataFromHSB(hsbRotatedOne, colorMode) };
}

export function getComplementaryColorFromHex(hex, colorMode = "HSB") {
    return getComplementaryColorFromHSBRoot(convert.hex.hsv.raw(hex), colorMode);
}

export function getComplementaryColorFromColorData(colorData, colorMode = "HSB") {
    return getComplementaryColorFromHSBRoot(getHSBFromColorData(colorData, colorMode));
}

export function getHSBComplementaryColor(color, colorMode) {
    if (colorMode === "HSB") {
        return getComplementaryColorFromColorData(color.colorData, colorMode);
    } else {
        return getComplementaryColorFromHex(color.hex, colorMode);
    }
}

export function getAnalogousColorFromHSBCenter(centerColorDataHSB, hueDiff, numNodes, colorMode = "HSB") {
    if (numNodes * hueDiff >= 360) {
        hueDiff = 360 / numNodes;
    }
    let ret = {};
    for (let i = 1; i <= numNodes; i++) {
        // gets index difference between center (either logical or actual) and index i node. Multiplies that by hueDiff
        const iColorData = getColorRotatedHSB(centerColorDataHSB, (i - (numNodes / 2 + 0.5)) * hueDiff);
        ret[i] = { hex: "#" + getHexFromColorData(iColorData, "HSB"), colorData: getColorDataFromHSB(iColorData, colorMode) };
    }
    return ret;
}

export function getAnalogousColorFromHexCenter(hex, hueDiff, numNodes, colorMode = "HSB") {
    return getAnalogousColorFromHSBCenter(convert.hex.hsv.raw(hex), hueDiff, numNodes, colorMode);
}

export function getAnalogousColorFromColorDataCenter(colorData, hueDiff, numNodes, colorMode = "HSB") {
    return getAnalogousColorFromHSBCenter(getHSBFromColorData(colorData, colorMode), hueDiff, numNodes, colorMode);
}

export function getHSBAnalogousColor(color, hueDiff, numNodes, colorMode = "HSB") {
    if (colorMode === "HSB") {
        return getAnalogousColorFromHSBCenter(color.colorData, hueDiff, numNodes, colorMode);
    } else {
        return getAnalogousColorFromHexCenter(color.hex, hueDiff, numNodes, colorMode);
    }
}

export function getCenterColorHSB(colors, colorMode = "HSB") {
    const numNodes = Object.keys(colors).length;
    if (numNodes % 2 === 1) {
        // numNodes is odd, can take center
        return colors[Math.round(numNodes / 2 + 0.5)].colorData;
    } else {
        const colorOne = getHSBFromColorData(colors[numNodes / 2].colorData, colorMode);
        const colorTwo = getHSBFromColorData(colors[numNodes / 2 + 1].colorData, colorMode);
        return [(colorOne[0] + colorTwo[0]) / 2, colorOne[1], colorOne[2]];
    }
}

export function getAbsoluteHueDiff(prevColorHSB, newColorHSB) {
    let hueDiff = newColorHSB[0] - prevColorHSB[0];

    // Handles when the selected node wraps around from Q4 -> Q1
    if (Math.abs((360 + newColorHSB[0] - prevColorHSB[0]) % 360) < Math.abs(hueDiff)) {
        hueDiff = (360 + newColorHSB[0] - prevColorHSB[0]) % 360;
    }

    // Handles when the selected node wraps around from Q1 -> Q4
    if (Math.abs((newColorHSB[0] - 360 - prevColorHSB[0]) % 360) < Math.abs(hueDiff)) {
        hueDiff = (newColorHSB[0] - 360 - prevColorHSB[0]) % 360;
    }

    return hueDiff;
}
