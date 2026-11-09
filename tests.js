"use strict";
var T = require("./tasks.js");
var assert = require("assert");
var failed = 0;
function test(name, fn) {
  try { fn(); console.log("  PASS  " + name); }
  catch (e) { failed++; console.log("  FAIL  " + name + " -> " + e.message); }
}
 
test("adds a task to the list", function () {
  var l = T.addTask([], "Buy milk");
  assert.strictEqual(l.length, 1);
  assert.strictEqual(l[0].title, "Buy milk");
  assert.strictEqual(l[0].status, "todo");
});
test("ignores an empty title", function () {
  assert.strictEqual(T.addTask([], "   ").length, 0);
});
 
test("marks a task as completed", function () {
  var l = T.addTask([], "A");
  l = T.completeTask(l, l[0].id);
  assert.strictEqual(l[0].status, "done");
});
 
test("deletes a task", function () {
  var l = T.addTask(T.addTask([], "A"), "B");
  l = T.deleteTask(l, l[0].id);
  assert.strictEqual(l.length, 1);
  assert.strictEqual(l[0].title, "B");
});
 
test("edits a task title", function () {
  var l = T.addTask([], "A");
  l = T.editTask(l, l[0].id, "B");
  assert.strictEqual(l[0].title, "B");
});
 
test("finds tasks ignoring case", function () {
  var l = T.addTask(T.addTask([], "Buy milk"), "Call Sam");
  assert.strictEqual(T.searchTasks(l, "MIL").length, 1);
});
 
test("assigns a priority and rejects invalid values", function () {
  var l = T.addTask([], "A");
  assert.strictEqual(T.setPriority(l, l[0].id, "High")[0].priority, "High");
  assert.strictEqual(T.setPriority(l, l[0].id, "Urgent")[0].priority, "Medium");
});
 
console.log(failed ? "\n" + failed + " test(s) failed" : "\nAll tests passed");
process.exit(failed ? 1 : 0);
 