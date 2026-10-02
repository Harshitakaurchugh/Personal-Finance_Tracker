import { getApiErrorMessage } from "./api";

describe("getApiErrorMessage", () => {
    it("uses a plain-text backend response", () => {
        expect(
            getApiErrorMessage({ response: { data: "Account not found" } })
        ).toBe("Account not found");
    });

    it("uses a structured backend message", () => {
        expect(
            getApiErrorMessage({
                response: { data: { message: "Account is inactive" } }
            })
        ).toBe("Account is inactive");
    });

    it("formats field validation errors", () => {
        expect(
            getApiErrorMessage({
                response: { data: { errors: { amount: "Must be positive" } } }
            })
        ).toBe("amount: Must be positive");
    });

    it("ignores client exception text when there is no backend response", () => {
        expect(
            getApiErrorMessage({ message: "Network Error" }, "Request failed.")
        ).toBe("Request failed.");
    });
});