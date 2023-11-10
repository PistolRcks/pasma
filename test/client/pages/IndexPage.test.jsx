import React from "react";
import IndexPage from "../../../client/pages/IndexPage";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import "@testing-library/react";

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
});

describe("Tests for 'IndexPage' page", () => {
    test("Checks for text", () => {
        const wrapper = render(<BrowserRouter><IndexPage /></BrowserRouter>);
        expect(wrapper.baseElement.outerHTML).toContain("This page is \"/\" (the index page).");
    });
});
