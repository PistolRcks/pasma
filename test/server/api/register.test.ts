import supertest from "supertest";
import crypto from "crypto";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBGetType, DBRunTypeWithCallback } from "../../utils/types";

jest.mock("crypto", () => {
    return {
        ...jest.requireActual("crypto"),
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

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();

})

describe("Tests for the /api/register endpoint", () => {
    const endpoint = "/api/register";
    const goodPassword = "Password123$$$";
    const badPassword = "password";


    beforeEach(() => {
        db.get = jest.fn();
        db.run = jest.fn();
    });
    
    // 200 - Standard execution
    test("200 - Normal Registration", async () => {
        db.get = jest.fn((stmt, callback) => {
            // @ts-ignore
            callback(null, null);
        }) as jest.MockedFunction<DBGetType>;
        
        db.run = jest.fn((stmt, params, callback) => {
            // @ts-ignore
            callback(null);
        }) as jest.MockedFunction<DBRunTypeWithCallback>;
        
        // Send a request to the /api/login endpoint
        const response = await req
            .post(endpoint)
            .send({ username: "username", password: goodPassword });

        expect(response.status).toBe(200);
        expect(response.text).toHaveLength(32);
    });

    test("400 - Request malformed", async () => {
        const response = await req
            .post(endpoint)
            .send({}); // Empty request body, which should trigger a 400 response

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: \"username\" and/or \"password\" not in request JSON.")
    });

    test("400 - Username already exists", async () => {
        db.get = jest.fn((stmt, callback) => {
            // @ts-ignore
            callback(null, { username: "exists" });
        }) as jest.MockedFunction<DBGetType>;

        const response = await req
            .post(endpoint)
            .send({ username: "exists", password: goodPassword });

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: Username was already taken.")
    });

    test("400 - Password isn't valid", async () => {
        const response = await req
            .post(endpoint)
            .send({ username: "username", password: badPassword });

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: Password is insecure. It must have at least 12 characters, one digit, and one special character.");
    });

    test("500 - SQL error during db.get", async () => {
        db.get = jest.fn((stmt, callback) => {
            // @ts-ignore
            callback(new Error("Database Error"), null);
        }) as jest.MockedFunction<DBGetType>;
        
        const response = await req
            .post(endpoint)
            .send({ username: "username", password: goodPassword });

        expect(response.status).toBe(500);
        expect(response.text).toBe("Server Error: Error: Database Error")
    });

    test("500 - SQL error during db.run", async () => {
        db.get = jest.fn((stmt, callback) => {
            // @ts-ignore
            callback(null, null);
        }) as jest.MockedFunction<DBGetType>;
        
        db.run = jest.fn((stmt, params, callback) => {
            // @ts-ignore
            callback(new Error("Database Error"));
        }) as jest.MockedFunction<DBRunTypeWithCallback>;
        
        const response = await req
            .post(endpoint)
            .send({ username: "username", password: goodPassword });

        expect(response.status).toBe(500);
        expect(response.text).toBe("Server Error: Error: Database Error")
    });
});
