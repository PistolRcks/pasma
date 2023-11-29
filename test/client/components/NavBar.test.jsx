import React from 'react';
import { render, screen, fireEvent, getByText, getByLabelText, getByTitle, getByPlaceholderText, getByAltText, getByTestId } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '../../../client/components/NavBar.jsx';
import * as dataHelper from '../../../client/dataHelper.js';
import Cookies from 'js-cookie';
import '@testing-library/jest-dom';
import '@testing-library/react';
jest.mock('../../../client/dataHelper.js')

const mockLogOut = jest.fn((token) => {
    return("OK")
})

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
})

describe("Tests for Nav Bar", () => {

    beforeEach(() => {
        jest.spyOn(dataHelper, "logOut").mockImplementation(mockLogOut);
    });

    test("Checks that Nav Bar component renders", () => {
        const wrapper = render(<BrowserRouter><NavBar /></BrowserRouter>);
        expect(wrapper.baseElement.outerHTML).toContain("/pictures/logos/pasmaSquare.png");
        expect(wrapper.baseElement.outerHTML).toContain("navbar");
    });

    test("Checks Log Out", () => {
        window.alert = () => {};
        Cookies.set('token', 'testtoken123', { expires: 1 });
        
        const wrapper = render(<BrowserRouter><NavBar /></BrowserRouter>);
        fireEvent.click(getByTestId(wrapper.baseElement, "navBarProfilePicture"))
        fireEvent.click(getByText(wrapper.baseElement, "Log Out"))

        expect(mockLogOut).toHaveBeenCalledTimes(1)
    });

  });
