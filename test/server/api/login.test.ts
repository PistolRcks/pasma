// FIXME: For the time being, these tests *still* don't work. Gotta work on that...
import supertest from "supertest";
import { app } from "../../../server/main";
import { db } from "../../../server/database";
import { DBGetType, PBKDF2SyncType } from "../../utils/types";
import crypto from "crypto";

jest.mock("crypto", () => {
    return {
        ...jest.requireActual("crypto"),

        // Output what we put in instead of actually hashing
        pbkdf2Sync: jest.fn(() => {
            (password: crypto.BinaryLike, salt: crypto.BinaryLike, iterations: number, keylen: number, digest: string): Buffer => {
                if (typeof password === 'string') {
                    return Buffer.from(password);
                } else {
                    return Buffer.from("something");
                }
            }
        })
    }
});
jest.mock("../../../server/database");

const req = supertest(app);

// block console logging so it doesn't get annoying
beforeAll(() => {
    //jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();

})

describe("Tests for the /api/login endpoint", () => {
    // Create dummy user 
    test("200 - Normal Login", async () => {
        db.get = jest.fn((stmt, callback) => {
            // @ts-ignore
            callback(null, { Username: "username", Salt: "blah", Password: Buffer.from("password").toString("hex") });
        }) as jest.MockedFunction<DBGetType>;

        // Send a request to the /api/login endpoint
        const response = await req
            .post("/api/login")
            .send({ username: "username", password: "password" });

        console.log("test: " + response.text)
        expect(response.status).toBe(200);
    });

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
            callback(null, {});
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
            callback(null, {});
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
});
