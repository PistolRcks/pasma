import supertest from "supertest";
import crypto from "crypto";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBGetType } from "../../utils/types";
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
    beforeEach(() => {
        db.get = jest.fn();
    });

    // Create dummy user 
    test("200 - Normal Login", async () => {
        db.get = jest.fn((stmt, callback) => {
            // @ts-ignore
            callback(null, { 
                Username: "username", 
                Salt: "blah", 
                Password: Buffer.from("password").toString("hex"), 
                ProfilePicture: "picture.jpeg",
                UserType: "standard"
            });
        }) as jest.MockedFunction<DBGetType>;
        
        let session = { username: "alice" };
        let token = addSession(session)

        const responseChangePassword = await req
            .post("/api/changePassword")
            .send({ token: token, oldPassword: "password", newPassword: "new-password-21" });

        expect(responseChangePassword.status).toBe(200);
        expect(responseChangePassword.text).toBe("OK");
    });

    /*
    test("400 - Request malformed", async () => {
        const response = await req
            .post("/api/login")
            .send({}); // Empty request body, which should trigger a 400 response

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: \"username\" and/or \"password\" not in request JSON.")
    });

    test("401 - Username doesn't exist", async () => {
        db.get = jest.fn((stmt, callback) => {
            // @ts-ignore
            callback(null, null);
        }) as jest.MockedFunction<DBGetType>;
        
        const response = await req
            .post("/api/login")
            .send({ username: "nonexistent", password: "password" });

        expect(response.status).toBe(401);
        expect(response.text).toBe("Error: Username or password does not exist.")
    });

    test("401 - Password isn't valid", async () => {
        db.get = jest.fn((stmt, callback) => {
            // @ts-ignore
            callback(null, null);
        }) as jest.MockedFunction<DBGetType>;

        const response = await req
            .post("/api/login")
            .send({ username: "username", password: "password" });

        expect(response.status).toBe(401);
        expect(response.text).toBe("Error: Username or password does not exist.")
    });

    test("500 - SQL error", async () => {
        db.get = jest.fn((stmt, callback) => {
            // @ts-ignore
            callback(new Error("Database Error"), null);
        }) as jest.MockedFunction<DBGetType>;
        
        const response = await req
            .post("/api/login")
            .send({ username: "username", password: "password" });

        expect(response.status).toBe(500);
        expect(response.text).toBe("Server Error: Error: Database Error")
    });
    */
});
