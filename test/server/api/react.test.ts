import supertest from "supertest";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBGetTypeWithParams, DBRunTypeWithCallback } from "../../utils/types";
import { addSession } from "../../../server/types/Session";
jest.mock('../../../server/database');

// instead of actually reflecting changes in the database, we simply keep track of the
// a post ID and token that is the "post" we are reacting to
let postID = "0";
let bobsToken = addSession({ username: "bob" });
let bobDisliked = false;

const fakeReact = {
    "hehe": "hawhaw"
}

let realReact = {
    "id": "0",
    "token": bobsToken
}

let realReactBadID = {
    "id": "1234",
    "token": bobsToken
}

let realReactBadToken = {
    "id": "0",
    "token": "imtryingtohackbobsminecraftaccount"
}

const mockGet = jest.fn((stmt, params, callback) => {
    let row = {
        test_validpost: true,
        test_disliked: bobDisliked
    };
    if (params[0] != postID) {
        row.test_validpost = false;
    }
    // @ts-ignore
    callback(null, row);
}) as jest.MockedFunction<DBGetTypeWithParams>;

const mockRun = jest.fn((stmt, params, callback) => {
    bobDisliked = !bobDisliked;
    // @ts-ignore
    callback(null);
}) as jest.MockedFunction<DBRunTypeWithCallback>;

// the functions below purposefully spit out errors for testing purposes
const mockGetError = jest.fn((stmt, params, callback) => {
    // @ts-ignore
    callback(new Error(), null);
}) as jest.MockedFunction<DBGetTypeWithParams>;

const mockRunError = jest.fn((stmt, params, callback) => {
    // @ts-ignore
    callback(new Error());
}) as jest.MockedFunction<DBRunTypeWithCallback>;

// block console logging so it doesn't get annoying
// beforeAll(() => {
//     jest.spyOn(console, "log").mockImplementation();
//     jest.spyOn(console, "error").mockImplementation();
// });

describe('[API] /edit: database', () => {

    beforeEach(() => {
        db.get = jest.fn();
        db.run = jest.fn();

        bobDisliked = false;
    });

    test("'get' error", async () => {
        db.get = mockGetError;
        db.run = mockRun;

        const res = await supertest(app).post("/api/react").send(realReact);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Database error!");
        expect(bobDisliked).toBeFalsy();
    });

    test("'run' error", async () => {
        db.get = mockGet;
        db.run = mockRunError;

        const res = await supertest(app).post("/api/react").send(realReact);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Database error!")
        expect(bobDisliked).toBeFalsy();
    });
});

describe('[API] /post: request', () => {

    beforeEach(() => {
        db.get = jest.fn();
        db.run = jest.fn();

    });

    test("Test add dislike", async () => {
        db.get = mockGet;
        db.run = mockRun;

        bobDisliked = false;

        const res = await supertest(app).post("/api/react").send(realReact);

        expect(res.status).toBe(200);
        expect(res.text).toBe("");
        expect(bobDisliked).toBe(true);
    });

    test("Test remove dislike", async () => {
        db.get = mockGet;
        db.run = mockRun;

        bobDisliked = true;

        const res = await supertest(app).post("/api/react").send(realReact);

        expect(res.status).toBe(200);
        expect(res.text).toBe("");
        expect(bobDisliked).toBe(false);
    });

    test("Test invalid post ID", async () => {
        db.get = mockGet;
        db.run = mockRun;

        bobDisliked = false;

        const res = await supertest(app).post("/api/react").send(realReactBadID);

        expect(res.status).toBe(400);
        expect(res.text).toBe("Invalid post ID!");
        expect(bobDisliked).toBe(false);
    });

    test("Test invalid user token", async () => {
        db.get = mockGet;
        db.run = mockRun;

        bobDisliked = false;

        const res = await supertest(app).post("/api/react").send(realReactBadToken);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid token provided!");
        expect(bobDisliked).toBe(false);
    });

    test("Test invalid request", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/react").send(fakeReact);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid dislike request!");
        expect(bobDisliked).toBe(false);
    });
});
