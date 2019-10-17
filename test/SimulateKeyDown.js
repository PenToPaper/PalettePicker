import { act } from "react-dom/test-utils";

export default function simulateKeyDown(wrapper, elementName, key) {
    let keyCode = 0;
    switch (key) {
        case "enter":
            keyCode = 13;
            break;
        case "end":
            keyCode = 35;
            break;
        case "home":
            keyCode = 36;
            break;
        case "arrow_down":
            keyCode = 40;
            break;
        case "arrow_up":
            keyCode = 38;
            break;
        case "arrow_left":
            keyCode = 37;
            break;
        case "arrow_right":
            keyCode = 39;
            break;
        case "page_up":
            keyCode = 33;
            break;
        case "page_down":
            keyCode = 34;
            break;
        case "escape":
            keyCode = 27;
            break;
        case "t":
            keyCode = 84;
            break;
    }
    act(() => {
        wrapper.find(elementName).simulate("keydown", { keyCode, key });
    });
}
