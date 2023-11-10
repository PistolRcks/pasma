import React from 'react';
import { render, screen, fireEvent, getByText, getByLabelText, getByTitle, getByPlaceholderText } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChangePassword from '../../../client/components/ChangePassword.jsx';
import * as dataHelper from '../../../client/dataHelper.js';
import Cookies from 'js-cookie';
import '@testing-library/jest-dom';
import '@testing-library/react';
jest.mock('../../../client/dataHelper.js')

const mockPasswordUpdate = jest.fn((token, oldPass, newPass) => {
    return "OK"
})


describe("Tests for Change Password", () => {

    test("Checks for Change Password button", () => {
        const wrapper = render(<BrowserRouter><ChangePassword /></BrowserRouter>);
        expect(wrapper.baseElement.outerHTML).toContain(
            "Change Password"
      );
    });

    test("Checks for Old Password field", () => {
        const wrapper = render(<BrowserRouter><ChangePassword /></BrowserRouter>);
        fireEvent.click(getByText(wrapper.baseElement, "Change Password"))
        const inputElement = getByPlaceholderText(wrapper.baseElement, 'Old Password');
        fireEvent.change(inputElement, { target: { value: 'myOldPassword' } });
        expect(inputElement.value).toBe('myOldPassword');
    });

    test("Checks for New Password and confirm password", () => {
        const wrapper = render(<BrowserRouter><ChangePassword /></BrowserRouter>);
        fireEvent.click(getByText(wrapper.baseElement, "Change Password"))
        
        // Generates a password
        fireEvent.click(getByText(wrapper.baseElement, "Generate New Password"))
        const generatedPasswordElement = getByLabelText(wrapper.baseElement, 'New Password');
        const generatedPassword = generatedPasswordElement.value

        const inputElement = getByPlaceholderText(wrapper.baseElement, 'Confirm Password')

        // Checks if passwords match
        fireEvent.change(inputElement, { target: { value: generatedPassword } });
        expect(inputElement.value).toBe(generatedPassword);

        // Checks if passwords don't match
        fireEvent.change(inputElement, { target: { value: 'wrongpassword' } });
        expect(inputElement.value).toBe('wrongpassword');
    });

    test("Checks Submit", () => {
        window.alert = () => {};
        dataHelper.sendUpdatedPassword = mockPasswordUpdate
        Cookies.set('token', 'aTokenValue', { expires: 1 });
        

        const wrapper = render(<BrowserRouter><ChangePassword /></BrowserRouter>);
        fireEvent.click(getByText(wrapper.baseElement, "Change Password"))

        // Generates a password
        fireEvent.click(getByText(wrapper.baseElement, "Generate New Password"))
        const generatedPasswordElement = getByLabelText(wrapper.baseElement, 'New Password');
        const generatedPassword = generatedPasswordElement.value
        const inputElement = getByPlaceholderText(wrapper.baseElement, 'Confirm Password')
        fireEvent.change(inputElement, { target: { value: generatedPassword } });

        fireEvent.click(getByTitle(wrapper.baseElement, "changePasswordButton"))
        
    });

  });
