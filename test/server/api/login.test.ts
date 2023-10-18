// TODO: We'll get to this later...
test("FIXME: Work on this later.", () => {
    expect(true).toBeTruthy();
})
/*
import supertest from "supertest";
import { app, db } from "../../../server/main";
import { initDB } from "../../../server/database";
import crypto from "crypto";
import sqlite3, { Database } from "sqlite3";

jest.mock("crypto");
jest.mock("../../../server/database");

// ts is literal cbt, so we need to specify the "db.get" overload with a custom type
// this is necessary for spying
type GetSpy = (
    sql: string, 
    callback?: (this: sqlite3.Statement, err: Error | null, row: any) => void
) => any;

const req = supertest(app);

// block console logging so it doesn't get annoying
beforeAll(() => {
    //jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
})

describe("Tests for the /api/login endpoint", () => {
    beforeEach(() => {
        // Output what we put in instead of actually hashing
        crypto.pbkdf2Sync = jest.fn().mockImplementation(
            (password, salt, iterations, keylen, digest) => {
                return Buffer.from(password, "utf-8");
            }
        )
    });
    
    // Create dummy user 
    test("200 - Normal Login", async () => {
        // Mock the database query to return a dummy user using a spy
        (jest.spyOn(sqlite3.Database.prototype, "get") as jest.MockedFunction<GetSpy>)
            .mockImplementation((stmt, callback) => {
                // I honestly cannot figure out for the life of my how to do this correctly
                // There's basically an issue with assigning the type of 'this'
                // which I'm not sure how we access in this context
                // Upon further thinking, I don't think I want to write a typeguard for Statement so I don't care
                console.log("Yeah, we're getting here");
                // @ts-ignore
                callback(null, { Username: "username", Password: "password" });
            }
        );

        // Send a request to the /api/login endpoint
        const response = await req
            .post("/api/login")
            .send({ Username: "username", Password: "password" });

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
        (jest.spyOn(sqlite3.Database.prototype, "get") as jest.MockedFunction<GetSpy>)
            .mockImplementation((stmt, callback) => {
                // @ts-ignore
                callback(null, null); // User not found
            }
        );

        const response = await req
            .post("/api/login")
            .send({ username: "nonexistent", password: "password" });

        expect(response.status).toBe(401);
        expect(response.text).toBe("Error: Username or password does not exist.")
    });

    test("401 - Password isn't valid", async () => {
        (jest.spyOn(sqlite3.Database.prototype, "get") as jest.MockedFunction<GetSpy>)
            .mockImplementation((stmt, callback) => {
                // @ts-ignore
                callback(null, { Username: "username", Password: "incorrectpassword" });
            }
        );

        const response = await req
            .post("/api/login")
            .send({ username: "username", password: "password" });

        expect(response.status).toBe(401);
        expect(response.text).toBe("Error: Username or password does not exist.")
    });

    test("500 - SQL error", async () => {
        (jest.spyOn(sqlite3.Database.prototype, "get") as jest.MockedFunction<GetSpy>)
            .mockImplementation((stmt, callback) => {
                // @ts-ignore
                callback(new Error("Database error"), null);
            }
        );

        const response = await req
            .post("/api/login")
            .send({ username: "username", password: "password" });

        expect(response.status).toBe(500);
        expect(response.text).toBe("Server Error: Database error")
    });
});
*/
