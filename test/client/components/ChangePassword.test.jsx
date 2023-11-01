import React from 'react';
import { render, screen, fireEvent, getByText } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChangePassword } from '../../../client/components/ChangePassword.jsx';
import '@testing-library/jest-dom';
import '@testing-library/react';

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
        expect(wrapper.baseElement.outerHTML).toContain(
            'label="Old Password"'
      );
    });

    test("Checks for New Password field", () => {
        const wrapper = render(<BrowserRouter><ChangePassword /></BrowserRouter>);
        fireEvent.click(getByText(wrapper.baseElement, "Change Password"))
        expect(wrapper.baseElement.outerHTML).toContain(
            'label="New Password"'
      );
    });

    test("Checks for Confirm Password field", () => {
        const wrapper = render(<BrowserRouter><ChangePassword /></BrowserRouter>);
        fireEvent.click(getByText(wrapper.baseElement, "Change Password"))
        expect(wrapper.baseElement.outerHTML).toContain(
            'label="Confirm Password"'
      );
    });

    test("Checks Submit", () => {
        const wrapper = render(<BrowserRouter><ChangePassword /></BrowserRouter>);
        fireEvent.click(getByText(wrapper.baseElement, "Change Password"))
        fireEvent.click(getByText(wrapper.baseElement, "Update"))
        expect(wrapper.baseElement.outerHTML).toContain(
            'label="Confirm Password"'
      );
    });

  });
