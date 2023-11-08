import React from "react";
import ProfilePage from "../../../client/pages/ProfilePage";
import { render } from "@testing-library/react";
import Router from "react-router-dom";
import "@testing-library/jest-dom";
import "@testing-library/react";

// Solution for the "is read only" error
// You just have to mock it once and then spy every case you use it in 
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn()
}));

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
});

describe("Tests for 'ProfilePage' page", () => {
    test("Checks for text", () => {
        jest.spyOn(Router, "useParams").mockReturnValue({ username: "alice" });
        
        const wrapper = render(<Router.BrowserRouter><ProfilePage /></Router.BrowserRouter>);
        expect(wrapper.baseElement.outerHTML).toContain(`This page is "/profile/alice" (the user profile page).`);
    });
});
