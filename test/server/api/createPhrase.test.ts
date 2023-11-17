import supertest from "supertest";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBGetType, DBGetTypeWithParams, DBRunTypeWithCallback } from "../../utils/types";
import { addSession } from "../../../server/types/Session";
jest.mock('../../../server/database');

let alexsToken = addSession({ username: "alex_jones45" });

const fakePhrase = {
    "doyou": "remember",
    "thetwentyfirstnight": "ofseptember"
}

let realPhrase = {
    "token": alexsToken,
    "phrase": "blah blah blah"
}

let realPhraseInvalidLength = {
    "token": alexsToken,
    "phrase": "The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [beep]"
}

let realPhraseBadToken = {
    "token": "floodingpasmawithphrases",
    "phrase": "blah blah blah"
}

let realPhraseNoPrivileges = {
    "token": alexsToken,
    "phrase": "blah blah blah"
}

// ...so here, we are returning the value
const mockGet = jest.fn((stmt, callback) => {
    // @ts-ignore
    callback(null, {
        count: "1",
        UserType: "moderator"
    });
}) as jest.MockedFunction<DBGetType>;

const mockRun = jest.fn((stmt, params, callback) => {
    // @ts-ignore
    callback(null);
}) as jest.MockedFunction<DBRunTypeWithCallback>;

// block console logging so it doesn't get annoying
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();

})

describe('[API] /createPhrase: database', () => {

    beforeEach(() => {
        db.get = jest.fn();
        db.run = jest.fn();
    });

    test("'get' error", async () => {
        db.get = jest.fn((stmt, callback) => {
            // @ts-ignore
            callback(new Error(), null);
        }) as jest.MockedFunction<DBGetType>;

        db.run = mockRun;

        const res = await supertest(app).post("/api/createPhrase").send(realPhrase);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Database error!")
    });

    test("'run' error", async () => {
        db.get = mockGet;

        db.run = jest.fn((stmt, params, callback) => {
            // @ts-ignore
            callback(new Error());
        }) as jest.MockedFunction<DBRunTypeWithCallback>;

        const res = await supertest(app).post("/api/createPhrase").send(realPhrase);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Database error!")
    });
});

describe('[API] /createPhrase: request', () => {

    beforeEach(() => {
        db.get = jest.fn();
        db.run = jest.fn();
    });

    test("Test valid createPhrase", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/createPhrase").send(realPhrase);

        expect(res.status).toBe(200);
        expect(res.text).toBe("1");
    });

    test("Test invalid createPhrase", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/createPhrase").send(fakePhrase);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid createPhrase request!");
    });

    test("Test valid createPhrase with invalid phrase length", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/createPhrase").send(realPhraseInvalidLength);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid phrase length! Phrase must be between 1 and 256 characters!");
    });

    test("Test valid createPhrase with invalid token", async () => {
        db.get = jest.fn().mockImplementationOnce(mockGet).mockImplementation((stmt, callback) => {
            // @ts-ignore
            callback(null, null);
        }) as jest.MockedFunction<DBGetType>;
        db.run = mockRun;

        const res = await supertest(app).post("/api/createPhrase").send(realPhraseBadToken);

        expect(res.status).toBe(401);
        expect(res.text).toBe("Invalid token provided!");
    });

    test("Test valid createPhrase with non-moderator user", async () => {
        db.get = jest.fn((stmt, callback) => {
            // @ts-ignore
            callback(null, {
                UserType: "standard"
            });
        }) as jest.MockedFunction<DBGetType>;
        db.run = mockRun;

        const res = await supertest(app).post("/api/createPhrase").send(realPhraseNoPrivileges);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid permissions! You must be a moderator to create phrases!");
    });
});
