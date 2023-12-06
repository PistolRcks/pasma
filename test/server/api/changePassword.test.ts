import supertest from "supertest";
import crypto from "crypto";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBGetType, DBGetTypeWithParams, DBRunTypeWithCallback } from "../../utils/types";
import { isSession, addSession } from "../../../server/types/Session";

jest.mock("crypto", () => {
    return {
        ...jest.requireActual("crypto"),

        // Output what we put in instead of actually hashing
        pbkdf2Sync: jest.fn(
            (password: crypto.BinaryLike, salt: crypto.BinaryLike, iterations: number, keylen: number, digest: string): Buffer => {
                if (typeof password === 'string') {
                    return Buffer.from(password);
                } else {
                    return Buffer.from("something");
                }
            })
    }
});

jest.mock("../../../server/database");

const req = supertest(app);

// block console logging so it doesn't get annoying
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
});

describe("Tests for the /api/changePassword endpoint", () => {
    let token: string;
    beforeEach(() => {
        token = addSession({ username: "alice" })
        db.get = jest.fn((stmt, params, callback) => {
            // @ts-ignore
            callback(null, { 
                Username: "username", 
                Salt: "blah", 
                Password: Buffer.from("password").toString("hex"), 
                ProfilePicture: "picture.jpeg",
                UserType: "standard"
            });
        }) as jest.MockedFunction<DBGetTypeWithParams>;
        db.run = jest.fn((stmt, params, callback) => {
            // @ts-ignore
            callback(null);
        }) as jest.MockedFunction<DBRunTypeWithCallback>;
    });

    // Create dummy user 
    test("200 - Normal Login", async () => {
        const responseChangePassword = await req
            .post("/api/changePassword")
            .send({ token: token, oldPassword: "password", newPassword: "new-password-21" });

        expect(responseChangePassword.status).toBe(200);
        expect(responseChangePassword.text).toBe("OK");
    });

    test("400 - Missing token", async () => {

        const response = await req
            .post("/api/changePassword")
            .send({
                "oldPassword": "doesnt_matter",
                "newPassword": "really_doesnt_matter"
            }); // Empty request body, which should trigger a 400 response

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: \"token\" not in request JSON.")
    });

    test("400 - Missing oldPassword", async () => {

        const response = await req
            .post("/api/changePassword")
            .send({
                "token": token,
                "newPassword": "really_doesnt_matter"
            }); // Empty request body, which should trigger a 400 response

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: \"oldPassword\" not in request JSON.")
    });

    test("400 - Missing newPassword", async () => {

        const response = await req
            .post("/api/changePassword")
            .send({
                "token": token,
                "oldPassword": "really_doesnt_matter"
            }); // Empty request body, which should trigger a 400 response

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: \"newPassword\" not in request JSON.")
    });

    test("401 - Invalid token", async () => {
        const response = await req
            .post("/api/changePassword")
            .send({
                "token": "randomstuff",
                "oldPassword": "doesnt_matter",
                "newPassword": "really_doesnt_matter"
            }); // Empty request body, which should trigger a 400 response

        expect(response.status).toBe(401);
        expect(response.text).toBe("Error: Invalid token provided.")
    });

    test("400 - Insecure password", async () => {
        const response = await req
            .post("/api/changePassword")
            .send({
                "token": token,
                "oldPassword": "doesnt_matter",
                "newPassword": "insecure"
            }); // Empty request body, which should trigger a 400 response

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: New password is insecure. It must have at least 12 characters, one digit, and one special character.")
    });
});
