import React from "react";
import Swatch, { RgbModifier, HsbModifier, HslModifier, CmykModifier, BufferedNumberInput } from "../src/Swatch";
import { shallow, mount } from "enzyme";
import simulateKeyDown from "./SimulateKeyDown";
import { act } from "react-dom/test-utils";

describe("Swatch renders default state correctly based on props", () => {
    const swatchWrapper = shallow(<Swatch selected={false} color={{ hex: "#663333", colorData: [0, 50, 40] }} onChange={() => {}} colorMode={"HSB"} />);

    it("Renders proper child elements", () => {
        // Swatch itself has aria-compatible attributes
        expect(swatchWrapper.find(".swatch").prop("tabIndex")).toEqual("0");
        expect(swatchWrapper.find(".swatch").prop("aria-selected")).toEqual(undefined);

        // h6
        expect(swatchWrapper.find("input")).toHaveLength(1);
        expect(swatchWrapper.find("input").prop("value")).toEqual("#663333");
    });

    it("Renders proper color values for hsb on load", () => {
        // Swatch modifier
        expect(swatchWrapper.find(".swatch-modifier")).toHaveLength(1);
        expect(swatchWrapper.find("HsbModifier")).toHaveLength(1);

        expect(swatchWrapper.find("HsbModifier").prop("color")).toEqual({ hex: "#663333", colorData: [0, 50, 40] });
        expect(typeof swatchWrapper.find("HsbModifier").prop("onChange")).toEqual("function");

        const hsbWrapper = shallow(<HsbModifier color={{ hex: "#663333", colorData: [0, 50, 40] }} onChange={() => {}} />);
        expect(hsbWrapper.find("Slider")).toHaveLength(3);
        expect(hsbWrapper.find({ wrapperClass: "hue-modifier" })).toHaveLength(1);
        expect(hsbWrapper.find({ wrapperClass: "saturation-modifier" })).toHaveLength(1);
        expect(hsbWrapper.find({ wrapperClass: "brightness-modifier" })).toHaveLength(1);

        // Displays correct hsb color code
        expect(hsbWrapper.find({ wrapperClass: "hue-modifier" }).prop("value")).toEqual(0);
        expect(hsbWrapper.find({ wrapperClass: "saturation-modifier" }).prop("value")).toEqual(50);
        expect(hsbWrapper.find({ wrapperClass: "brightness-modifier" }).prop("value")).toEqual(40);
    });

    it("Renders proper hsb slider gradients on load", () => {
        const hsbWrapper = shallow(<HsbModifier color={{ hex: "#663333", colorData: [0, 50, 40] }} onChange={() => {}} />);

        expect(hsbWrapper.find({ wrapperClass: "saturation-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #666666, #660000)");
        expect(hsbWrapper.find({ wrapperClass: "brightness-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #000000, #FF8080)");
    });

    it("Changes to aria-selected=true when selected prop changes", () => {
        // Swatch itself has aria-compatible attributes
        swatchWrapper.setProps({ selected: true });
        expect(swatchWrapper.find(".swatch").prop("aria-selected")).toEqual("true");
    });

    it("Renders proper color values for rgb", () => {
        swatchWrapper.setProps({ colorMode: "RGB", color: { hex: "#663333", colorData: [102, 51, 51] } });

        // Swatch modifier
        expect(swatchWrapper.find(".swatch-modifier")).toHaveLength(1);
        expect(swatchWrapper.find("RgbModifier")).toHaveLength(1);

        expect(swatchWrapper.find("RgbModifier").prop("color")).toEqual({ hex: "#663333", colorData: [102, 51, 51] });
        expect(typeof swatchWrapper.find("RgbModifier").prop("onChange")).toEqual("function");

        const rgbWrapper = shallow(<RgbModifier color={{ hex: "#663333", colorData: [102, 51, 51] }} onChange={() => {}} />);
        expect(rgbWrapper.find("Slider")).toHaveLength(3);
        expect(rgbWrapper.find({ wrapperClass: "red-modifier" })).toHaveLength(1);
        expect(rgbWrapper.find({ wrapperClass: "green-modifier" })).toHaveLength(1);
        expect(rgbWrapper.find({ wrapperClass: "blue-modifier" })).toHaveLength(1);

        // Displays correct hsb color code
        expect(rgbWrapper.find({ wrapperClass: "red-modifier" }).prop("value")).toEqual(102);
        expect(rgbWrapper.find({ wrapperClass: "green-modifier" }).prop("value")).toEqual(51);
        expect(rgbWrapper.find({ wrapperClass: "blue-modifier" }).prop("value")).toEqual(51);
    });

    it("Renders proper rgb slider gradients", () => {
        const hsbWrapper = shallow(<RgbModifier color={{ hex: "#663333", colorData: [102, 51, 51] }} onChange={() => {}} />);

        expect(hsbWrapper.find({ wrapperClass: "red-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #003333, #FF3333)");
        expect(hsbWrapper.find({ wrapperClass: "green-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #660033, #66FF33)");
        expect(hsbWrapper.find({ wrapperClass: "blue-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #663300, #6633FF)");
    });

    it("Renders proper color values for hsl", () => {
        swatchWrapper.setProps({ colorMode: "HSL", color: { hex: "#663333", colorData: [0, 33, 30] } });

        // Swatch modifier
        expect(swatchWrapper.find(".swatch-modifier")).toHaveLength(1);
        expect(swatchWrapper.find("HslModifier")).toHaveLength(1);

        expect(swatchWrapper.find("HslModifier").prop("color")).toEqual({ hex: "#663333", colorData: [0, 33, 30] });
        expect(typeof swatchWrapper.find("HslModifier").prop("onChange")).toEqual("function");

        const hslWrapper = shallow(<HslModifier color={{ hex: "#663333", colorData: [0, 33, 30] }} onChange={() => {}} />);
        expect(hslWrapper.find("Slider")).toHaveLength(3);
        expect(hslWrapper.find({ wrapperClass: "hue-modifier" })).toHaveLength(1);
        expect(hslWrapper.find({ wrapperClass: "saturation-modifier" })).toHaveLength(1);
        expect(hslWrapper.find({ wrapperClass: "lightness-modifier" })).toHaveLength(1);

        // Displays correct hsb color code
        expect(hslWrapper.find({ wrapperClass: "hue-modifier" }).prop("value")).toEqual(0);
        expect(hslWrapper.find({ wrapperClass: "saturation-modifier" }).prop("value")).toEqual(33);
        expect(hslWrapper.find({ wrapperClass: "lightness-modifier" }).prop("value")).toEqual(30);
    });

    it("Renders proper hsl slider gradients", () => {
        const hsbWrapper = shallow(<HslModifier color={{ hex: "#663333", colorData: [0, 33, 30] }} onChange={() => {}} />);

        expect(hsbWrapper.find({ wrapperClass: "saturation-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #4D4D4D, #990000)");
        expect(hsbWrapper.find({ wrapperClass: "lightness-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #000000, #AA5555, #FFFFFF)");
    });

    it("Renders proper color values for cmyk", () => {
        swatchWrapper.setProps({ colorMode: "CMYK", color: { hex: "#663333", colorData: [0, 20, 20, 60] } });

        // Swatch modifier
        expect(swatchWrapper.find(".swatch-modifier")).toHaveLength(1);
        expect(swatchWrapper.find("CmykModifier")).toHaveLength(1);

        expect(swatchWrapper.find("CmykModifier").prop("color")).toEqual({ hex: "#663333", colorData: [0, 20, 20, 60] });
        expect(typeof swatchWrapper.find("CmykModifier").prop("onChange")).toEqual("function");

        const cmykWrapper = shallow(<CmykModifier color={{ hex: "#663333", colorData: [0, 20, 20, 60] }} onChange={() => {}} />);
        expect(cmykWrapper.find("Slider")).toHaveLength(4);
        expect(cmykWrapper.find({ wrapperClass: "cyan-modifier" })).toHaveLength(1);
        expect(cmykWrapper.find({ wrapperClass: "magenta-modifier" })).toHaveLength(1);
        expect(cmykWrapper.find({ wrapperClass: "yellow-modifier" })).toHaveLength(1);
        expect(cmykWrapper.find({ wrapperClass: "key-modifier" })).toHaveLength(1);

        // Displays correct hsb color code
        expect(cmykWrapper.find({ wrapperClass: "cyan-modifier" }).prop("value")).toEqual(0);
        expect(cmykWrapper.find({ wrapperClass: "magenta-modifier" }).prop("value")).toEqual(20);
        expect(cmykWrapper.find({ wrapperClass: "yellow-modifier" }).prop("value")).toEqual(20);
        expect(cmykWrapper.find({ wrapperClass: "key-modifier" }).prop("value")).toEqual(60);
    });

    it("Renders proper cmyk slider gradients", () => {
        const hsbWrapper = shallow(<CmykModifier color={{ hex: "#663333", colorData: [0, 50, 50, 60] }} onChange={() => {}} />);

        expect(hsbWrapper.find({ wrapperClass: "cyan-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #663333, #003333)");
        expect(hsbWrapper.find({ wrapperClass: "magenta-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #666633, #660033)");
        expect(hsbWrapper.find({ wrapperClass: "yellow-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #663366, #663300)");
        expect(hsbWrapper.find({ wrapperClass: "key-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #FF8080, #000000)");
    });
});

describe("Swatch changes color displayed and calls onColorChange callback when a slider is changed.", () => {
    // rgb = 102, 51, 51
    // hsb = 0, 50, 40
    let color = { hex: "#663333", colorData: [0, 50, 40] };
    const setColor = jest.fn((newColor) => {
        color = newColor;
    });
    const swatchWrapper = mount(<Swatch selected={true} color={color} onChange={setColor} colorMode={"HSB"} />);

    it("Properly recalculates hex color code based on hue slider change", () => {
        swatchWrapper.find(".hue-modifier .modifier-thumb").getDOMNode().focus();

        // increases hue by 10
        simulateKeyDown(swatchWrapper, ".hue-modifier .modifier-thumb", "page_up");

        swatchWrapper.update();

        expect(setColor).toHaveBeenCalled();
        expect(color).toEqual({ hex: "#663B33", colorData: [10, 50, 40] });

        swatchWrapper.setProps({ colorMode: "HSB", color });
        swatchWrapper.update();

        expect(swatchWrapper.find("input").at(0).prop("value")).toEqual("#663B33");
        // Would normally be 10, but there is no hex color to properly represent hsb(9, 0.5, 0.4)
        expect(swatchWrapper.find("input").at(1).prop("value")).toEqual("10");

        expect(swatchWrapper.find(".swatch").prop("style")).toHaveProperty("backgroundColor");
        expect(swatchWrapper.find(".swatch").prop("style").backgroundColor).toEqual("#663B33");
    });
});

describe("Swatch properly handles optional delete swatch functionality", () => {
    const swatchWrapper = mount(<Swatch selected={true} color={{ hex: "#663333", colorData: [0, 50, 40] }} onColorChange={() => {}} colorMode={"HSB"} />);

    it("Does not render the button if deleteButton is false or not present", () => {
        expect(swatchWrapper.find("button")).toHaveLength(0);
    });

    it("Does render the button if deleteButton is true", () => {
        const callback = jest.fn();

        swatchWrapper.setProps({ deleteButton: true, onDeleteSwatch: callback });

        // Delete swatch button appears
        expect(swatchWrapper.find("button")).toHaveLength(1);
        expect(swatchWrapper.find("button").prop("aria-label")).toEqual("Delete Swatch");

        // Delete swatch button is clickable
        const clickEvent = { stopPropagation: jest.fn() };
        swatchWrapper.find("button").prop("onClick")(clickEvent);

        expect(clickEvent.stopPropagation).toHaveBeenCalled();
        expect(callback).toHaveBeenCalled();
    });
});

describe("Swatch calls onSelect prop onClick and on focus-enter", () => {
    const callback = jest.fn();
    const swatchWrapper = mount(<Swatch selected={true} color={{ hex: "#663333", colorData: [0, 50, 40] }} onColorChange={() => {}} colorMode={"HSB"} onSelect={callback} />);

    it("Calls onSelect on click", () => {
        swatchWrapper.find(".swatch").prop("onClick")();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it("Calls onSelect on focus-enter", () => {
        swatchWrapper.find(".swatch").prop("onKeyDown")({ keyCode: 13, target: { classList: { contains: () => true } } });
        expect(callback).toHaveBeenCalledTimes(2);
        swatchWrapper.find(".swatch").prop("onKeyDown")({ keyCode: 13, target: { classList: { contains: () => false } } });
        expect(callback).toHaveBeenCalledTimes(2);
        swatchWrapper.find(".swatch").prop("onKeyDown")({ keyCode: 12, target: { classList: { contains: () => true } } });
        expect(callback).toHaveBeenCalledTimes(2);
    });
});

describe("Swatch hex modifier allows for direct hexcode modificiation", () => {
    let color = { hex: "#663333", colorData: [0, 50, 40] };
    const onChangeCallback = jest.fn((newColor) => {
        color = newColor;
        swatchWrapper.setProps({ color });
        swatchWrapper.update();
    });
    const swatchWrapper = mount(<Swatch selected={true} color={color} onColorChange={() => {}} colorMode={"HSB"} onSelect={() => {}} onChange={onChangeCallback} />);

    const getChangeObject = (string) => {
        return { target: { value: string } };
    };

    it("Input only allows valid hex characters", () => {
        // Valid hex characters, incomplete hex code
        act(() => {
            swatchWrapper.find("input").at(0).prop("onChange")(getChangeObject("#66331"));
        });
        swatchWrapper.update();
        expect(swatchWrapper.find("input").at(0).prop("value")).toEqual("#66331");

        // Invalid hex characters
        act(() => {
            swatchWrapper.find("input").at(0).prop("onChange")(getChangeObject("#66333Z"));
        });
        swatchWrapper.update();
        expect(swatchWrapper.find("input").at(0).prop("value")).toEqual("#66331");
    });

    it("Limits the length of the input to 6 characters", () => {
        act(() => {
            swatchWrapper.find("input").at(0).prop("onChange")(getChangeObject("#6633333"));
        });
        swatchWrapper.update();
        expect(swatchWrapper.find("input").at(0).prop("value")).toEqual("#66331");
    });

    it("Corrects text with upperCase and leading #", () => {
        // Uppercase
        act(() => {
            swatchWrapper.find("input").at(0).prop("onChange")(getChangeObject("#aaaBB"));
        });
        swatchWrapper.update();
        expect(swatchWrapper.find("input").at(0).prop("value")).toEqual("#AAABB");

        // Leading #
        act(() => {
            swatchWrapper.find("input").at(0).prop("onChange")(getChangeObject("BBBCC"));
        });
        swatchWrapper.update();
        expect(swatchWrapper.find("input").at(0).prop("value")).toEqual("#BBBCC");
    });

    it("When input reaches a valid 6-character hex code, calls callback with accurate new color", () => {
        act(() => {
            swatchWrapper.find("input").at(0).prop("onChange")(getChangeObject("#BBBCCC"));
        });
        swatchWrapper.update();
        expect(onChangeCallback).toHaveBeenLastCalledWith({ hex: "#BBBCCC", colorData: [236.47058823529403, 8.333333333333345, 80] });
        expect(swatchWrapper.find("HsbModifier").prop("color")).toEqual({ hex: "#BBBCCC", colorData: [236.47058823529403, 8.333333333333345, 80] });
        expect(swatchWrapper.find("input").at(0).prop("value")).toEqual("#BBBCCC");
    });

    it("If state changes while user is inputting, the new state overrides the user's input", () => {
        act(() => {
            swatchWrapper.find("input").at(0).prop("onChange")(getChangeObject("#CCC"));
        });
        swatchWrapper.update();

        expect(swatchWrapper.find("input").at(0).prop("value")).toEqual("#CCC");

        onChangeCallback({ hex: "#AAAAAA", colorData: [0, 0, 67] });

        expect(swatchWrapper.find("input").at(0).prop("value")).toEqual("#AAAAAA");
    });

    it("If focus leaves the input, the last valid hex code to occupy that swatch is re-added", () => {
        act(() => {
            swatchWrapper.find("input").at(0).prop("onChange")(getChangeObject("#CCC"));
        });
        swatchWrapper.update();

        expect(swatchWrapper.find("input").at(0).prop("value")).toEqual("#CCC");

        act(() => {
            swatchWrapper.find("input").at(0).prop("onBlur")();
        });
        swatchWrapper.update();

        expect(swatchWrapper.find("input").at(0).prop("value")).toEqual("#AAAAAA");
    });
});

describe("BufferedNumberInput is implemented properly", () => {
    let color = {
        hex: "#00A3A3",
        colorData: [179.79, 100, 64],
    };
    const onChange = jest.fn((newColor) => {
        color = newColor;
        inputWrapper.setProps({ color });
    });
    const inputWrapper = shallow(<BufferedNumberInput max={360} min={10} color={color} onChange={onChange} index={0} colorMode={"HSB"} className={"slider-input"} modifyingLabel={"hue"} />);
    const input = inputWrapper.find("input");

    it("Is constructed peoperly based on given props", () => {
        expect(input.prop("className")).toEqual("slider-input");
        expect(input.prop("type")).toEqual("text");
        expect(input.prop("inputMode")).toEqual("numeric");
        expect(input.prop("value")).toEqual("180");
        input.prop("onChange")({ target: { value: "180" } });
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(input.prop("aria-label")).toEqual("Modify this swatch's hue");
    });

    it("When editing with numbers between min and max, it properly fires onChange", () => {
        input.prop("onChange")({ target: { value: "200" } });
        expect(onChange).toHaveBeenCalledTimes(2);
        expect(onChange).toHaveBeenLastCalledWith({ hex: "#006DA3", colorData: [200, 100, 64] });
        input.prop("onChange")({ target: { value: "10" } });
        expect(onChange).toHaveBeenCalledTimes(3);
        expect(onChange).toHaveBeenLastCalledWith({ hex: "#A31B00", colorData: [10, 100, 64] });
        input.prop("onChange")({ target: { value: "360" } });
        expect(onChange).toHaveBeenCalledTimes(4);
        expect(onChange).toHaveBeenLastCalledWith({ hex: "#A30000", colorData: [360, 100, 64] });
    });

    it("When editing with numbers beyond min and max, it does not fire onChange", () => {
        input.prop("onChange")({ target: { value: "1000" } });
        expect(onChange).toHaveBeenCalledTimes(4);
        input.prop("onChange")({ target: { value: "9" } });
        expect(onChange).toHaveBeenCalledTimes(4);
    });

    it("Does not allow non-numeric characters", () => {
        // No numeric keys
        input.prop("onChange")({ target: { value: "!@#$%^&*()-_=+abc" } });
        expect(onChange).toHaveBeenCalledTimes(4);

        // Numeric mix
        input.prop("onChange")({ target: { value: "!@#$%^&*()-_=+abc123" } });
        expect(onChange).toHaveBeenCalledTimes(5);
        expect(onChange).toHaveBeenLastCalledWith({ hex: "#00A308", colorData: [123, 100, 64] });
    });

    it("Allows for the entire input to be deleted temporarily, does not fire onChange", () => {
        input.prop("onChange")({ target: { value: "" } });
        expect(onChange).toHaveBeenCalledTimes(5);
        expect(inputWrapper.find("input").prop("value")).toEqual("");
    });

    const inputWrapperMount = mount(<BufferedNumberInput max={360} min={10} color={color} onChange={onChange} index={0} colorMode={"HSB"} className={"slider-input"} modifyingLabel={"hue"} />);
    it("Clears blank input when props.color.colorData[index] is updated, then refreshes new value", () => {
        act(() => {
            inputWrapperMount.find("input").prop("onChange")({ target: { value: "" } });
        });
        inputWrapperMount.update();
        inputWrapperMount.setProps({ color: { hex: "#00B33C", colorData: [140, 100, 70] } });
        inputWrapperMount.update();
        expect(inputWrapperMount.find("input").prop("value")).toEqual("140");
    });

    it("Is given proper arguments in HsbModifier", () => {
        const onChange = jest.fn();
        const colorStart = {
            hex: "#00B33C",
            colorData: [140, 100, 70],
        };
        const hsbWrapper = shallow(<HsbModifier color={colorStart} onChange={onChange} />);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("max")).toEqual(360);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("max")).toEqual(100);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("max")).toEqual(100);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("min")).toEqual(0);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("min")).toEqual(0);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("min")).toEqual(0);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("color")).toEqual(colorStart);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("color")).toEqual(colorStart);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("color")).toEqual(colorStart);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("onChange")).toEqual(onChange);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("onChange")).toEqual(onChange);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("onChange")).toEqual(onChange);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("index")).toEqual(0);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("index")).toEqual(1);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("index")).toEqual(2);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("colorMode")).toEqual("HSB");
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("colorMode")).toEqual("HSB");
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("colorMode")).toEqual("HSB");

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("className")).toEqual("slider-input");
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("className")).toEqual("slider-input");
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("className")).toEqual("slider-input");

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("modifyingLabel")).toEqual("hue");
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("modifyingLabel")).toEqual("saturation");
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("modifyingLabel")).toEqual("brightness");
    });

    it("Is given proper arguments in RgbModifier", () => {
        const onChange = jest.fn();
        const colorStart = {
            hex: "#00B33C",
            colorData: [0, 179, 60],
        };
        const hsbWrapper = shallow(<RgbModifier color={colorStart} onChange={onChange} />);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("max")).toEqual(255);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("max")).toEqual(255);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("max")).toEqual(255);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("min")).toEqual(0);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("min")).toEqual(0);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("min")).toEqual(0);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("color")).toEqual(colorStart);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("color")).toEqual(colorStart);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("color")).toEqual(colorStart);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("onChange")).toEqual(onChange);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("onChange")).toEqual(onChange);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("onChange")).toEqual(onChange);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("index")).toEqual(0);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("index")).toEqual(1);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("index")).toEqual(2);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("colorMode")).toEqual("RGB");
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("colorMode")).toEqual("RGB");
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("colorMode")).toEqual("RGB");

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("className")).toEqual("slider-input");
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("className")).toEqual("slider-input");
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("className")).toEqual("slider-input");

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("modifyingLabel")).toEqual("red value");
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("modifyingLabel")).toEqual("green value");
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("modifyingLabel")).toEqual("blue value");
    });

    it("Is given proper arguments in HslModifier", () => {
        const onChange = jest.fn();
        const colorStart = {
            hex: "#00B33C",
            colorData: [140, 100, 35],
        };
        const hsbWrapper = shallow(<HslModifier color={colorStart} onChange={onChange} />);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("max")).toEqual(360);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("max")).toEqual(100);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("max")).toEqual(100);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("min")).toEqual(0);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("min")).toEqual(0);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("min")).toEqual(0);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("color")).toEqual(colorStart);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("color")).toEqual(colorStart);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("color")).toEqual(colorStart);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("onChange")).toEqual(onChange);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("onChange")).toEqual(onChange);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("onChange")).toEqual(onChange);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("index")).toEqual(0);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("index")).toEqual(1);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("index")).toEqual(2);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("colorMode")).toEqual("HSL");
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("colorMode")).toEqual("HSL");
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("colorMode")).toEqual("HSL");

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("className")).toEqual("slider-input");
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("className")).toEqual("slider-input");
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("className")).toEqual("slider-input");

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("modifyingLabel")).toEqual("hue");
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("modifyingLabel")).toEqual("saturation");
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("modifyingLabel")).toEqual("lightness");
    });

    it("Is given proper arguments in CmykModifier", () => {
        const onChange = jest.fn();
        const colorStart = {
            hex: "#00B33C",
            colorData: [70, 0, 47, 30],
        };
        const hsbWrapper = shallow(<CmykModifier color={colorStart} onChange={onChange} />);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("max")).toEqual(100);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("max")).toEqual(100);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("max")).toEqual(100);
        expect(hsbWrapper.find(BufferedNumberInput).at(3).prop("max")).toEqual(100);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("min")).toEqual(0);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("min")).toEqual(0);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("min")).toEqual(0);
        expect(hsbWrapper.find(BufferedNumberInput).at(3).prop("min")).toEqual(0);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("color")).toEqual(colorStart);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("color")).toEqual(colorStart);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("color")).toEqual(colorStart);
        expect(hsbWrapper.find(BufferedNumberInput).at(3).prop("color")).toEqual(colorStart);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("onChange")).toEqual(onChange);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("onChange")).toEqual(onChange);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("onChange")).toEqual(onChange);
        expect(hsbWrapper.find(BufferedNumberInput).at(3).prop("onChange")).toEqual(onChange);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("index")).toEqual(0);
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("index")).toEqual(1);
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("index")).toEqual(2);
        expect(hsbWrapper.find(BufferedNumberInput).at(3).prop("index")).toEqual(3);

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("colorMode")).toEqual("CMYK");
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("colorMode")).toEqual("CMYK");
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("colorMode")).toEqual("CMYK");
        expect(hsbWrapper.find(BufferedNumberInput).at(3).prop("colorMode")).toEqual("CMYK");

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("className")).toEqual("slider-input");
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("className")).toEqual("slider-input");
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("className")).toEqual("slider-input");
        expect(hsbWrapper.find(BufferedNumberInput).at(3).prop("className")).toEqual("slider-input");

        expect(hsbWrapper.find(BufferedNumberInput).at(0).prop("modifyingLabel")).toEqual("cyan value");
        expect(hsbWrapper.find(BufferedNumberInput).at(1).prop("modifyingLabel")).toEqual("magenta value");
        expect(hsbWrapper.find(BufferedNumberInput).at(2).prop("modifyingLabel")).toEqual("yellow value");
        expect(hsbWrapper.find(BufferedNumberInput).at(3).prop("modifyingLabel")).toEqual("key value");
    });
});
