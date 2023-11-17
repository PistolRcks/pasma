import React from 'react';
import { render, screen, fireEvent, getByText, getByLabelText, getByTitle, getByPlaceholderText } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '../../../client/components/NavBar.jsx';
import Cookies from 'js-cookie';
import '@testing-library/jest-dom';
import '@testing-library/react';

describe("Tests for Nav Bar", () => {

    test("Checks that Nav Bar component renders", () => {
        const wrapper = render(<BrowserRouter><NavBar /></BrowserRouter>);
        expect(wrapper.baseElement.outerHTML).toContain("/pictures/logos/pasmaSquare.png");
        expect(wrapper.baseElement.outerHTML).toContain("navbar");
    });

  });
