import Utility from "util";

import { Parameter } from "@iac-factory/parameter";

describe( "Module Unit Test", () => {
    it("Module", async () => {
        const Import = await import("@iac-factory/parameter");

        console.log("Module", Utility.inspect(Import, { colors: true }));

        expect(Import).toHaveProperty("Parameter");
    });
} );
