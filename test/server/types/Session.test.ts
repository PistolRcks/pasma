import { isSession, addSession } from "../../../server/types/Session";

describe("Tests for the Session type", () => {
    test("Test isSession typeguard failure", () => {
        expect(isSession({
            "username": 6
        })).toBeFalsy(); 
    });
    
    test("Test isSession typeguard success", () => {
        expect(isSession({
            "username": "blah"
        })).toBeTruthy();
    });

    test("Test addSession", () => {
        let session = { username: "alice" };
        let token = addSession(session)
        expect(token).toHaveLength(32);
        expect(session).toHaveProperty("token");
    });
})
