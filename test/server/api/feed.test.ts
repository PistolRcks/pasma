import supertest from "supertest";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBAllTypeWithParams } from "../../utils/types";
import { addSession } from "../../../server/types/Session";

jest.mock("../../../server/database");

const req = supertest(app);

// block console logging so it doesn't get annoying
// also generate session token
let sessionToken: string;
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();

    sessionToken = addSession({ username: "bob" });
});

describe("Tests for the /api/feed endpoint", () => {
    const badSessionToken = "bad";
    const badSmallSize = 0;
    const badLargeSize = 10001;
    // *technically* not all we're grabbing, but works for our usecase
    const data = [
        {
            id: 0,
            user: "alice",
            content: "content",
            picture: "picture",
            dislikes: 111,
            comments: 111
        }
    ]

    beforeEach(() => {
        db.all = jest.fn();
    });

    test("200 - normal usage, default parameters", async () => {
        db.all = jest.fn((stmt, params, callback) => {
            expect(params[0]).toBe("bob"); // checking default author
            expect(params[1]).toBe(100); // checking default size
            // @ts-ignore
            callback(null, data);
        }) as jest.MockedFunction<DBAllTypeWithParams>;

        const response = await req
            .post("/api/feed")
            .send({ token: sessionToken });

        expect(response.status).toBe(200);

        // only length one in the fake dataset. in normal cases there 
        // would be at most `size` items
        expect(response.body).toHaveLength(1);
        // only going to check for properties once
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("user");
        expect(response.body[0]).toHaveProperty("content");
        expect(response.body[0]).toHaveProperty("picture");
        expect(response.body[0]).toHaveProperty("dislikes");
        expect(response.body[0]).toHaveProperty("comments");
    });

    test("200 - normal usage, custom parameters", async () => {
        db.all = jest.fn((stmt, params, callback) => {
            expect(params[0]).toBe("bob");
            expect(params[1]).toBe(0);
            expect(params[2]).toBe(0);
            expect(params[3]).toBe(5);
            expect(params[4]).toBe(42);
            expect(params[5]).toBe("alice");
            expect(params[6]).toBe("moderator");
            expect(params[7]).toBe(2);
            // @ts-ignore
            callback(null, data);
        }) as jest.MockedFunction<DBAllTypeWithParams>;

        const response = await req
            .post("/api/feed")
            .send({
                token: sessionToken,
                id: 0,
                startDate: 5,
                endDate: 42,
                author: "alice",
                userType: "moderator",
                size: 2
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test("200 - normal usage, custom parameters with invalid startDate", async () => {
        const response = await req
            .post("/api/feed")
            .send({
                token: sessionToken,
                startDate: "haha, this is actually text!"
            });

        expect(response.text).toBe("Error: Invalid startDate, please provide a valid number!");
        expect(response.status).toBe(500);
    });

    test("200 - normal usage, custom parameters with invalid endDate", async () => {
        const response = await req
            .post("/api/feed")
            .send({
                token: sessionToken,
                startDate: 36,
                endDate: 20
            });

        expect(response.text).toBe("Error: Invalid endDate, please provide a valid number that is greater than startDate!");
        expect(response.status).toBe(500);
    });

    test("200 - normal usage, custom parameters with invalid userType", async () => {
        const response = await req
            .post("/api/feed")
            .send({
                token: sessionToken,
                userType: "super epic person"
            });

        expect(response.text).toBe("Error: Invalid userType, please provide a valid userType string!");
        expect(response.status).toBe(500);
    });

    test("200 - normal usage, handle null return from `db.all`", async () => {
        db.all = jest.fn((stmt, params, callback) => {
            // @ts-ignore
            callback(null, null);
        }) as jest.MockedFunction<DBAllTypeWithParams>;

        const response = await req
            .post("/api/feed")
            .send({ token: sessionToken });

        expect(response.body).toHaveLength(0);
        expect(response.status).toBe(200);
    });

    test("400 - token not present", async () => {
        const response = await req
            .post("/api/feed")
            .send({});

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: \"token\" not in request JSON.");
    });

    test("400 - size parameter not a number", async () => {
        const response = await req
            .post("/api/feed")
            .send({ token: sessionToken, size: "bad" });

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: \"size\" is not of type \"number\" in request JSON.");
    });

    test("400 - size parameter too small", async () => {
        const response = await req
            .post("/api/feed")
            .send({ token: sessionToken, size: badSmallSize });

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: \"size\" cannot be less than 1.");
    });

    test("400 - size parameter too large", async () => {
        const response = await req
            .post("/api/feed")
            .send({ token: sessionToken, size: badLargeSize });

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: \"size\" cannot be greater than 10000.");
    });

    test("401 - invalid token", async () => {
        const response = await req
            .post("/api/feed")
            .send({ token: badSessionToken });

        expect(response.status).toBe(401);
        expect(response.text).toBe("Error: Invalid token provided.");
    });

    test("500 - database error", async () => {
        db.all = jest.fn((stmt, params, callback) => {
            // @ts-ignore
            callback(new Error("Error!"), null);
        }) as jest.MockedFunction<DBAllTypeWithParams>;

        const response = await req
            .post("/api/feed")
            .send({ token: sessionToken });

        expect(response.status).toBe(500);
        expect(response.text).toBe("Error: Database error!");
    });
})
