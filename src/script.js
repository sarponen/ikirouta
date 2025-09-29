(() => {
  const rooms = Array.from(document.querySelectorAll(".room"));
  const byName = Object.fromEntries(
    rooms.map(sec => [sec.dataset.room, sec])
  );

  function show(roomName) {
    rooms.forEach(sec => sec.hidden = true);
    const target = byName[roomName];
    if (target) target.hidden = false;
    const url = new URL(window.location);
    url.searchParams.set("room", roomName);
    history.replaceState(null, "", url);
  }

  function initialRoom() {
    const url = new URL(window.location);
    const q = url.searchParams.get("room");
    if (q && byName[q]) return q;
    // Jos ei URL-paramia, ota "ensimmäinen" huone tiedostonimi-/renderöintijärjestyksen mukaan:
    return rooms[0]?.dataset.room || null;
  }

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-go]");
    if (!el) return;
    const to = el.getAttribute("data-go");
    if (byName[to]) show(to);
  });

  const start = initialRoom();
  if (start) show(start);
})();
