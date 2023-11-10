import React from 'react';
import ProfilePicture from '../../../client/components/ProfilePicture.jsx';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/react';


beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
});

describe("Tests for Profile Picture", () => {
  test("Checks for Profile Picture", () => {
    const wrapper = render(<ProfilePicture username="test" size="md" />);
    expect(wrapper.baseElement.outerHTML).toContain(
      "test"
    );
  });
});
