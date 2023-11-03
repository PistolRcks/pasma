import supertest from "supertest";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { SessionsDeleteType } from "../../utils/types";
import { addSession, sessions } from "../../../server/types/Session";
jest.mock('../../../server/database');

const request = supertest(app);

let robsToken: string;

// block console logging so it doesn't get annoying
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
});

/* because each of the tests need to recreate the request data with a new token, we cannot initialize it
earlier in the code or in a beforeEach (request data is unique in each case) */
describe('[API] /logout', () => {

    beforeEach(() => {
        sessions.delete(robsToken);
        robsToken = addSession({ username: "rob" })
    });

    test("Test valid logout", async () => {
        let realLogout = {
            "token": robsToken
        };

        const res = await request.post("/api/logout").send(realLogout);
        expect(res.status).toBe(200);
        expect(res.text).toBe("OK");
        expect(sessions.has(robsToken)).toBeFalsy();
    });

    test("Test invalid logout request", async () => {
        let fakeLogout = {
            "random": "garbage"
        }

        const res = await request.post("/api/logout").send(fakeLogout);
        expect(res.status).toBe(500);
        expect(res.text).toBe("Error: Invalid logout request!");
        expect(sessions.has(robsToken)).toBeTruthy();
    });

    test("Test logout request with invalid token", async () => {
        let realLogoutWrongToken = {
            "token": "some_invalid_token"
        }

        const res = await request.post("/api/logout").send(realLogoutWrongToken);
        expect(res.status).toBe(400);
        expect(res.text).toBe("Error: Not logged in!");
        expect(sessions.has(robsToken)).toBeTruthy();
    });

    test("Test issue deleting valid session.", async () => {
        sessions.delete = jest.fn((key) => {
            return false;
        }) as jest.MockedFunction<SessionsDeleteType>;

        let realLogout = {
            "token": robsToken
        };

        const res = await request.post("/api/logout").send(realLogout);
        expect(res.status).toBe(500);
        expect(res.text).toBe("Error: Server couldn't remove session!");
        expect(sessions.has(robsToken)).toBeTruthy();
    });
});
