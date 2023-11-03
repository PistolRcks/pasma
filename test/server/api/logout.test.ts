import supertest from "supertest";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { SessionsDeleteType } from "../../utils/types";
import { addSession, sessions } from "../../../server/types/Session";
jest.mock('../../../server/database');

let robsToken: string;

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

        const res = await supertest(app).post("/api/logout").send(realLogout);
        expect(res.status).toBe(200);
        expect(res.text).toBe("OK");
        expect(sessions.has(robsToken)).toBeFalsy();
    });

    test("Test invalid logout request", async () => {
        let fakeLogout = {
            "random": "garbage"
        }
        
        const res = await supertest(app).post("/api/logout").send(fakeLogout);
        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid logout request!");
        expect(sessions.has(robsToken)).toBeTruthy();
    });

    test("Test logout request on user that is not logged in", async () => {
        let realLogoutNotLoggedIn = {
            "token": ""
        }
        
        const res = await supertest(app).post("/api/logout").send(realLogoutNotLoggedIn);
        expect(res.status).toBe(400);
        expect(res.text).toBe("Not logged in!");
        expect(sessions.has(robsToken)).toBeTruthy();
    });

    test("Test logout request with invalid token", async () => {
        let realLogoutWrongToken = {
            "token": "some_invalid_token"
        }
        
        const res = await supertest(app).post("/api/logout").send(realLogoutWrongToken);
        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid token provided!");
        expect(sessions.has(robsToken)).toBeTruthy();
    });

    test("Test issue deleting valid session.", async () => {
        sessions.delete = jest.fn((key) => {
            return false;
        }) as jest.MockedFunction<SessionsDeleteType>;

        let realLogout = {
            "token": robsToken
        };

        const res = await supertest(app).post("/api/logout").send(realLogout);
        expect(res.status).toBe(500);
        expect(res.text).toBe("Error removing session!");
        expect(sessions.has(robsToken)).toBeTruthy();
    });
});
