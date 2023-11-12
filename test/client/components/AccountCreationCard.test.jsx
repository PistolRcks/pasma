import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import AccountCreationCard from "../../../client/components/AccountCreationCard"

beforeAll(() => {
    jest.spyOn(window, "alert").mockImplementation()
    jest.spyOn(console, "log").mockImplementation()
    jest.spyOn(console, "error").mockImplementation()
});

describe("Tests for <AccountCreationCard/>", () => {
    test("Initial render", () => {
        const component = render(<AccountCreationCard/>)
        expect(document.body).toBe(component.baseElement)
    })

    test("Create a New Account (Success)", async () => {
        const component = render(<AccountCreationCard/>)
        await fireEvent.click(component.getByTestId("open-modal-button"))
        /*
        const newAccount = {
            username: "werd",
            password: "generated-password-123",
            email: "werd@werd.com",
            userType: "standard",
            profilePicture: "profile_pictures/JaredD-2023.png"
        }
        */
        await fireEvent.change(component.getByLabelText("Username"), {target: {value: 'werd'}})
        await fireEvent.change(component.getByLabelText("Email Address"), {target: {value: 'werd@werd.com'}})

        await fireEvent.click(component.getByLabelText("Password"))
        expect(component.getByLabelText("Password").value).toBe("generated-password-123") // TODO: Change when password selection implemented

        await fireEvent.click(component.getByTestId("create-account-button"))

        expect(window.alert).toHaveBeenCalledWith("Your account was created successfully.") //! Why doesn't this work?

        // TODO: Click button and get response?
    })

    test("Show/Hide AccountCreationCard Modal", async () => {
        const component = render(<AccountCreationCard/>)

        await fireEvent.click(component.getByTestId("open-modal-button"))

        expect(component.getByTestId("create-account-modal")).not.toBeNull()

        // TODO: Find a way to access the close button so it can be tested
    })
})
