import React from "react";
import PostCard from "../../../client/components/PostCard";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import "@testing-library/react";

jest.mock('../../../client/dataHelper.js');

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
});

describe("Tests for 'PostFeedPage' page", () => {
    test("Checks that renders", () => {
        const wrapper = render(<BrowserRouter><PostCard /></BrowserRouter>);
        expect(wrapper.baseElement.outerHTML).toContain("<No User>");
    });
});
