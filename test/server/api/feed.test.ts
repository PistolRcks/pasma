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
    //jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();

    sessionToken = addSession({ username: "bob" });
});

describe("Tests for the /api/feed endpoint", () => {
    const badSessionToken = "bad";
    const badSmallSize = 0;
    const badLargeSize = 10001;
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

    test("200 - normal usage, default size", async () => {
        db.all = jest.fn((stmt, params, callback) => {
            // default `size` value is 100
            expect(params[0]).toBe(100);
            // @ts-ignore
            callback(null, data);
        }) as jest.MockedFunction<DBAllTypeWithParams>;

        const response = await req
            .get("/api/feed")
            .send({ token: sessionToken });

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
        expect(response.status).toBe(200);
    });
    
    test("200 - normal usage, custom size", async () => {
        db.all = jest.fn((stmt, params, callback) => {
            expect(params[0]).toBe(1);
            // @ts-ignore
            callback(null, data);
        }) as jest.MockedFunction<DBAllTypeWithParams>;

        const response = await req
            .get("/api/feed")
            .send({ token: sessionToken, size: 1 });

        expect(response.body).toHaveLength(1);
        expect(response.status).toBe(200);
    });
    
    test("200 - normal usage, handle null return from `db.all`", async () => {
        db.all = jest.fn((stmt, params, callback) => {
            // @ts-ignore
            callback(null, null);
        }) as jest.MockedFunction<DBAllTypeWithParams>;

        const response = await req
            .get("/api/feed")
            .send({ token: sessionToken });

        expect(response.body).toHaveLength(0);
        expect(response.status).toBe(200);
    });
    
    test("400 - token not present", async () => {
        const response = await req
            .get("/api/feed")
            .send({});

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: \"token\" not in request JSON.");
    });
    
    test("400 - size parameter not a number", async () => {
        const response = await req
            .get("/api/feed")
            .send({ token: sessionToken, size: "bad" });

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: \"size\" is not of type \"number\" in request JSON.");
    });
    
    test("400 - size parameter too small", async () => {
        const response = await req
            .get("/api/feed")
            .send({ token: sessionToken, size: badSmallSize });

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: \"size\" cannot be less than 1.");
    });
    
    test("400 - size parameter too large", async () => {
        const response = await req
            .get("/api/feed")
            .send({ token: sessionToken, size: badLargeSize });

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: \"size\" cannot be greater than 10000.");
    });
    
    test("401 - invalid token", async () => {
        const response = await req
            .get("/api/feed")
            .send({ token : badSessionToken });

        expect(response.status).toBe(401);
        expect(response.text).toBe("Error: Invalid token provided.");
    });
    
    test("500 - database error", async () => {
        db.all = jest.fn((stmt, params, callback) => {
            // @ts-ignore
            callback(new Error("Error!"), null);
        }) as jest.MockedFunction<DBAllTypeWithParams>;
        
        const response = await req
            .get("/api/feed")
            .send({ token : sessionToken });
        
        expect(response.status).toBe(500);
        expect(response.text).toBe("Error: Database error!");
    });
})
