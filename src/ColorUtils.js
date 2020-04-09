import convert from "color-convert";

export default function getColorDataFromHex(hex, colorMode) {
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
