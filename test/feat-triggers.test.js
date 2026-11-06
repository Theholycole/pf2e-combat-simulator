// Feat reactions read from their Trigger line (tools/lib/feat-power.mjs featTriggerOf), 2026-11-05.
import test from "node:test";
import assert from "node:assert/strict";
import { featTriggerOf } from "../tools/lib/feat-power.mjs";

const doc = (trigger) => ({ system: { description: { value: `<p><strong>Trigger</strong> ${trigger}</p><hr /><p>Effect text.</p>` } } });

test("fear triggers: its own, an ally's (an unlabeled condition link read by its name), and a turn start while frightened", () => {
    assert.deepEqual(featTriggerOf(doc("You become frightened.")), { on: "frightened" });
    assert.deepEqual(featTriggerOf(doc("An ally within 30 feet gains the @UUID[Compendium.pf2e.conditionitems.Item.Frightened] condition.")), { on: "ally-frightened", toTrigger: true, within: 30 });
    assert.deepEqual(featTriggerOf(doc("An adjacent ally becomes frightened or stupefied.")), { on: "ally-frightened", toTrigger: true, within: 5 });
    assert.deepEqual(featTriggerOf(doc("You start your turn with the @UUID[Compendium.pf2e.conditionitems.Item.Frightened] condition.")), { on: "turn-start", withCondition: "frightened" });
    assert.equal(featTriggerOf(doc("You gain the @UUID[Compendium.pf2e.conditionitems.Item.xYTAsEpcJE1Ccni3] condition.")), null);
});
