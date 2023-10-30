import supertest from "supertest";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBGetTypeWithParams, DBRunTypeWithCallback } from "../../utils/types";
import { addSession } from "../../../server/types/Session";
jest.mock('../../../server/database');

// instead of actually reflecting changes in the database, we simply keep track of the
// a string and ID that is the "post" we are editing
let postContent = "";
let postID = "0";
let bobsToken = addSession({ username: "bob" });
let sarahsToken = addSession({ username: "sarah" });

const fakeEdit = {
    "invalid": "data",
    "corrupt": "uh oh!"
}

let realEdit = {
    "id": "0",
    "content": "edited message!",
    "token": bobsToken
}

let realEditBadID = {
    "id": "1337",
    "content": "edited message!",
    "token": bobsToken
}

let realEditBadToken = {
    "id": "0",
    "content": "edited message!",
    "token": "imtryingtohackbobsrobloxaccount"
}

let realEditWrongUser = {
    "id": "0",
    "content": "edited message!",
    "token": sarahsToken
}

const mockGet = jest.fn((stmt, params, callback) => {
    // keep this empty unless the ID provided matches our post ID
    let row;
    if (params[0] == postID) {
        row = { Username: "bob" };
    }
    // @ts-ignore
    callback(null, row);
}) as jest.MockedFunction<DBGetTypeWithParams>;

const mockRun = jest.fn((stmt, params, callback) => {
    postContent = params[0];
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
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
})

describe('[API] /edit: database', () => {

    beforeEach(() => {
        db.get = jest.fn();
        db.run = jest.fn();

        // need to reset this for each test
        postContent = "unedited message";
    });

    test("'get' error", async () => {
        db.get = mockGetError;
        db.run = mockRun;

        const res = await supertest(app).post("/api/edit").send(realEdit);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Database error!");
        expect(postContent).toBe("unedited message");
    });

    test("'run' error", async () => {
        db.get = mockGet;
        db.run = mockRunError;

        const res = await supertest(app).post("/api/edit").send(realEdit);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Database error!")
        expect(postContent).toBe("unedited message");
    });
});

describe('[API] /post: request', () => {

    beforeEach(() => {
        db.get = jest.fn();
        db.run = jest.fn();

        // need to reset this for each test
        postContent = "unedited message";
    });

    test("Test valid edit", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/edit").send(realEdit);

        expect(res.status).toBe(200);
        expect(res.text).toBe("");
        expect(postContent).toBe("edited message!");
    });

    test("Test invalid post ID", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/edit").send(realEditBadID);

        expect(res.status).toBe(403);
        expect(res.text).toBe("Invalid post ID!");
        expect(postContent).toBe("unedited message");
    });

    test("Test invalid user token", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/edit").send(realEditBadToken);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid token provided!");
        expect(postContent).toBe("unedited message");
    });

    test("Test valid user token on post made by someone else", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/edit").send(realEditWrongUser);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid token provided!");
        expect(postContent).toBe("unedited message");
    });

    test("Test invalid request", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/edit").send(fakeEdit);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid edit request!");
        expect(postContent).toBe("unedited message");
    });
});
