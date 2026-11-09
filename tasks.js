(function (root) {
  "use strict";
  var PRIORITIES = ["Low", "Medium", "High"];
 
  function updateTask(list, id, changes) {
    return list.map(function (t) { return t.id === id ? Object.assign({}, t, changes) : t; });
  }
 
  function addTask(list, title, time) {
    title = (title || "").trim();
    if (!title) return list;
    var id = list.reduce(function (m, t) { return Math.max(m, t.id); }, 0) + 1;
    return list.concat([{ id: id, title: title, status: "todo", priority: "Medium", time: time || "" }]);
  }
 
  function completeTask(list, id) {
    var t = list.find(function (x) { return x.id === id; });
    return updateTask(list, id, { status: t && t.status === "done" ? "todo" : "done" });
  }
 
  function deleteTask(list, id) {
    return list.filter(function (t) { return t.id !== id; });
  }
 
  function editTask(list, id, title) {
    title = (title || "").trim();
    if (!title) return list;
    return updateTask(list, id, { title: title });
  }
 
  function searchTasks(list, query) {
    var q = (query || "").toLowerCase();
    return list.filter(function (t) { return t.title.toLowerCase().indexOf(q) !== -1; });
  }
 
  function setPriority(list, id, priority) {
    if (PRIORITIES.indexOf(priority) === -1) return list;
    return updateTask(list, id, { priority: priority });
  }
 
  var api = { PRIORITIES: PRIORITIES, updateTask: updateTask, addTask: addTask, completeTask: completeTask, deleteTask: deleteTask, editTask: editTask, searchTasks: searchTasks, setPriority: setPriority };
  root.Tasks = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
 