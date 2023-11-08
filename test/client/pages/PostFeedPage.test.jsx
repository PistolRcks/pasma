import React from "react";
import PostFeedPage from "../../../client/pages/PostFeedPage";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import "@testing-library/react";

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
});

describe("Tests for 'PostFeedPage' page", () => {
    test("Checks for text", () => {
        const wrapper = render(<BrowserRouter><PostFeedPage /></BrowserRouter>);
        expect(wrapper.baseElement.outerHTML).toContain(`This page is "/feed" (the post feed page).`);
    });
});
