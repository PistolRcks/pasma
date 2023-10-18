import React from 'react';
import { ProfilePicture } from '../../../client/components/ProfilePicture.jsx';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import '@testing-library/react';


// jest.mock('../../../client/dataHelper.js')

describe("Tests for Profile Picture", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });
  /*
  test("Loads and Displays Landing Page", async () => {
    render(<BrowserRouter><GoogleOAuthProvider><LandingPage url="/" /></GoogleOAuthProvider></BrowserRouter>);
    const landingPage = screen.getByTestId("landing-1");
    expect(landingPage).toBeInTheDocument();
  });
  */
  test("Checks for Profile Picture", () => {
    const wrapper = render(<BrowserRouter><ProfilePicture username="test" size="md" /></BrowserRouter>);
    expect(wrapper.baseElement.outerHTML).toContain(
      "test"
    );
  });
  /*
  test("Checks for Log In Button", () => {
    const wrapper = render(<BrowserRouter><GoogleOAuthProvider><LandingPage /></GoogleOAuthProvider></BrowserRouter>);
    expect(wrapper.baseElement.outerHTML).toContain("Log In");
  });
  */
});
