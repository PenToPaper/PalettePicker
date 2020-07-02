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

function getColorDataFromHSB(hsbColorData, colorMode) {
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
        const absDiff = Math.abs(getAbsoluteHueDiff(colorOne, colorTwo));
        if ((colorOne[0] + absDiff) % 360 === colorTwo[0]) {
            return [(colorOne[0] + absDiff / 2) % 360, colorOne[1], colorOne[2]];
        }
        return [(colorTwo[0] + absDiff / 2) % 360, colorOne[1], colorOne[2]];
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

export function getRectangleColor(rotation, arcOne, arcTwo, saturation, brightness, colorMode = "HSB") {
    const indexOne = getColorRotatedHSB([90, saturation, brightness], rotation - arcOne / 2);
    const indexTwo = getColorRotatedHSB(indexOne, arcOne);
    const indexThree = getColorRotatedHSB(indexOne, arcOne + arcTwo);
    const indexFour = getColorRotatedHSB(indexOne, -arcTwo);

    return {
        "1": { hex: "#" + convert.hsv.hex(indexOne), colorData: getColorDataFromHSB(indexOne, colorMode) },
        "2": { hex: "#" + convert.hsv.hex(indexTwo), colorData: getColorDataFromHSB(indexTwo, colorMode) },
        "3": { hex: "#" + convert.hsv.hex(indexThree), colorData: getColorDataFromHSB(indexThree, colorMode) },
        "4": { hex: "#" + convert.hsv.hex(indexFour), colorData: getColorDataFromHSB(indexFour, colorMode) },
    };
}

// From https://www.w3.org/TR/WCAG20-TECHS/G18.html
export function getWCAGContrast(colorOne, colorTwo, colorMode) {
    const getRgbFromHex = (color, colorMode) => {
        if (colorMode === "RGB") {
            return color.colorData;
        }
        return getColorDataFromHex(color.hex, "RGB");
    };

    const getWCAGValueRGB = (sRGB) => {
        const rgbRatio = sRGB / 255;
        let r;
        if (rgbRatio <= 0.03928) {
            r = rgbRatio / 12.92;
        } else {
            r = Math.pow((rgbRatio + 0.055) / 1.055, 2.4);
        }
        return r;
    };

    const rgbColorOne = getRgbFromHex(colorOne, colorMode);
    const rgbColorTwo = getRgbFromHex(colorTwo, colorMode);

    const rgbWcagOne = [getWCAGValueRGB(rgbColorOne[0]), getWCAGValueRGB(rgbColorOne[1]), getWCAGValueRGB(rgbColorOne[2])];
    const rgbWcagTwo = [getWCAGValueRGB(rgbColorTwo[0]), getWCAGValueRGB(rgbColorTwo[1]), getWCAGValueRGB(rgbColorTwo[2])];

    const L1 = 0.2126 * rgbWcagOne[0] + 0.7152 * rgbWcagOne[1] + 0.0722 * rgbWcagOne[2];
    const L2 = 0.2126 * rgbWcagTwo[0] + 0.7152 * rgbWcagTwo[1] + 0.0722 * rgbWcagTwo[2];

    if (L1 > L2) {
        return (L1 + 0.05) / (L2 + 0.05);
    } else {
        return (L2 + 0.05) / (L1 + 0.05);
    }
}

export function isValidHex(hex) {
    return hex.search(/^#?[0-9A-F]{6}$/i) !== -1;
}

export function hsbReplaceValue(hsbArray, index, newValue) {
    const newArray = hsbArray.concat();
    newArray[index] = newValue;
    return newArray;
}
