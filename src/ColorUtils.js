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

export function getColorRotated(colorHex, degreeClockwise) {
    let hsl = convert.hex.hsl(colorHex);
    hsl[0] = hsl[0] + degreeClockwise;
    return convert.hsl.hex(hsl);
}

export function getComplementaryColorFromHex(hex, colorMode = "HSB") {
    let hsbColorData = convert.hex.hsv.raw(hex);
    hsbColorData[0] = (hsbColorData[0] + 180) % 360;
    const newColorHex = convert.hsv.hex(hsbColorData);

    let colorData = hsbColorData;
    if (colorMode !== "HSB") {
        colorData = getColorDataFromHex(newColorHex, colorMode);
    }

    return { hex: "#" + newColorHex, colorData: colorData };
}

export function getComplementaryColorFromColorData(colorData, colorMode = "HSB") {
    let convertedColorData;

    // ["HSB", "HSL", "RGB", "CMYK"]
    switch (colorMode) {
        case "HSB":
            convertedColorData = colorData.concat();
            break;
        case "HSL":
            convertedColorData = convert.hsl.hsv(colorData);
            break;
        case "RGB":
            convertedColorData = convert.rgb.hsv(colorData);
            break;
        case "CMYK":
            convertedColorData = convert.cmyk.hsv(colorData);
            break;
    }

    convertedColorData[0] = (convertedColorData[0] + 180) % 360;

    const newColorHex = convert.hsv.hex(convertedColorData);

    let newColorData = convertedColorData;
    if (colorMode !== "HSB") {
        newColorData = getColorDataFromHex(newColorHex);
    }

    return { hex: "#" + newColorHex, colorData: newColorData };
}

export function getHSBComplementaryColor(color, colorMode) {
    let complementaryColor;
    if (colorMode === "HSB") {
        complementaryColor = getComplementaryColorFromColorData(color.colorData, colorMode);
    } else {
        complementaryColor = getComplementaryColorFromHex(color.hex, colorMode);
    }
    return complementaryColor;
}
