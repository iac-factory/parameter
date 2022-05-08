import Utility from "util";

import { Parameter } from "@iac-factory/parameter";

describe( "Unit Test", () => {
    const parameter = new Parameter({
        organization: "organization",
        environment: "environment",
        application: "application",
        service: "service",
        identifier: "identifier"
    });

    console.log("Instance", Utility.inspect(parameter, { colors: true }));

    it("Organization", () => expect(parameter).toHaveProperty("organization"));
    it("Environment", () => expect(parameter).toHaveProperty("environment"));
    it("Application", () =>expect(parameter).toHaveProperty("application"));
    it("Service", () => expect(parameter).toHaveProperty("service"));
    it("Identifier", () => expect(parameter).toHaveProperty("identifier"));

    it("Module", async () => {
        const Import = await import("@iac-factory/parameter");

        expect(Import).toHaveProperty("Parameter");

    });
} );
