import React from "react";
import PostPage from "../../../client/pages/PostPage";
import { render } from "@testing-library/react";
import Router from "react-router-dom";
import "@testing-library/jest-dom";
import "@testing-library/react";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn()
}));

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
});

describe("Tests for 'PostPage' page", () => {
    test("Checks for text", () => {
        jest.spyOn(Router, "useParams").mockReturnValue({ id: 999 });

        const wrapper = render(<Router.BrowserRouter><PostPage /></Router.BrowserRouter>);
        expect(wrapper.baseElement.outerHTML).toContain(`This page is "/post/999" (the individual post page).`);
    });
});
