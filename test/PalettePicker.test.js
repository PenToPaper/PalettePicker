import React from "react";
import ReactDOM from "react-dom";
import App from "../src/App";
import { shallow } from "enzyme";

it("renders without crashing", () => {
    expect(1).toEqual(1);
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);

    const wrapper = shallow(<App />);
    expect(wrapper.find("header")).toHaveLength(1);
});
