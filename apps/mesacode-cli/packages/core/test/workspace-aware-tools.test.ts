import assert from "node:assert/strict";
import test from "node:test";
import { isWorkspaceToolContext } from "../src/runtime/methods/config.js";

test("only exposes tools for detected workspaces", () => {
  assert.equal(isWorkspaceToolContext({ isGitRepository: true }), true);
  assert.equal(isWorkspaceToolContext({ isGitRepository: false }), false);
  assert.equal(isWorkspaceToolContext(undefined), false);
});