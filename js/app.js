(() => {
  const $ = id => document.getElementById(id);
  const KEY_FAV = "kt:favorites", KEY_REC = "kt:recent", MAX_RECENT = 4;
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  let favs = store.get(KEY_FAV, []);
  let recent = store.get(KEY_REC, []); // [{id, t}]
  let category = "All", query = "";

  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const isSafe = u => /^https?:\/\//.test(u);

  function renderFilters() {
    const cats = ["All", "Favorites", ...new Set(tools.map(t => t.category))];
    const box = $("filters"); box.replaceChildren();
    cats.forEach(c => {
      const b = el("button", "", c); b.type = "button";
      b.setAttribute("aria-pressed", String(c === category));
      b.onclick = () => { category = c; renderFilters(); renderTools(); };
      box.append(b);
    });
  }

  function matches(t) {
    if (category === "Favorites" && !favs.includes(t.id)) return false;
    if (category !== "All" && category !== "Favorites" && t.category !== category) return false;
    const q = query.trim().toLowerCase();
    return !q || [t.name, t.description, t.category].some(s => s.toLowerCase().includes(q));
  }

  function card(t) {
    const c = el("article", "card");
    if (t.badge) c.append(el("span", "badge", t.badge));
    const top = el("div", "top");
    const icon = el("div", "icon", t.icon); icon.setAttribute("aria-hidden", "true");
    const f = el("button", "fav", favs.includes(t.id) ? "★" : "☆"); f.type = "button";
    f.setAttribute("aria-pressed", String(favs.includes(t.id)));
    f.setAttribute("aria-label", (favs.includes(t.id) ? "Remove " : "Add ") + t.name + (favs.includes(t.id) ? " from favorites" : " to favorites"));
    f.onclick = () => toggleFav(t.id);
    top.append(icon, f);
    const actions = el("div", "actions");
    const open = el("a", "open", "OPEN TOOL →"); open.href = isSafe(t.url) ? t.url : "#";
    open.setAttribute("aria-label", "Open " + t.name);
    open.addEventListener("click", () => markUsed(t.id));
    actions.append(open);
    if (t.github && isSafe(t.github)) {
      const g = el("a", "gh", "GitHub ↗"); g.href = t.github; g.target = "_blank"; g.rel = "noopener";
      g.setAttribute("aria-label", t.name + " source on GitHub (opens in new tab)");
      actions.append(g);
    }
    c.append(top, el("h3", "", t.name), el("p", "", t.description), el("span", "cat", t.category), actions);
    return c;
  }

  function renderTools() {
    const list = tools.filter(matches);
    const grid = $("grid"); grid.replaceChildren(...list.map(card));
    $("empty").hidden = list.length > 0;
    const total = String(tools.length).padStart(2, "0");
    $("count").textContent = list.length === tools.length
      ? `${total} TOOLS AVAILABLE`
      : `${String(list.length).padStart(2, "0")} OF ${total} TOOLS SHOWN`;
  }

  function renderRecent() {
    const items = recent.map(r => tools.find(t => t.id === r.id)).filter(Boolean).slice(0, MAX_RECENT);
    $("recent-wrap").hidden = items.length === 0;
    $("recent").replaceChildren(...items.map(t => {
      const a = el("a", "", `${t.icon} ${t.name}`); a.href = t.url;
      a.addEventListener("click", () => markUsed(t.id)); return a;
    }));
  }

  function toggleFav(id) {
    favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
    store.set(KEY_FAV, favs); renderTools();
  }

  function markUsed(id) {
    recent = [{ id, t: Date.now() }, ...recent.filter(r => r.id !== id)].slice(0, 8);
    store.set(KEY_REC, recent);
  }

  $("q").addEventListener("input", e => { query = e.target.value; renderTools(); });
  renderFilters(); renderTools(); renderRecent();
})();
