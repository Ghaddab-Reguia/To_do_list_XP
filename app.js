(function () {
  "use strict";
  var KEY = "xp-todo", ST = ["todo", "prog", "done"];
  var LB = { todo: "To Do", prog: "In Progress", done: "Done" };
  var list = [], filter = "all", query = "";
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
 
  function seed() {
    [["Reply to emails", "9:00 AM", "todo", "Medium"], ["Prepare presentation", "11:30 AM", "prog", "High"],
     ["Team stand-up", "1:00 PM", "todo", "Low"], ["Review report", "3:30 PM", "todo", "Medium"],
     ["Workout", "7:00 AM", "done", "High"]].forEach(function (s) {
      list = Tasks.addTask(list, s[0], s[1]);
      list = Tasks.updateTask(list, list[list.length - 1].id, { status: s[2], priority: s[3] });
    });
  }
  function load() {
    try { list = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { list = []; }
    if (!list.length) seed();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
 
  function row(x) {
    var d = x.status === "done";
    return '<div class="card t ' + (d ? "done" : "") + '"><button class="ck ' + (x.status === "prog" ? "p" : d ? "d" : "") +
      '" data-a="done" data-id="' + x.id + '">' + (d ? "✓" : "") + '</button><div class="tt"><b contenteditable data-edit="' + x.id + '">' +
      esc(x.title) + '</b><span class="sub">◷ ' + esc(x.time) + ' · <a style="cursor:pointer;text-decoration:underline" data-a="status" data-id="' +
      x.id + '">' + LB[x.status] + '</a> · ' + x.priority + '</span></div><button class="ib" data-a="del" data-id="' + x.id +
      '">✕</button><button class="ib fl p' + x.priority + '" data-a="prio" data-id="' + x.id + '" title="Priority: ' + x.priority + '">⚑</button></div>';
  }
  function draw() {
    $("#tb").innerHTML = [["all", "All"], ["todo", "To Do"], ["prog", "In Progress"], ["done", "Done"]].map(function (t) {
      return '<button class="' + (filter === t[0] ? "on" : "") + '" data-a="tab" data-v="' + t[0] + '">' + t[1] + "</button>";
    }).join("");
    var shown = Tasks.searchTasks(list, query).filter(function (x) { return filter === "all" || x.status === filter; });
    $("#ls").innerHTML = shown.map(row).join("") || '<div class="hint">No tasks found</div>';
    save();
  }
  function add() {
    var el = $("#nw");
    list = Tasks.addTask(list, el.value, new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
    el.value = "";
  }
 
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-a]");
    if (!b) return;
    var a = b.dataset.a, id = +b.dataset.id, x = list.find(function (t) { return t.id === id; });
    if (a === "done") list = Tasks.completeTask(list, id);
    else if (a === "status") list = Tasks.updateTask(list, id, { status: ST[(ST.indexOf(x.status) + 1) % 3] });
    else if (a === "prio") list = Tasks.setPriority(list, id, Tasks.PRIORITIES[(Tasks.PRIORITIES.indexOf(x.priority) + 1) % 3]);
    else if (a === "del") list = Tasks.deleteTask(list, id);
    else if (a === "tab") filter = b.dataset.v;
    else if (a === "add") add();
    draw();
  });
  document.addEventListener("focusout", function (e) {
    if (e.target.dataset && e.target.dataset.edit) { list = Tasks.editTask(list, +e.target.dataset.edit, e.target.textContent); draw(); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    if (e.target.id === "nw") { add(); draw(); }
    else if (e.target.dataset && e.target.dataset.edit) { e.preventDefault(); e.target.blur(); }
  });
  $("#q").addEventListener("input", function (e) { query = e.target.value; draw(); });
 
  $("#dt").textContent = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  load();
  draw();
})();