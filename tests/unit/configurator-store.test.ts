/**
 * Unit tests for configuratorStore (Zustand store)
 *
 * We test the store actions directly without React rendering,
 * using the store's getState() and setState() APIs.
 */
import { useConfiguratorStore } from "@/store/configuratorStore";

// Helper: get a fresh store state reference
function getState() {
    return useConfiguratorStore.getState();
}

// Reset store before each test to avoid state bleed
beforeEach(() => {
    getState().reset();
    // Also clear product slug
    useConfiguratorStore.setState({ productSlug: null, _past: [], _future: [] });
});

describe("openProduct", () => {
    it("sets productSlug and resets config", () => {
        getState().setMaterial("seat", "#ff0000");
        getState().openProduct("aurora-chair");
        const state = getState();
        expect(state.productSlug).toBe("aurora-chair");
        expect(state.materials).toEqual({});
        expect(state._past).toEqual([]);
    });
});

describe("setMaterial", () => {
    it("sets a material for a part", () => {
        getState().setMaterial("seat", "#ff0000");
        expect(getState().materials["seat"]).toBe("#ff0000");
    });

    it("overwrites an existing material", () => {
        getState().setMaterial("seat", "#ff0000");
        getState().setMaterial("seat", "#00ff00");
        expect(getState().materials["seat"]).toBe("#00ff00");
    });

    it("saves a snapshot to _past", () => {
        getState().setMaterial("seat", "#ff0000");
        expect(getState()._past.length).toBe(1);
    });

    it("clears _future on new change", () => {
        getState().setMaterial("seat", "#ff0000");
        getState().undo();
        getState().setMaterial("seat", "#0000ff");
        expect(getState()._future.length).toBe(0);
    });
});

describe("toggleComponent", () => {
    it("toggles a component to visible", () => {
        getState().toggleComponent("cushion", true);
        expect(getState().components["cushion"]).toBe(true);
    });

    it("toggles a component to hidden", () => {
        getState().toggleComponent("cushion", false);
        expect(getState().components["cushion"]).toBe(false);
    });

    it("saves a snapshot to _past", () => {
        getState().toggleComponent("armrest", true);
        expect(getState()._past.length).toBe(1);
    });
});

describe("setLighting", () => {
    it("sets lighting preset to daylight", () => {
        getState().setLighting("daylight");
        expect(getState().lighting).toBe("daylight");
    });

    it("starts at studio by default", () => {
        expect(getState().lighting).toBe("studio");
    });
});

describe("setCamera", () => {
    it("updates azimuth partially", () => {
        getState().setCamera({ azimuth: 90 });
        expect(getState().camera.azimuth).toBe(90);
        // elevation and distance stay at defaults
        expect(getState().camera.elevation).toBe(15);
    });
});

describe("undo / redo", () => {
    it("undo reverts the last material change", () => {
        getState().setMaterial("seat", "#ff0000");
        getState().setMaterial("seat", "#00ff00");
        getState().undo();
        expect(getState().materials["seat"]).toBe("#ff0000");
    });

    it("redo re-applies the reverted change", () => {
        getState().setMaterial("seat", "#ff0000");
        getState().setMaterial("seat", "#00ff00");
        getState().undo();
        getState().redo();
        expect(getState().materials["seat"]).toBe("#00ff00");
    });

    it("undo does nothing if _past is empty", () => {
        getState().undo(); // should not throw
        expect(getState().materials).toEqual({});
    });

    it("redo does nothing if _future is empty", () => {
        getState().setMaterial("seat", "#ff0000");
        getState().redo(); // should not throw
        expect(getState().materials["seat"]).toBe("#ff0000");
    });

    it("moves snapshot to _future after undo", () => {
        getState().setMaterial("seat", "#ff0000");
        getState().undo();
        expect(getState()._future.length).toBe(1);
    });
});

describe("reset", () => {
    it("resets all state to defaults", () => {
        getState().setMaterial("seat", "#ff0000");
        getState().toggleComponent("cushion", true);
        getState().setLighting("warm");
        getState().reset();
        const state = getState();
        expect(state.materials).toEqual({});
        expect(state.components).toEqual({});
        expect(state.lighting).toBe("studio");
        expect(state._past).toEqual([]);
        expect(state._future).toEqual([]);
    });
});
