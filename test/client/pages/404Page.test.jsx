import React from "react";
import FourOhFourPage from "../../../client/pages/404Page";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import "@testing-library/react";

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
});

describe("Tests for 'FourOhFourPage' page", () => {
    test("Checks for text", () => {
        const wrapper = render(<BrowserRouter><FourOhFourPage /></BrowserRouter>);
        expect(wrapper.baseElement.outerHTML).toContain("404!");
        expect(wrapper.getByRole("link")).toBeInTheDocument();
    });
});
