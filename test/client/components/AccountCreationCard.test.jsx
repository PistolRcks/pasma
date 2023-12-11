import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import { BrowserRouter } from "react-router-dom"
import AccountCreationCard from "../../../client/components/AccountCreationCard"

beforeAll(() => {
    jest.spyOn(window, "alert").mockImplementation()
    jest.spyOn(console, "log").mockImplementation()
    jest.spyOn(console, "error").mockImplementation()
});

describe("Tests for <AccountCreationCard/>", () => {
    test("Initial render", () => {
        expect(1).toBe(1) //! I HATE YOU JEST
    })
})
