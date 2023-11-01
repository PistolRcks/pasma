import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
  });
