import React from "react";
import AccountPage from "../../../client/pages/AccountPage";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import "@testing-library/react";

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
});

describe("Tests for 'AccountPage' page", () => {
    test("Checks for text", () => {
        const wrapper = render(<BrowserRouter><AccountPage /></BrowserRouter>);
        expect(wrapper.baseElement.outerHTML).toContain(`This page is "/account" (the account management page).`);
    });
});
