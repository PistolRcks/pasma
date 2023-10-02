import { expect, test } from "bun:test";
import { User, isUser } from "../../server/database.ts";

// fakeUser has the field "fakeName" instead of "Username", meaning isUser should return false.
let fakeUser = {
    fakeName: "bob",
    Password: "securepassword",
    Salt: "123abc",
    ProfilePicture: "data"
}

// realUser has all the necessary fields for a User and should return true from isUser.
let realUser = {
    Username: "bob",
    Password: "securepassword",
    Salt: "123abc",
    ProfilePicture: "data"
}

// making sure our isUser function can identify an incorrect field.
test("Check fake user", () => {
    expect(isUser(fakeUser)).toBe(false);
});

// making sure our isUser function can correctly identify all matching fields.
test("Check real user", () => {
    expect(isUser(realUser)).toBe(true);
});
