import supertest from "supertest";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBAllType } from "../../utils/types";
import { addSession } from "../../../server/types/Session";

jest.mock("../../../server/database");

const req = supertest(app);
let bobsToken = addSession({ username: "bob" });

// this is a simple example of how the output from the request is structured
let rows =
    [
        {
            "Phrase": "first phrase"
        },
        {
            "Phrase": "second phrase"
        }
    ];

let realGetPhrases = {
    "token": bobsToken
};

let realGetPhrasesBadToken = {
    "token": "ummmmnope"
};

let fakeGetPhrases = {
    "invalid": "info"
}

let mockAll = jest.fn((stmt, callback) => {
    // @ts-ignore
    callback(null, rows);
}) as jest.MockedFunction<DBAllType>;

let mockAllError = jest.fn((stmt, callback) => {
    // @ts-ignore
    callback(new Error(), null);
}) as jest.MockedFunction<DBAllType>;

// block console logging so it doesn't get annoying
// also generate session token
let sessionToken: string;
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();

    sessionToken = addSession({ username: "bob" });
});

describe("[API] /getPhrases: database", () => {

    beforeEach(() => {
        db.all = jest.fn();
    });

    test("'all' error", async () => {
        db.all = mockAllError;

        const res = await supertest(app).get("/api/getPhrases").send(realGetPhrases);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Database error!");
    });

})

describe('[API] /getPhrases: request', () => {

    beforeEach(() => {
        db.all = mockAll;
    });

    test("Test invalid getPhrases", async () => {
        const res = await supertest(app).get("/api/getPhrases").send(fakeGetPhrases);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid getPhrases request!");
    });

    test("Test valid getPhrases", async () => {
        const res = await supertest(app).get("/api/getPhrases").send(realGetPhrases);

        expect(res.status).toBe(200);
        expect(res.text).toEqual(JSON.stringify([ "first phrase", "second phrase" ]));
    });

    test("Test proper getPhrases with bad token", async () => {
        const res = await supertest(app).get("/api/getPhrases").send(realGetPhrasesBadToken);

        expect(res.status).toBe(401);
        expect(res.text).toBe("Invalid token provided!");
    });
});
