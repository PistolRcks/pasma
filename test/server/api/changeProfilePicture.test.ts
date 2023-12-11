
import supertest from "supertest";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBGetType, DBGetTypeWithParams, DBRunTypeWithCallback } from "../../utils/types";
import { isSession, addSession } from "../../../server/types/Session";

jest.mock("../../../server/database");

const req = supertest(app);

// block console logging so it doesn't get annoying
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
});

describe("tests for changeProfilePicture API endpoint", () => {
    let token: string = addSession({ username: "alice" });

    db.run = jest.fn();

    beforeEach(() => {
        db.run = jest.fn((stmt, params, callback) => {
            // @ts-ignore
            callback(null);
        }) as jest.MockedFunction<DBRunTypeWithCallback>;
    });

    test("200 - Normal request", async () => {
        const res = await req.post("/api/profile/settings/profile_picture").send({ "token": token, "profile_picture": "newName" });

        expect(res.status).toBe(200);
        expect(res.text).toBe("OK");
    });

    test("400 - Invalid request", async () => {
        const res = await req.post("/api/profile/settings/profile_picture").send({ "strange": "string" });

        expect(res.status).toBe(400);
        expect(res.text).toBe("Error: Invalid changeProfilePicture request!");
    });

    test("401 - Normal request, invalid token", async () => {
        const res = await req.post("/api/profile/settings/profile_picture").send({ "token": "awesometoken", "profile_picture": "newName" });

        expect(res.status).toBe(401);
        expect(res.text).toBe("Error: Invalid token provided.");
    });

    test("500 - Normal request, invalid profile picture/other error", async () => {
        db.run = jest.fn((stmt, params, callback) => {
            // @ts-ignore
            callback(new Error());
        }) as jest.MockedFunction<DBRunTypeWithCallback>;

        const res = await req.post("/api/profile/settings/profile_picture").send({ "token": token, "profile_picture": "notARealProfilePicture.jpg" });

        expect(res.status).toBe(500);
        expect(res.text.startsWith("Server Error: ")).toBeTruthy();
    });
});
