import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  BookOpen, Lock, Unlock, PlusCircle, Feather, Wallet, User, ChevronLeft,
  Eye, Trash2, Coins, Library, X, Check, Sparkles, Search, Heart, Bookmark,
  BookmarkCheck, ArrowUp, LogOut, CreditCard, ShieldCheck, SlidersHorizontal,
  ArrowUpDown, Plus, Minus, Repeat, AlertCircle, Zap, Gift, Trophy, CalendarCheck,
  MessageSquare, Flame, HelpCircle, Send, Crown, BookMarked, Clock, Star,
  History, ListPlus, Shuffle, Type, Sun, Moon, AlignJustify, Share2, Flag,
  Sparkle, ThumbsUp, Copy, FolderPlus, Settings2, Maximize2,
  Image as ImageIcon, Tag, Bell, Users, TrendingUp, Filter, Download, Hash, Globe,
  Link2, Bot, Loader, Wand2, MessageCircle
} from "lucide-react";

/* =========================================================================
   InkVein - web novel platform (v4)
   Adds 20 reader features + copyright notice. See HowItWorks / Legal pages.
   NOTE: Front-end demo. Real security/payments need a backend + gateway.
   (c) 2026 InkVein. All works belong to their authors - see Legal page.
   ========================================================================= */

const COIN = "\u25C8";
const STONE = "\u26A1";
const KEY = "inkvein:v4";
const SESSION = "inkvein:session:v4";
const PREFS = "inkvein:prefs:v4";

const GENRES = ["Fantasy", "Urban Fantasy", "Sci-Fi", "Romance", "Mystery",
  "Horror", "Adventure", "Literary", "Historical", "Thriller", "Comedy", "Drama",
  "Dystopian", "Cyberpunk", "Steampunk", "Paranormal", "Slice of Life", "Action",
  "Mythology", "Fairy Tale", "Crime", "Western", "War", "Coming of Age",
  "Magical Realism", "Space Opera", "Dark Fantasy", "Cozy", "Satire", "Poetry"];
const GIFTS = [
  { id: "coffee", name: "Coffee", icon: "\u2615", cost: 2 },
  { id: "quill", name: "Golden Quill", icon: "\uD83D\uDD8B\uFE0F", cost: 10 },
  { id: "crown", name: "Laurel Crown", icon: "\uD83D\uDC51", cost: 25 },
  { id: "castle", name: "Floating Castle", icon: "\uD83C\uDFF0", cost: 100 },
];
const WPM = 230; // reading speed for time estimates
const today = () => new Date().toISOString().slice(0, 10);
const wordCount = (t) => (t || "").trim().split(/\s+/).filter(Boolean).length;
const readMins = (words) => Math.max(1, Math.round(words / WPM));
const coverBg = (n) => n && n.coverImg ? `url(${n.coverImg}) center/cover` : `linear-gradient(150deg, ${n ? n.cover : "#2a3d4f"}, #0c0c10)`;

async function loadDB() { try { const r = await window.storage.get(KEY, true); return r ? JSON.parse(r.value) : null; } catch { return null; } }
async function saveDB(s) { try { await window.storage.set(KEY, JSON.stringify(s), true); } catch (e) { console.error(e); } }
async function loadSession() { try { const r = await window.storage.get(SESSION, false); return r ? JSON.parse(r.value) : null; } catch { return null; } }
async function saveSession(s) { try { if (s) await window.storage.set(SESSION, JSON.stringify(s), false); else await window.storage.delete(SESSION, false); } catch (e) { console.error(e); } }
async function loadPrefs() { try { const r = await window.storage.get(PREFS, false); return r ? JSON.parse(r.value) : null; } catch { return null; } }
async function savePrefs(s) { try { await window.storage.set(PREFS, JSON.stringify(s), false); } catch (e) { console.error(e); } }
const shareKey = (code) => "inkvein:shelf:" + code;
async function publishShelf(code, payload) { try { await window.storage.set(shareKey(code), JSON.stringify(payload), true); return true; } catch { return false; } }
async function fetchShelf(code) { try { const r = await window.storage.get(shareKey(code), true); return r ? JSON.parse(r.value) : null; } catch { return null; } }
const makeCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const lightHash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return "h" + h.toString(36); };
const blankUser = (over) => ({ wallet: 50, stones: 20, purchases: [], bookmarks: [], payment: { connected: false }, lastCheckin: null, streak: 0, progress: {}, history: [], lists: {}, ratings: {}, follows: [], readMarks: [], chapterLikes: [], giftsSent: 0, ...over });
const DEFAULT_PREFS = { fontSize: 19, lineHeight: 1.78, theme: "night", width: 680 };

const SEED = {
  users: { ravenquill: blankUser({ id: "ravenquill", name: "Raven Quill", email: "raven@ink.io", pass: lightHash("demo1234"), wallet: 0, stones: 0, payment: { connected: true, brand: "Visa", last4: "4242" }, createdAt: 1, giftsReceived: 6, coinsEarned: 0 }),
    ilse_demo: blankUser({ id: "ilse_demo", name: "Ilse", email: "ilse@ink.io", pass: lightHash("demo1234"), createdAt: 2 }) },
  novels: [
    { id: "n1", authorId: "ravenquill", title: "The Lantern Below the Tide", tagline: "A drowned city remembers the girl who refused to sink.", genre: "Fantasy", cover: "#13414f", likes: 38, powerStones: 142, views: 980, createdAt: 5, comments: {}, reviews: [{ user: "Ilse", stars: 5, text: "The prose glows. Couldn't stop." }], chapters: [
      { id: "n1c1", title: "Salt and Cinder", price: 0, locked: false, body: "The harbor bells had not rung in nine years, and still Mira flinched each dusk, half-expecting them.\n\nShe walked the broken pier with a lantern that burned blue, the last of its kind, salvaged from her mother's workshop before the water took the lower wards. Below the planks, the tide breathed. People said the drowned city still kept its lamps lit.\n\nMira looked anyway. That was the trouble with her: she looked at things others had agreed to forget." },
      { id: "n1c2", title: "The Cartographer's Debt", price: 8, locked: true, body: "Old Bren spread the map across the table, and the candlelight found every place the sea had erased.\n\n\"This is what's left,\" he said. \"And this, his finger drifted into the blue nothing, is what you're asking me to draw. A road no living hand has charted.\"\n\nMira set four coins between them. \"Draw it badly, then. I only need to know which way the lanterns lie.\"" },
      { id: "n1c3", title: "What the Tide Returns", price: 12, locked: true, body: "The water did not part for her. It simply remembered her shape, and let her through.\n\nWhat she found below was not a ruin. It was a city holding its breath, every window lit, as though the ocean were merely a long, patient night, and morning had been promised after all." },
    ]},
    { id: "n2", authorId: "ravenquill", title: "Iron Saints, Paper Gods", tagline: "A forger discovers his counterfeits are coming true.", genre: "Urban Fantasy", cover: "#3a1f1f", likes: 21, powerStones: 88, views: 540, createdAt: 8, comments: {}, reviews: [], chapters: [
      { id: "n2c1", title: "A Convincing Forgery", price: 0, locked: false, body: "Kessler could forge any seal in the city, and had, bishops, banks, a duke's own signet once.\n\nBut the seal he pressed tonight was one he'd invented. A god that did not exist. He stamped it in red wax and laughed at his own craftsmanship.\n\nIn the morning, three people swore they had prayed there as children." },
      { id: "n2c2", title: "The Tithe", price: 10, locked: true, body: "The invented church now stood on Harrow Street, between a bakery and a debt it should not have been able to cast." },
    ]},
    { id: "n3", authorId: "ravenquill", title: "Vacuum Sonata", tagline: "The last orchestra broadcasts into a dying solar system.", genre: "Sci-Fi", cover: "#1f2a3a", likes: 14, powerStones: 51, views: 300, createdAt: 11, comments: {}, reviews: [], chapters: [
      { id: "n3c1", title: "First Movement", price: 0, locked: false, body: "The cellist had been dead for two years, but her part still played, a recording, looping, while the living filled in around her absence.\n\nThat was the rule of the Vacuum Sonata: no one stops. Not even for grief. Especially not for grief." },
    ]},
  ],
  threads: [
    { id: "t1", category: "announcements", title: "New novel: The Lantern Below the Tide is live!", author: "Raven Quill", authorId: "ravenquill", body: "Just published the first three chapters of a drowned-city fantasy I've been writing for two years. Chapter one is free - would love your thoughts.", novelId: "n1", upvotes: 12, pinned: true, createdAt: 6, replies: [{ user: "Ilse", body: "Read it in one sitting. The prose glows.", at: 7 }] },
    { id: "t2", category: "recommendations", title: "Underrated sci-fi gems?", author: "Ilse", authorId: "ilse_demo", body: "Looking for character-driven sci-fi, not just space battles. Drop your favourites.", novelId: "n3", upvotes: 5, pinned: false, createdAt: 9, replies: [] },
  ],
};

function App() {
  const [db, setDB] = useState(null);
  const [session, setSession] = useState(null);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState({ name: "home" });
  const [toast, setToast] = useState(null);
  const scrollRef = useRef(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => { (async () => {
    const d = await loadDB(); const used = d && d.novels ? d : SEED;
    if (!d) await saveDB(SEED);
    setDB(used); setSession(await loadSession());
    const p = await loadPrefs(); if (p) setPrefs({ ...DEFAULT_PREFS, ...p });
    setLoading(false);
  })(); }, []);

  const persist = useCallback(async (next) => { setDB(next); await saveDB(next); }, []);
  const persistPrefs = useCallback(async (p) => { setPrefs(p); await savePrefs(p); }, []);
  const flash = (msg, kind = "ok") => { setToast({ msg, kind }); setTimeout(() => setToast(null), 3000); };
  const onScroll = (e) => setShowTop(e.target.scrollTop > 400);
  const toTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }); }, [view]);

  if (loading || !db) return (
    <div style={S.loadWrap}><Feather size={40} style={{ opacity: 0.5 }} />
      <div style={{ marginTop: 16, letterSpacing: 3, fontSize: 13, opacity: 0.6 }}>OPENING THE LIBRARY...</div></div>
  );

  const signup = async ({ name, email, pass }) => {
    const id = email.trim().toLowerCase();
    if (db.users[id]) { flash("That email is already registered. Try logging in.", "err"); return false; }
    const next = structuredClone(db);
    next.users[id] = blankUser({ id, name: name.trim(), email: id, pass: lightHash(pass), createdAt: Date.now(), giftsReceived: 0, coinsEarned: 0 });
    await persist(next);
    const sess = { userId: id, role: "reader" }; setSession(sess); await saveSession(sess);
    flash(`Welcome, ${name}! Starter gift: 50${COIN} + 20${STONE}.`); setView({ name: "home" }); return true;
  };
  const login = async ({ email, pass }) => {
    const id = email.trim().toLowerCase(); const u = db.users[id];
    if (!u || u.pass !== lightHash(pass)) { flash("Wrong email or password.", "err"); return false; }
    const sess = { userId: id, role: "reader" }; setSession(sess); await saveSession(sess);
    flash(`Welcome back, ${u.name}.`); setView({ name: "home" }); return true;
  };
  const logout = async () => { setSession(null); await saveSession(null); setView({ name: "home" }); flash("Signed out."); };
  const switchRole = async () => {
    const role = session.role === "reader" ? "author" : "reader";
    const sess = { ...session, role }; setSession(sess); await saveSession(sess);
    setView({ name: role === "author" ? "studio" : "home" }); flash(`Switched to ${role} mode.`);
  };

  if (!session) return (
    <div style={S.root}><style>{CSS}</style>
      <AuthScreen onLogin={login} onSignup={signup} />
      {toast && <Toast toast={toast} />}
    </div>
  );

  const me = db.users[session.userId];
  const isReader = session.role === "reader";
  const hasPurchased = (cid) => (me.purchases || []).includes(cid);
  const isBookmarked = (nid) => (me.bookmarks || []).includes(nid);
  const canRead = (novel, ch) => !ch.locked || ch.price === 0 || novel.authorId === me.id || hasPurchased(ch.id);

  const toggleBookmark = (nid) => {
    const next = structuredClone(db); const u = next.users[me.id]; u.bookmarks = u.bookmarks || [];
    u.bookmarks = u.bookmarks.includes(nid) ? u.bookmarks.filter(x => x !== nid) : [...u.bookmarks, nid];
    persist(next); flash(u.bookmarks.includes(nid) ? "Bookmarked." : "Removed bookmark.");
  };
  const purchaseChapter = (novel, ch) => {
    if (!me.payment?.connected) { flash("Connect a payment method first (Wallet).", "err"); setView({ name: "wallet" }); return false; }
    if (me.wallet < ch.price) { flash(`Not enough ${COIN}. Top up or check in daily for free coins.`, "err"); setView({ name: "wallet" }); return false; }
    const next = structuredClone(db); const reader = next.users[me.id];
    reader.wallet -= ch.price; next.users[novel.authorId].wallet += ch.price; next.users[novel.authorId].coinsEarned = (next.users[novel.authorId].coinsEarned || 0) + ch.price;
    reader.purchases = [...(reader.purchases || []), ch.id];
    persist(next); flash(`Unlocked "${ch.title}" - ${ch.price}${COIN} sent straight to ${next.users[novel.authorId].name}.`); return true;
  };
  const toggleLock = (nid, cid) => {
    const next = structuredClone(db); const ch = next.novels.find(n => n.id === nid).chapters.find(c => c.id === cid);
    ch.locked = !ch.locked; if (ch.locked && ch.price === 0) ch.price = 5;
    persist(next); flash(ch.locked ? `Locked at ${ch.price}${COIN}.` : "Now free to read.");
  };
  const topUp = (amt) => { const next = structuredClone(db); next.users[me.id].wallet += amt; persist(next); flash(`Added ${amt}${COIN}.`); };
  const connectPayment = (data) => { const next = structuredClone(db); next.users[me.id].payment = { connected: true, ...data }; persist(next); flash("Payment method connected securely."); };
  const disconnectPayment = () => { const next = structuredClone(db); next.users[me.id].payment = { connected: false }; persist(next); flash("Payment method disconnected."); };
  const checkin = () => {
    if (me.lastCheckin === today()) { flash("Already checked in today. Come back tomorrow!", "err"); return; }
    const next = structuredClone(db); const u = next.users[me.id];
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    u.streak = u.lastCheckin === yesterday ? (u.streak || 0) + 1 : 1; u.lastCheckin = today();
    const coins = 5 + Math.min(u.streak - 1, 5); const stones = 3;
    u.wallet += coins; u.stones = (u.stones || 0) + stones;
    persist(next); flash(`Day ${u.streak} check-in! +${coins}${COIN} +${stones}${STONE}`);
  };
  const votePower = (nid) => {
    if ((me.stones || 0) < 1) { flash(`No power stones left. Check in daily to earn more.`, "err"); return; }
    const next = structuredClone(db); next.users[me.id].stones -= 1; next.novels.find(n => n.id === nid).powerStones += 1;
    persist(next); flash(`+1${STONE} power stone cast!`);
  };
  const sendGift = (novel, gift) => {
    if (me.wallet < gift.cost) { flash(`Not enough ${COIN} for that gift.`, "err"); return; }
    const next = structuredClone(db); next.users[me.id].wallet -= gift.cost; next.users[me.id].giftsSent = (next.users[me.id].giftsSent || 0) + 1;
    next.users[novel.authorId].wallet += gift.cost; next.users[novel.authorId].coinsEarned = (next.users[novel.authorId].coinsEarned || 0) + gift.cost;
    next.users[novel.authorId].giftsReceived = (next.users[novel.authorId].giftsReceived || 0) + 1;
    persist(next); flash(`Sent ${gift.icon} ${gift.name} - ${gift.cost}${COIN} to ${next.users[novel.authorId].name}!`);
  };
  const addComment = (nid, cid, text) => {
    const next = structuredClone(db); const nv = next.novels.find(n => n.id === nid);
    nv.comments = nv.comments || {}; nv.comments[cid] = nv.comments[cid] || [];
    nv.comments[cid].unshift({ user: me.name, text, at: Date.now() }); persist(next);
  };
  const rateNovel = (nid, stars, text) => {
    const next = structuredClone(db); const u = next.users[me.id]; const nv = next.novels.find(n => n.id === nid);
    u.ratings = u.ratings || {}; u.ratings[nid] = stars;
    nv.reviews = (nv.reviews || []).filter(r => r.user !== me.name);
    nv.reviews.unshift({ user: me.name, stars, text: text || "", at: Date.now() });
    persist(next); flash(`Rated ${stars}\u2605. Thanks for the review!`);
  };
  const markRead = (nid, cid) => {
    const next = structuredClone(db); const u = next.users[me.id];
    u.progress = { ...(u.progress || {}), [nid]: cid };
    u.history = [{ nid, cid, at: Date.now() }, ...(u.history || []).filter(h => !(h.nid === nid && h.cid === cid))].slice(0, 40);
    persist(next);
  };
  const addToList = (listName, nid) => {
    const next = structuredClone(db); const u = next.users[me.id]; u.lists = u.lists || {};
    u.lists[listName] = u.lists[listName] || []; if (!u.lists[listName].includes(nid)) u.lists[listName].push(nid);
    persist(next); flash(`Added to "${listName}".`);
  };
  const removeFromList = (listName, nid) => {
    const next = structuredClone(db); const u = next.users[me.id];
    u.lists[listName] = (u.lists[listName] || []).filter(x => x !== nid);
    if (u.lists[listName].length === 0) delete u.lists[listName];
    persist(next);
  };
  // --- reader: follow author, read-marks, chapter likes, comment reply/report ---
  const toggleFollow = (authorId) => {
    const next = structuredClone(db); const u = next.users[me.id]; u.follows = u.follows || [];
    u.follows = u.follows.includes(authorId) ? u.follows.filter(x => x !== authorId) : [...u.follows, authorId];
    persist(next); flash(u.follows.includes(authorId) ? "Following author." : "Unfollowed.");
  };
  const toggleReadMark = (cid) => {
    const next = structuredClone(db); const u = next.users[me.id]; u.readMarks = u.readMarks || [];
    u.readMarks = u.readMarks.includes(cid) ? u.readMarks.filter(x => x !== cid) : [...u.readMarks, cid];
    persist(next);
  };
  const toggleChapterLike = (cid) => {
    const next = structuredClone(db); const u = next.users[me.id]; u.chapterLikes = u.chapterLikes || [];
    u.chapterLikes = u.chapterLikes.includes(cid) ? u.chapterLikes.filter(x => x !== cid) : [...u.chapterLikes, cid];
    persist(next);
  };
  const countView = (nid, cid) => {
    const next = structuredClone(db); const nv = next.novels.find(n => n.id === nid);
    if (!nv) return; nv.views = (nv.views || 0) + 1;
    const ch = nv.chapters.find(c => c.id === cid); if (ch) ch.views = (ch.views || 0) + 1;
    persist(next);
  };
  // --- author studio actions ---
  const reorderChapter = (nid, idx, dir) => {
    const next = structuredClone(db); const ch = next.novels.find(n => n.id === nid).chapters;
    const j = idx + dir; if (j < 0 || j >= ch.length) return;
    [ch[idx], ch[j]] = [ch[j], ch[idx]]; persist(next);
  };
  const duplicateChapter = (nid, cid) => {
    const next = structuredClone(db); const nv = next.novels.find(n => n.id === nid);
    const i = nv.chapters.findIndex(c => c.id === cid); const src = nv.chapters[i];
    nv.chapters.splice(i + 1, 0, { ...src, id: "c" + Date.now(), title: src.title + " (copy)", draft: true });
    persist(next); flash("Chapter duplicated as a draft.");
  };
  const toggleDraft = (nid, cid) => {
    const next = structuredClone(db); const ch = next.novels.find(n => n.id === nid).chapters.find(c => c.id === cid);
    ch.draft = !ch.draft; persist(next); flash(ch.draft ? "Moved to draft (hidden)." : "Published.");
  };
  const bulkLock = (nid, lock) => {
    const next = structuredClone(db); next.novels.find(n => n.id === nid).chapters.forEach(c => { c.locked = lock; if (lock && c.price === 0) c.price = 5; }); persist(next); flash(lock ? "All chapters locked." : "All chapters freed.");
  };
  const setAllPrices = (nid, price) => {
    const next = structuredClone(db); next.novels.find(n => n.id === nid).chapters.forEach(c => { c.price = Math.max(0, Number(price) || 0); c.locked = c.price > 0; }); persist(next); flash(`All chapters set to ${price}${COIN}.`);
  };
  const setPinNote = (nid, note) => {
    const next = structuredClone(db); next.novels.find(n => n.id === nid).pinned = note; persist(next); flash(note ? "Announcement pinned." : "Announcement cleared.");
  };
  const saveBio = (bio) => { const next = structuredClone(db); next.users[me.id].bio = bio; persist(next); flash("Bio saved."); };
  // --- forum ---
  const createThread = (data) => {
    const next = structuredClone(db); next.threads = next.threads || [];
    next.threads.unshift({ id: "t" + Date.now(), category: data.category, title: data.title, author: me.name, authorId: me.id, body: data.body, novelId: data.novelId || "", upvotes: 0, pinned: false, createdAt: Date.now(), replies: [] });
    persist(next); flash("Posted to the forum.");
  };
  const replyThread = (tid, body) => {
    const next = structuredClone(db); const th = next.threads.find(t => t.id === tid);
    th.replies = th.replies || []; th.replies.push({ user: me.name, body, at: Date.now() }); persist(next);
  };
  const upvoteThread = (tid) => {
    const next = structuredClone(db); const u = next.users[me.id]; u.upvoted = u.upvoted || [];
    const th = next.threads.find(t => t.id === tid);
    if (u.upvoted.includes(tid)) { th.upvotes = Math.max(0, th.upvotes - 1); u.upvoted = u.upvoted.filter(x => x !== tid); }
    else { th.upvotes += 1; u.upvoted.push(tid); }
    persist(next);
  };
  const deleteThread = (tid) => {
    const next = structuredClone(db); next.threads = next.threads.filter(t => t.id !== tid); persist(next); flash("Thread deleted.");
  };
  // --- shareable library ---
  const shareLibrary = async () => {
    const code = makeCode();
    const novelIds = Array.from(new Set([...(me.bookmarks || []), ...Object.values(me.lists || {}).flat()]));
    const items = novelIds.map(id => { const n = db.novels.find(x => x.id === id); return n ? { id: n.id, title: n.title, tagline: n.tagline, genre: n.genre, cover: n.cover, coverImg: n.coverImg || "" } : null; }).filter(Boolean);
    const ok = await publishShelf(code, { owner: me.name, items, lists: me.lists || {}, at: Date.now() });
    if (ok) { const next = structuredClone(db); next.users[me.id].shareCode = code; persist(next); flash(`Library published! Share code: ${code}`); }
    else flash("Couldn't publish library.", "err");
    return code;
  };
  const importShelf = async (code, addBookmarks) => {
    const shelf = await fetchShelf(code.trim().toUpperCase());
    if (!shelf) { flash("No library found for that code.", "err"); return; }
    if (addBookmarks) { const next = structuredClone(db); const u = next.users[me.id]; u.bookmarks = Array.from(new Set([...(u.bookmarks || []), ...shelf.items.map(i => i.id).filter(id => next.novels.some(n => n.id === id))])); persist(next); }
    flash(`Loaded ${shelf.owner}'s library (${shelf.items.length} titles).`);
    return shelf;
  };

  return (
    <div style={S.root}><style>{CSS}</style>
      <Header me={me} role={session.role} view={view} setView={setView} onSwitch={switchRole} onLogout={logout} onCheckin={checkin} />
      <main ref={scrollRef} onScroll={onScroll} style={S.main}>
        <div style={S.inner}>
          {view.name === "home" && <Home db={db} me={me} isBookmarked={isBookmarked} onToggleBookmark={toggleBookmark} onOpen={(id) => setView({ name: "novel", id })} setView={setView} />}
          {view.name === "rankings" && <Rankings db={db} onOpen={(id) => setView({ name: "novel", id })} />}
          {view.name === "bookmarks" && <Bookmarks db={db} me={me} onToggleBookmark={toggleBookmark} onOpen={(id) => setView({ name: "novel", id })} />}
          {view.name === "lists" && <Lists db={db} me={me} onOpen={(id) => setView({ name: "novel", id })} onRemove={removeFromList} onShare={shareLibrary} onImport={importShelf} />}
          {view.name === "assistant" && <Assistant db={db} me={me} role={session.role} onOpen={(id) => setView({ name: "novel", id })} />}
          {view.name === "history" && <HistoryPage db={db} me={me} setView={setView} />}
          {view.name === "following" && <Following db={db} me={me} isBookmarked={isBookmarked} onToggleBookmark={toggleBookmark} onOpen={(id) => setView({ name: "novel", id })} onFollow={toggleFollow} />}
          {view.name === "forum" && <Forum db={db} me={me} onOpen={(id) => setView({ name: "novel", id })} onCreate={createThread} onReply={replyThread} onUpvote={upvoteThread} onDelete={deleteThread} />}
          {view.name === "how" && <HowItWorks setView={setView} />}
          {view.name === "legal" && <Legal />}
          {view.name === "novel" && (() => { const novel = db.novels.find(n => n.id === view.id); if (!novel) return null; return (
            <NovelPage novel={novel} authorName={db.users[novel.authorId].name} me={me} db={db} canRead={canRead} hasPurchased={hasPurchased} isBookmarked={isBookmarked}
              onToggleBookmark={() => toggleBookmark(novel.id)} onBack={() => setView({ name: "home" })}
              onRead={(cid) => setView({ name: "read", novelId: novel.id, chapId: cid })} onPurchase={(ch) => purchaseChapter(novel, ch)}
              onLike={() => { const next = structuredClone(db); next.novels.find(n => n.id === novel.id).likes++; persist(next); }}
              onVote={() => votePower(novel.id)} onGift={(g) => sendGift(novel, g)} onRate={(s, t) => rateNovel(novel.id, s, t)}
              onAddToList={(l) => addToList(l, novel.id)} onFollow={() => toggleFollow(novel.authorId)} isFollowing={(me.follows || []).includes(novel.authorId)}
              onToggleReadMark={toggleReadMark} flash={flash} />
          ); })()}
          {view.name === "read" && (() => { const novel = db.novels.find(n => n.id === view.novelId); if (!novel) return null; return (
            <Reader db={db} novel={novel} chapId={view.chapId} me={me} prefs={prefs} setPrefs={persistPrefs} onBack={() => setView({ name: "novel", id: view.novelId })}
              onNav={(cid) => setView({ name: "read", novelId: novel.id, chapId: cid })} onComment={(t) => addComment(novel.id, view.chapId, t)}
              onMarkRead={() => markRead(novel.id, view.chapId)} onView={() => countView(novel.id, view.chapId)}
              onChapterLike={toggleChapterLike} flash={flash} />
          ); })()}
          {view.name === "studio" && (isReader ? <RoleGate onSwitch={switchRole} /> : <Studio db={db} me={me} persist={persist} flash={flash} onToggleLock={toggleLock} onOpen={(id) => setView({ name: "novel", id })}
            onReorder={reorderChapter} onDuplicate={duplicateChapter} onToggleDraft={toggleDraft} onBulkLock={bulkLock} onSetAllPrices={setAllPrices} onPin={setPinNote} onSaveBio={saveBio} />)}
          {view.name === "wallet" && <WalletPage db={db} me={me} onTopUp={topUp} onConnect={connectPayment} onDisconnect={disconnectPayment} onCheckin={checkin} />}
        </div>
        {showTop && <button className="totop" style={S.toTop} onClick={toTop} title="Back to top"><ArrowUp size={20} /></button>}
      </main>
      {toast && <Toast toast={toast} />}
      <footer style={S.footer}><Sparkles size={12} /> Coins go straight to authors - InkVein takes <b style={{ color: "var(--gold)" }}>&nbsp;0%</b>.
        <button className="linkbtn" onClick={() => setView({ name: "how" })}>How it works</button> .
        <button className="linkbtn" onClick={() => setView({ name: "legal" })}>Copyright & Terms</button></footer>
    </div>
  );
}

function AuthScreen({ onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", pass: "" });
  const [show, setShow] = useState(false);
  const submit = () => { mode === "login" ? onLogin(f) : onSignup(f); };
  const valid = mode === "login" ? f.email && f.pass : f.name && f.email && f.pass.length >= 6;
  return (
    <div style={S.authWrap}><div style={S.authGrain} />
      <div style={S.authCard} className="fade-up">
        <div style={S.authBrand}><span style={S.brandMark}><Feather size={22} /></span>
          <span style={{ fontFamily: "var(--display)", fontSize: 30 }}>Ink<span style={{ color: "var(--gold)" }}>Vein</span></span></div>
        <p style={{ textAlign: "center", color: "var(--ink-soft)", marginTop: -6, marginBottom: 26, fontStyle: "italic" }}>
          {mode === "login" ? "Welcome back to the library." : "Stories that pay their tellers."}</p>
        <div style={S.authTabs}>
          <button onClick={() => setMode("login")} style={authTab(mode === "login")}>Log in</button>
          <button onClick={() => setMode("signup")} style={authTab(mode === "signup")}>Sign up</button></div>
        {mode === "signup" && <input style={S.input} placeholder="Display name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />}
        <input style={S.input} type="email" placeholder="Email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
        <div style={{ position: "relative" }}>
          <input style={S.input} type={show ? "text" : "password"} placeholder={mode === "signup" ? "Password (min 6 chars)" : "Password"} value={f.pass}
            onChange={e => setF({ ...f, pass: e.target.value })} onKeyDown={e => e.key === "Enter" && valid && submit()} />
          <button onClick={() => setShow(!show)} style={S.eyeBtn} title="Show/hide"><Eye size={16} /></button></div>
        <button className="primary" style={{ ...S.bigBtn, width: "100%", justifyContent: "center", marginTop: 6 }} disabled={!valid} onClick={submit}>
          {mode === "login" ? "Log in" : "Create account"}</button>
        <div style={S.secureNote}><ShieldCheck size={13} /> Passwords are hashed locally. Front-end demo - wire a backend for production security.</div>
        {mode === "login" && <div style={S.demoBox}><b style={{ color: "var(--gold)" }}>Demo author login</b><br />raven@ink.io &nbsp;.&nbsp; demo1234</div>}
      </div>
    </div>
  );
}

function Header({ me, role, view, setView, onSwitch, onLogout, onCheckin }) {
  const checkedIn = me.lastCheckin === today();
  const tabs = [["home", "Library", <Library size={15} key="a" />], ["rankings", "Rankings", <Trophy size={15} key="b" />], ["forum", "Forum", <MessageSquare size={15} key="g" />], ["assistant", "AI", <Bot size={15} key="i" />], ["following", "Following", <Users size={15} key="f" />], ["lists", "Lists", <ListPlus size={15} key="c" />], ["bookmarks", "Saved", <Bookmark size={15} key="d" />], ["history", "History", <History size={15} key="e" />]];
  return (
    <header style={S.header}>
      <div style={S.brand} onClick={() => setView({ name: "home" })}>
        <span style={S.brandMark}><Feather size={20} /></span>
        <span style={S.brandName}>Ink<span style={{ color: "var(--gold)" }}>Vein</span></span></div>
      <nav style={S.nav}>
        {tabs.map(([id, label, icon]) => <button key={id} className="navbtn" style={navStyle(view.name === id)} onClick={() => setView({ name: id })}>{icon}<span>{label}</span></button>)}
        {role === "author" && <button className="navbtn" style={navStyle(view.name === "studio")} onClick={() => setView({ name: "studio" })}><Feather size={15} /><span>Studio</span></button>}
        <button className="navbtn" style={navStyle(view.name === "wallet")} onClick={() => setView({ name: "wallet" })}><Wallet size={15} /><span>{me.wallet}{COIN}</span></button></nav>
      <div style={S.who}>
        <span style={S.stoneTag} title="Power stones"><Zap size={13} /> {me.stones || 0}</span>
        <button className={checkedIn ? "ghost" : "primary"} style={S.checkinBtn} onClick={onCheckin} title="Daily check-in">
          <CalendarCheck size={14} /> {checkedIn ? "Done" : "Check in"}{me.streak > 0 && <span style={S.streakDot}><Flame size={11} /> {me.streak}</span>}</button>
        <button className="ghost" style={S.roleBtn} onClick={onSwitch} title="Switch mode"><Repeat size={13} /> {role === "reader" ? "Reader" : "Author"}</button>
        <div style={S.avatar} title={me.name}>{me.name[0]?.toUpperCase()}</div>
        <button className="ghost" style={S.iconBtn} onClick={onLogout} title="Log out"><LogOut size={15} /></button></div>
    </header>
  );
}

function novelStats(n) {
  const words = n.chapters.reduce((s, c) => s + wordCount(c.body), 0);
  const avg = n.reviews && n.reviews.length ? (n.reviews.reduce((s, r) => s + r.stars, 0) / n.reviews.length) : 0;
  return { words, mins: readMins(words), avg };
}

function Home({ db, me, isBookmarked, onToggleBookmark, onOpen, setView }) {
  const [q, setQ] = useState(""); const [open, setOpen] = useState(false);
  const [inc, setInc] = useState([]); const [exc, setExc] = useState([]);
  const [minCh, setMinCh] = useState(""); const [maxCh, setMaxCh] = useState("");
  const [freeOnly, setFreeOnly] = useState(false); const [sort, setSort] = useState("power");
  const toggle = (list, set, g) => set(list.includes(g) ? list.filter(x => x !== g) : [...list, g]);
  const reset = () => { setInc([]); setExc([]); setMinCh(""); setMaxCh(""); setFreeOnly(false); setSort("power"); setQ(""); };

  const continueNovel = useMemo(() => {
    const entries = Object.entries(me.progress || {}); if (!entries.length) return null;
    const [nid, cid] = entries[entries.length - 1];
    const novel = db.novels.find(n => n.id === nid); if (!novel) return null;
    const ch = novel.chapters.find(c => c.id === cid); return ch ? { novel, ch } : null;
  }, [db.novels, me.progress]);

  // recommendations by genres in reading history
  const recs = useMemo(() => {
    const readNids = new Set((me.history || []).map(h => h.nid));
    const likedGenres = new Set(db.novels.filter(n => readNids.has(n.id)).map(n => n.genre));
    if (!likedGenres.size) return [];
    return db.novels.filter(n => likedGenres.has(n.genre) && !readNids.has(n.id)).slice(0, 4);
  }, [db.novels, me.history]);

  const recent = useMemo(() => [...db.novels].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4), [db.novels]);
  const surprise = () => { const n = db.novels[Math.floor(Math.random() * db.novels.length)]; if (n) onOpen(n.id); };

  const results = useMemo(() => {
    let r = db.novels.filter(n => {
      const text = (n.title + " " + n.tagline + " " + n.genre + " " + (n.tags || []).join(" ")).toLowerCase();
      if (q.trim() && !text.includes(q.trim().toLowerCase())) return false;
      if (inc.length && !inc.includes(n.genre)) return false;
      if (exc.length && exc.includes(n.genre)) return false;
      const count = n.chapters.length;
      if (minCh !== "" && count < Number(minCh)) return false;
      if (maxCh !== "" && count > Number(maxCh)) return false;
      if (freeOnly && !n.chapters.some(c => !c.locked || c.price === 0)) return false;
      return true;
    });
    r = [...r].sort((a, b) => sort === "power" ? b.powerStones - a.powerStones : sort === "popular" ? b.likes - a.likes : sort === "newest" ? b.createdAt - a.createdAt : sort === "rating" ? novelStats(b).avg - novelStats(a).avg : a.title.localeCompare(b.title));
    return r;
  }, [db.novels, q, inc, exc, minCh, maxCh, freeOnly, sort]);

  const activeFilters = inc.length + exc.length + (minCh !== "" ? 1 : 0) + (maxCh !== "" ? 1 : 0) + (freeOnly ? 1 : 0);
  return (
    <div className="fade-up">
      <section style={S.hero}><div style={S.heroGrain} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={S.kicker}>SERIAL FICTION . DIRECT TO AUTHOR</div>
          <h1 style={S.heroTitle}>Stories that pay<br />their tellers.</h1>
          <p style={S.heroSub}>Read freely until an author marks a chapter worth a coin. Vote, gift, build reading lists - every coin lands in the writer's pocket whole.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
            <button className="primary" style={S.heroBtn} onClick={surprise}><Shuffle size={15} /> Surprise me</button>
            <button className="ghost" style={S.heroBtn} onClick={() => setView({ name: "how" })}><HelpCircle size={15} /> How it works</button></div></div></section>

      {continueNovel && (
        <div style={S.continueCard} className="fade-up" onClick={() => setView({ name: "read", novelId: continueNovel.novel.id, chapId: continueNovel.ch.id })}>
          <div style={{ ...S.miniCover, background: coverBg(continueNovel.novel), width: 52, height: 68 }} />
          <div style={{ flex: 1 }}><div style={{ fontSize: 12, letterSpacing: 1, color: "var(--gold)", display: "flex", alignItems: "center", gap: 6 }}><Clock size={12} /> CONTINUE READING</div>
            <div style={{ fontFamily: "var(--display)", fontSize: 19, marginTop: 3 }}>{continueNovel.novel.title}</div>
            <div style={{ color: "var(--ink-soft)", fontSize: 13 }}>{continueNovel.ch.title}</div></div>
          <BookMarked size={20} style={{ color: "var(--gold)" }} /></div>
      )}

      {recs.length > 0 && (<><h3 style={S.shelfTitle}><Sparkle size={16} style={{ color: "var(--gold)" }} /> Recommended for you</h3>
        <NovelGrid novels={recs} isBookmarked={isBookmarked} onToggleBookmark={onToggleBookmark} onOpen={onOpen} /></>)}

      <h3 style={S.shelfTitle}><Sparkles size={16} style={{ color: "var(--gold)" }} /> Recently added</h3>
      <NovelGrid novels={recent} isBookmarked={isBookmarked} onToggleBookmark={onToggleBookmark} onOpen={onOpen} />

      <h3 style={S.shelfTitle}><Library size={16} style={{ color: "var(--gold)" }} /> Browse all</h3>
      <div style={S.searchRow}>
        <div style={S.searchBox}><Search size={16} style={{ opacity: 0.5 }} />
          <input placeholder="Search by name, genre, or theme..." value={q} onChange={e => setQ(e.target.value)} style={S.searchInput} />
          {q && <button className="ghost" style={S.clearBtn} onClick={() => setQ("")}><X size={13} /></button>}</div>
        <button className="ghost" style={{ ...S.filterBtn, ...(open || activeFilters ? S.filterBtnActive : {}) }} onClick={() => setOpen(!open)}>
          <SlidersHorizontal size={15} /> Filters {activeFilters > 0 && <span style={S.badge}>{activeFilters}</span>}</button>
        <div style={S.sortBox}><ArrowUpDown size={14} style={{ opacity: 0.5 }} />
          <select value={sort} onChange={e => setSort(e.target.value)} style={S.sortSelect}>
            <option value="power">Power ranking</option><option value="popular">Most liked</option><option value="rating">Top rated</option><option value="newest">Newest</option><option value="title">Title A-Z</option></select></div></div>
      {open && (
        <div style={S.filterPanel} className="fade-up">
          <div><div style={S.filterLabel}>Include genres</div>
            <div style={S.chipWrap}>{GENRES.map(g => <button key={g} onClick={() => toggle(inc, setInc, g)} style={genreChip(inc.includes(g), "inc")}>{inc.includes(g) && <Plus size={11} />} {g}</button>)}</div></div>
          <div><div style={S.filterLabel}>Exclude genres</div>
            <div style={S.chipWrap}>{GENRES.map(g => <button key={g} onClick={() => toggle(exc, setExc, g)} style={genreChip(exc.includes(g), "exc")}>{exc.includes(g) && <Minus size={11} />} {g}</button>)}</div></div>
          <div style={{ display: "flex", gap: 26, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div><div style={S.filterLabel}>Chapters</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="number" min="0" placeholder="min" value={minCh} onChange={e => setMinCh(e.target.value)} style={S.numInput} />
                <span style={{ opacity: 0.4 }}>-</span>
                <input type="number" min="0" placeholder="max" value={maxCh} onChange={e => setMaxCh(e.target.value)} style={S.numInput} /></div></div>
            <label style={S.checkRow}><input type="checkbox" checked={freeOnly} onChange={e => setFreeOnly(e.target.checked)} style={{ accentColor: "#d4af6e", width: 16, height: 16 }} /> Has free chapters</label>
            <button className="ghost" style={S.smallBtn} onClick={reset}>Reset all</button></div></div>)}
      <div style={{ fontSize: 13, color: "var(--ink-soft)", margin: "4px 0 16px" }}>{results.length} {results.length === 1 ? "story" : "stories"}{q && ` matching "${q}"`}</div>
      <NovelGrid novels={results} isBookmarked={isBookmarked} onToggleBookmark={onToggleBookmark} onOpen={onOpen} emptyMsg="No stories match your filters." />
    </div>
  );
}

function NovelGrid({ novels, isBookmarked, onToggleBookmark, onOpen, emptyMsg }) {
  if (!novels.length) return emptyMsg ? <div style={S.empty}>{emptyMsg}</div> : null;
  return (
    <div style={S.grid}>
      {novels.map((n, i) => {
        const free = n.chapters.filter(c => !c.locked || c.price === 0).length; const saved = isBookmarked(n.id); const st = novelStats(n);
        return (
          <article key={n.id} className="card" style={{ ...S.card, animationDelay: `${i * 50}ms` }}>
            <div style={{ ...S.cardCover, background: coverBg(n) }} onClick={() => onOpen(n.id)}>
              <div style={S.coverGenre}>{n.genre}</div><div style={S.coverTitle}>{n.title}</div><div style={S.coverGlow} />
              <span style={S.powerBadge}><Zap size={11} /> {n.powerStones}</span>
              <button className="bookmarkbtn" style={S.bookmarkBtn} onClick={(e) => { e.stopPropagation(); onToggleBookmark(n.id); }} title={saved ? "Remove bookmark" : "Bookmark"}>
                {saved ? <BookmarkCheck size={16} style={{ color: "var(--gold)" }} /> : <Bookmark size={16} />}</button></div>
            <div style={S.cardBody} onClick={() => onOpen(n.id)}>
              <p style={S.cardTagline}>{n.tagline}</p>
              <div style={S.cardMeta}><span><BookOpen size={13} /> {n.chapters.length} ch</span>
                <span style={{ color: "var(--gold)" }}><Unlock size={13} /> {free} free</span>
                {st.avg > 0 && <span><Star size={13} style={{ color: "#e0a458" }} /> {st.avg.toFixed(1)}</span>}
                <span><Clock size={13} /> {st.mins}m</span></div></div>
          </article>
        );
      })}
    </div>
  );
}

function Rankings({ db, onOpen }) {
  const [tab, setTab] = useState("power");
  const sorted = [...db.novels].sort((a, b) => tab === "power" ? b.powerStones - a.powerStones : tab === "popular" ? b.likes - a.likes : tab === "rating" ? novelStats(b).avg - novelStats(a).avg : b.views - a.views);
  const tabs = [["power", "Power Stones", <Zap size={14} key="z" />], ["popular", "Most Liked", <Heart size={14} key="h" />], ["rating", "Top Rated", <Star size={14} key="s" />], ["trending", "Most Read", <Eye size={14} key="e" />]];
  return (
    <div className="fade-up">
      <h1 style={S.pageTitle}><Trophy size={22} style={{ color: "var(--gold)" }} /> Rankings</h1>
      <p style={{ color: "var(--ink-soft)", marginTop: 4, marginBottom: 20 }}>Readers push favourites up the board by voting, liking, rating, and reading.</p>
      <div style={S.rankTabs}>{tabs.map(([id, label, icon]) => (<button key={id} onClick={() => setTab(id)} style={rankTab(tab === id)}>{icon} {label}</button>))}</div>
      <div style={S.rankList}>
        {sorted.map((n, i) => { const st = novelStats(n); return (
          <div key={n.id} className="chaprow" style={S.rankRow} onClick={() => onOpen(n.id)}>
            <div style={{ ...S.rankNum, ...(i < 3 ? S.rankNumTop : {}) }}>{i < 3 ? <Crown size={18} /> : i + 1}</div>
            <div style={{ ...S.miniCover, background: coverBg(n), width: 44, height: 58 }} />
            <div style={{ flex: 1, minWidth: 120 }}><div style={{ fontFamily: "var(--display)", fontSize: 18 }}>{n.title}</div>
              <div style={{ color: "var(--ink-soft)", fontSize: 12.5 }}>{n.genre} . {n.chapters.length} ch</div></div>
            <div style={S.rankStat}>{tab === "power" ? <><Zap size={15} style={{ color: "var(--gold)" }} /> {n.powerStones}</> : tab === "popular" ? <><Heart size={15} style={{ color: "#e07a70" }} /> {n.likes}</> : tab === "rating" ? <><Star size={15} style={{ color: "#e0a458" }} /> {st.avg ? st.avg.toFixed(1) : "-"}</> : <><Eye size={15} style={{ color: "#6fcf97" }} /> {n.views}</>}</div>
          </div>); })}
      </div>
    </div>
  );
}

function Following({ db, me, isBookmarked, onToggleBookmark, onOpen, onFollow }) {
  const follows = me.follows || [];
  const authors = Object.values(db.users).filter(u => follows.includes(u.id));
  const announcements = [];
  db.novels.forEach(n => { if (follows.includes(n.authorId) && n.pinned) announcements.push({ author: db.users[n.authorId]?.name, novel: n.title, nid: n.id, text: n.pinned }); });
  return (
    <div className="fade-up">
      <h1 style={S.pageTitle}><Users size={22} style={{ color: "var(--gold)" }} /> Following</h1>
      <p style={{ color: "var(--ink-soft)", marginTop: 4, marginBottom: 22 }}>Updates and new work from authors you follow.</p>
      {authors.length === 0 ? <div style={S.empty}>You're not following anyone yet. Open a novel and hit "+ Follow" on the author.</div> : (
        <>
          {announcements.length > 0 && (<><h3 style={{ ...S.shelfTitle, marginTop: 0 }}><Bell size={16} style={{ color: "var(--gold)" }} /> Latest announcements</h3>
            {announcements.map((a, i) => (<div key={i} style={S.pinNote} onClick={() => onOpen(a.nid)}><Bell size={15} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 1 }} />
              <span><b style={{ color: "var(--gold)" }}>{a.author}</b> on <i>{a.novel}</i>: {a.text}</span></div>))}</>)}
          <h3 style={S.shelfTitle}><Users size={16} style={{ color: "var(--gold)" }} /> Authors you follow</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>{authors.map(a => (
            <div key={a.id} style={S.authorChip}><div style={S.avatar}>{a.name[0]?.toUpperCase()}</div><span style={{ fontWeight: 600 }}>{a.name}</span>
              <button className="ghost" style={{ ...S.smallBtn, padding: "4px 10px" }} onClick={() => onFollow(a.id)}>Unfollow</button></div>))}</div>
          <h3 style={S.shelfTitle}><BookOpen size={16} style={{ color: "var(--gold)" }} /> Their stories</h3>
          <NovelGrid novels={db.novels.filter(n => follows.includes(n.authorId))} isBookmarked={isBookmarked} onToggleBookmark={onToggleBookmark} onOpen={onOpen} emptyMsg="No stories from followed authors yet." />
        </>
      )}
    </div>
  );
}

const FORUM_CATS = [
  { id: "all", label: "All", icon: <Globe size={14} /> },
  { id: "recommendations", label: "Recommendations", icon: <ThumbsUp size={14} /> },
  { id: "announcements", label: "Author Announcements", icon: <Bell size={14} /> },
  { id: "discussion", label: "General Discussion", icon: <MessageSquare size={14} /> },
  { id: "writing", label: "Writing Craft", icon: <Feather size={14} /> },
  { id: "help", label: "Help & Feedback", icon: <HelpCircle size={14} /> },
];
const catLabel = (id) => (FORUM_CATS.find(c => c.id === id) || {}).label || id;

function Forum({ db, me, onOpen, onCreate, onReply, onUpvote, onDelete }) {
  const threads = db.threads || [];
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("active");
  const [composing, setComposing] = useState(false);
  const [open, setOpen] = useState(null); // thread id
  const [form, setForm] = useState({ category: "recommendations", title: "", body: "", novelId: "" });
  const [reply, setReply] = useState("");
  const upvoted = me.upvoted || [];

  const list = useMemo(() => {
    let r = threads.filter(t => (cat === "all" || t.category === cat) && (!q.trim() || (t.title + " " + t.body).toLowerCase().includes(q.trim().toLowerCase())));
    r = [...r].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (sort === "top" ? b.upvotes - a.upvotes : sort === "new" ? b.createdAt - a.createdAt : ((b.replies?.length || 0) + b.upvotes) - ((a.replies?.length || 0) + a.upvotes)));
    return r;
  }, [threads, cat, q, sort]);

  const myNovels = db.novels.filter(n => n.authorId === me.id);

  if (open) {
    const t = threads.find(x => x.id === open); if (!t) { setOpen(null); return null; }
    const linked = t.novelId ? db.novels.find(n => n.id === t.novelId) : null;
    return (
      <div className="fade-up">
        <button className="ghost" style={S.back} onClick={() => setOpen(null)}><ChevronLeft size={16} /> Forum</button>
        <div style={S.threadHead}>
          <span style={S.catTag}>{catLabel(t.category)}</span>
          <h1 style={{ ...S.novelTitle, fontSize: "clamp(24px,4vw,34px)", marginTop: 8 }}>{t.pinned && <Bell size={18} style={{ color: "var(--gold)", verticalAlign: 1, marginRight: 6 }} />}{t.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--ink-soft)", fontSize: 13, marginTop: 6 }}>
            <div style={S.commentAvatar}>{t.author[0]?.toUpperCase()}</div> {t.author} . {new Date(t.createdAt).toLocaleDateString()}
            {t.authorId === me.id && <button className="ghost" style={{ ...S.smallBtn, marginLeft: "auto" }} onClick={() => { onDelete(t.id); setOpen(null); }}><Trash2 size={13} /> Delete</button>}</div>
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink)", whiteSpace: "pre-wrap" }}>{t.body}</p>
        {linked && (<div style={S.linkedNovel} onClick={() => onOpen(linked.id)}>
          <div style={{ ...S.miniCover, background: coverBg(linked), width: 44, height: 58 }} />
          <div style={{ flex: 1 }}><div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: 1 }}>MENTIONED NOVEL</div>
            <div style={{ fontFamily: "var(--display)", fontSize: 18 }}>{linked.title}</div><div style={{ color: "var(--ink-soft)", fontSize: 12.5 }}>{linked.genre}</div></div>
          <Eye size={16} style={{ color: "var(--gold)" }} /></div>)}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 18 }}>
          <button className={upvoted.includes(t.id) ? "primary" : "ghost"} style={S.likeBtn} onClick={() => onUpvote(t.id)}><ThumbsUp size={14} /> {t.upvotes}</button>
          <span style={{ color: "var(--ink-soft)", fontSize: 13 }}><MessageSquare size={13} style={{ verticalAlign: -2 }} /> {t.replies?.length || 0} replies</span></div>

        <h3 style={{ ...S.chaptersHeading, fontSize: 18 }}>Replies</h3>
        <div style={S.commentBox}>
          <input style={{ ...S.input, marginBottom: 0 }} placeholder="Write a reply..." value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === "Enter" && reply.trim() && (onReply(t.id, reply.trim()), setReply(""))} />
          <button className="primary" style={S.smallBtn} disabled={!reply.trim()} onClick={() => { onReply(t.id, reply.trim()); setReply(""); }}><Send size={14} /></button></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
          {(!t.replies || t.replies.length === 0) && <div style={{ color: "var(--ink-soft)", fontSize: 13, fontStyle: "italic" }}>No replies yet. Start the conversation.</div>}
          {(t.replies || []).map((r, i) => (<div key={i} style={S.comment}><div style={S.commentAvatar}>{r.user[0]?.toUpperCase()}</div>
            <div><div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.user}</div><div style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 2, whiteSpace: "pre-wrap" }}>{r.body}</div></div></div>))}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div><h1 style={S.pageTitle}><MessageSquare size={22} style={{ color: "var(--gold)" }} /> Community Forum</h1>
          <p style={{ color: "var(--ink-soft)", marginTop: 4, fontSize: 14 }}>Recommend novels, announce new releases, talk craft - readers and authors together.</p></div>
        <button className="primary" style={{ ...S.bigBtn, marginBottom: 0 }} onClick={() => setComposing(!composing)}><PlusCircle size={16} /> {composing ? "Cancel" : "New Post"}</button></div>

      {composing && (
        <div style={{ ...S.form, marginTop: 18 }}>
          <select style={S.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {FORUM_CATS.filter(c => c.id !== "all").map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
          <input style={S.input} placeholder="Post title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea style={{ ...S.input, minHeight: 110, fontFamily: "var(--body)", resize: "vertical" }} placeholder="What's on your mind?" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
          <select style={S.input} value={form.novelId} onChange={e => setForm({ ...form, novelId: e.target.value })}>
            <option value="">Link a novel (optional)</option>
            {db.novels.map(n => <option key={n.id} value={n.id}>{n.title}{n.authorId === me.id ? " (yours)" : ""}</option>)}</select>
          <button className="primary" style={S.bigBtn} disabled={!form.title.trim() || !form.body.trim()} onClick={() => { onCreate({ ...form, title: form.title.trim(), body: form.body.trim() }); setForm({ category: "recommendations", title: "", body: "", novelId: "" }); setComposing(false); }}><Send size={15} /> Post to Forum</button>
        </div>
      )}

      <div style={{ ...S.rankTabs, marginTop: 20 }}>{FORUM_CATS.map(c => (
        <button key={c.id} onClick={() => setCat(c.id)} style={rankTab(cat === c.id)}>{c.icon} {c.label}</button>))}</div>

      <div style={S.searchRow}>
        <div style={S.searchBox}><Search size={16} style={{ opacity: 0.5 }} />
          <input placeholder="Search posts..." value={q} onChange={e => setQ(e.target.value)} style={S.searchInput} /></div>
        <div style={S.sortBox}><ArrowUpDown size={14} style={{ opacity: 0.5 }} />
          <select value={sort} onChange={e => setSort(e.target.value)} style={S.sortSelect}>
            <option value="active">Most active</option><option value="top">Top voted</option><option value="new">Newest</option></select></div></div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
        {list.length === 0 && <div style={S.empty}>No posts here yet. Be the first to start a thread.</div>}
        {list.map(t => { const linked = t.novelId ? db.novels.find(n => n.id === t.novelId) : null; return (
          <div key={t.id} className="chaprow" style={S.threadRow} onClick={() => setOpen(t.id)}>
            <div style={S.voteBox} onClick={(e) => { e.stopPropagation(); onUpvote(t.id); }}>
              <ThumbsUp size={15} style={{ color: upvoted.includes(t.id) ? "var(--gold)" : "var(--ink-soft)" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: upvoted.includes(t.id) ? "var(--gold)" : "var(--ink-soft)" }}>{t.upvotes}</span></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><span style={S.catTag}>{catLabel(t.category)}</span>{t.pinned && <Bell size={12} style={{ color: "var(--gold)" }} />}</div>
              <div style={{ fontFamily: "var(--display)", fontSize: 18, marginTop: 4 }}>{t.title}</div>
              <div style={{ color: "var(--ink-soft)", fontSize: 12.5, marginTop: 2 }}>by {t.author} . {t.replies?.length || 0} replies{linked ? ` . mentions "${linked.title}"` : ""}</div></div>
            <ChevronLeft size={16} style={{ transform: "rotate(180deg)", color: "var(--ink-soft)" }} /></div>); })}
      </div>
    </div>
  );
}

function Bookmarks({ db, me, onToggleBookmark, onOpen }) {
  const saved = db.novels.filter(n => (me.bookmarks || []).includes(n.id));
  return (
    <div className="fade-up">
      <h1 style={S.pageTitle}><Bookmark size={22} style={{ color: "var(--gold)" }} /> Saved Stories</h1>
      <p style={{ color: "var(--ink-soft)", marginTop: 4, marginBottom: 24 }}>Your bookmarked novels, ready when you are.</p>
      <NovelGrid novels={saved} isBookmarked={() => true} onToggleBookmark={onToggleBookmark} onOpen={onOpen} emptyMsg="No bookmarks yet - tap the ribbon on any story to save it." />
    </div>
  );
}

function Lists({ db, me, onOpen, onRemove, onShare, onImport }) {
  const lists = me.lists || {};
  const names = Object.keys(lists);
  const [code, setCode] = useState(""); const [imported, setImported] = useState(null); const [busy, setBusy] = useState(false);
  const myCode = me.shareCode;
  const copyLink = () => { const txt = `Check out my InkVein library - import code: ${myCode}`; if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => {}).catch(() => {}); };
  const doImport = async () => { setBusy(true); const s = await onImport(code, true); setImported(s || null); setBusy(false); };
  return (
    <div className="fade-up">
      <h1 style={S.pageTitle}><ListPlus size={22} style={{ color: "var(--gold)" }} /> Reading Lists</h1>
      <p style={{ color: "var(--ink-soft)", marginTop: 4, marginBottom: 20 }}>Organize stories into collections, then share your whole library with a code.</p>

      <div style={S.shareBox}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}><Link2 size={16} style={{ color: "var(--gold)" }} /> Share your library</div>
          <p style={{ color: "var(--ink-soft)", fontSize: 13, margin: "6px 0 10px" }}>Publish your saved novels and lists; anyone with the code can view and import them.</p>
          {myCode ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={S.codeChip}>{myCode}</span>
              <button className="ghost" style={S.smallBtn} onClick={copyLink}><Copy size={13} /> Copy link</button>
              <button className="ghost" style={S.smallBtn} onClick={onShare}><Repeat size={13} /> Re-publish</button></div>
          ) : <button className="primary" style={S.smallBtn} onClick={onShare}><Link2 size={14} /> Publish & get code</button>}
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}><Download size={16} style={{ color: "var(--gold)" }} /> Import a friend's library</div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input style={{ ...S.input, marginBottom: 0, textTransform: "uppercase" }} placeholder="Enter code (e.g. AB12CD)" value={code} onChange={e => setCode(e.target.value)} />
            <button className="primary" style={S.smallBtn} disabled={!code.trim() || busy} onClick={doImport}>{busy ? <Loader size={14} className="spin" /> : <Download size={14} />}</button></div>
          {imported && <div style={{ fontSize: 12.5, color: "#6fcf97", marginTop: 8 }}>Imported {imported.items.length} titles from {imported.owner} into your bookmarks.</div>}
        </div>
      </div>

      {names.length === 0 && <div style={S.empty}>No lists yet. Open a novel and use "Add to list" to start one.</div>}
      {names.map(name => (
        <div key={name} style={{ marginBottom: 32 }}>
          <h3 style={{ ...S.shelfTitle, marginTop: 0 }}><FolderPlus size={16} style={{ color: "var(--gold)" }} /> {name} <span style={{ fontSize: 13, color: "var(--ink-soft)", fontFamily: "var(--body)" }}>({lists[name].length})</span></h3>
          <div style={S.grid}>{lists[name].map(nid => { const n = db.novels.find(x => x.id === nid); if (!n) return null; return (
            <article key={nid} className="card" style={S.card}>
              <div style={{ ...S.cardCover, background: coverBg(n) }} onClick={() => onOpen(n.id)}>
                <div style={S.coverGenre}>{n.genre}</div><div style={S.coverTitle}>{n.title}</div><div style={S.coverGlow} /></div>
              <div style={S.cardBody}><p style={S.cardTagline}>{n.tagline}</p>
                <button className="ghost" style={S.smallBtn} onClick={() => onRemove(name, nid)}><Trash2 size={13} /> Remove</button></div>
            </article>); })}</div>
        </div>
      ))}
    </div>
  );
}

function Assistant({ db, me, role, onOpen }) {
  const isAuthor = role === "author";
  const [msgs, setMsgs] = useState([{ role: "assistant", text: isAuthor
    ? `Hi ${me.name}! I'm your writing companion. I can brainstorm plots, draft a blurb, suggest titles, or help you plan chapters. What are we working on?`
    : `Hi ${me.name}! I'm your reading guide. Tell me a mood or a favourite, and I'll suggest novels from the library - or help you decide what to read next.` }]);
  const [input, setInput] = useState(""); const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [msgs, busy]);

  const catalog = db.novels.map(n => `"${n.title}" (${n.genre}) by ${db.users[n.authorId]?.name || "?"}: ${n.tagline} [${n.chapters.length} ch, ${n.likes} likes]`).join("\n");
  const readerPrompts = ["Recommend something for a cozy night in", "What should I read next?", "I want a fast-paced thriller", "Surprise me with something unusual"];
  const authorPrompts = ["Brainstorm a plot twist for my story", "Write a 2-sentence blurb for a space fantasy", "Suggest 5 title ideas for a noir mystery", "How do I end a chapter on a hook?"];
  const chips = isAuthor ? authorPrompts : readerPrompts;

  const send = async (text) => {
    const q = (text ?? input).trim(); if (!q || busy) return;
    const history = [...msgs, { role: "user", text: q }];
    setMsgs(history); setInput(""); setBusy(true);
    const system = isAuthor
      ? `You are InkVein's AI writing assistant for a web-novel author named ${me.name}. Help with brainstorming, plot, character, blurbs, titles, pacing, and publishing strategy. Be concise, warm, and practical. Keep replies under ~150 words unless asked for more.`
      : `You are InkVein's AI reading guide. Recommend novels ONLY from this catalog when suggesting specific titles, and say so if nothing fits. Catalog:\n${catalog}\n\nBe concise and friendly, under ~150 words. When you name a title, wrap it in double quotes exactly as written so it can be linked.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system,
          messages: history.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text })) })
      });
      const data = await res.json();
      const reply = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim() || "Sorry, I couldn't think of anything just now.";
      setMsgs(m => [...m, { role: "assistant", text: reply }]);
    } catch (e) {
      setMsgs(m => [...m, { role: "assistant", text: "I hit a snag reaching my brain. Please try again in a moment." }]);
    }
    setBusy(false);
  };

  // turn "Title" mentions into clickable chips under assistant messages
  const linkedNovels = (text) => {
    const found = []; db.novels.forEach(n => { if (text.includes(`"${n.title}"`)) found.push(n); }); return found;
  };

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 200px)", minHeight: 420 }}>
      <h1 style={S.pageTitle}><Bot size={22} style={{ color: "var(--gold)" }} /> AI Assistant <span style={{ fontSize: 12, fontWeight: 400, color: "var(--ink-soft)", fontFamily: "var(--body)" }}>{isAuthor ? "writing mode" : "reading mode"}</span></h1>
      <p style={{ color: "var(--ink-soft)", marginTop: 4, marginBottom: 16, fontSize: 14 }}>{isAuthor ? "Switch to Reader mode for recommendations." : "Switch to Author mode for writing help."} Powered by Claude.</p>

      <div ref={scrollRef} style={S.chatScroll}>
        {msgs.map((m, i) => (
          <div key={i} style={{ ...S.chatRow, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && <div style={S.botAvatar}><Bot size={16} /></div>}
            <div style={{ ...S.bubble, ...(m.role === "user" ? S.bubbleUser : S.bubbleBot) }}>
              <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
              {m.role === "assistant" && linkedNovels(m.text).length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                  {linkedNovels(m.text).map(n => <button key={n.id} className="ghost" style={{ ...S.smallBtn, padding: "5px 11px" }} onClick={() => onOpen(n.id)}><BookOpen size={13} /> {n.title}</button>)}</div>)}
            </div>
          </div>
        ))}
        {busy && <div style={{ ...S.chatRow, justifyContent: "flex-start" }}><div style={S.botAvatar}><Bot size={16} /></div>
          <div style={{ ...S.bubble, ...S.bubbleBot, color: "var(--ink-soft)" }}><Loader size={15} className="spin" style={{ verticalAlign: -2 }} /> thinking...</div></div>}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
        {chips.map(c => <button key={c} className="ghost" style={{ ...S.smallBtn, fontSize: 12.5 }} onClick={() => send(c)} disabled={busy}><Wand2 size={12} /> {c}</button>)}</div>
      <div style={S.commentBox}>
        <input style={{ ...S.input, marginBottom: 0 }} placeholder={isAuthor ? "Ask for writing help..." : "Ask for a recommendation..."} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} disabled={busy} />
        <button className="primary" style={S.smallBtn} disabled={busy || !input.trim()} onClick={() => send()}><Send size={15} /></button></div>
    </div>
  );
}

function HistoryPage({ db, me, setView }) {
  const hist = (me.history || []);
  return (
    <div className="fade-up">
      <h1 style={S.pageTitle}><History size={22} style={{ color: "var(--gold)" }} /> Reading History</h1>
      <p style={{ color: "var(--ink-soft)", marginTop: 4, marginBottom: 22 }}>The last chapters you opened, most recent first.</p>
      {hist.length === 0 ? <div style={S.empty}>Nothing read yet.</div> : (
        <div style={S.chapList}>{hist.map((h, i) => { const n = db.novels.find(x => x.id === h.nid); if (!n) return null; const ch = n.chapters.find(c => c.id === h.cid); if (!ch) return null; return (
          <div key={i} className="chaprow" style={S.chapRow} onClick={() => setView({ name: "read", novelId: n.id, chapId: ch.id })}>
            <div style={{ ...S.miniCover, background: coverBg(n), width: 38, height: 50 }} />
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{n.title}</div><div style={{ color: "var(--ink-soft)", fontSize: 12.5 }}>{ch.title} . {new Date(h.at).toLocaleDateString()}</div></div>
            <Eye size={16} style={{ color: "var(--gold)" }} /></div>); })}</div>
      )}
    </div>
  );
}

function HowItWorks({ setView }) {
  const steps = [
    [<BookOpen key="1" size={22} />, "Read free, always", "Authors open as many free chapters as they want. Read those at zero cost - no ads gating the story."],
    [<Lock key="2" size={22} />, "Unlock with coins", `Locked chapters show a price in coins (${COIN}). Unlock one forever - 100% goes straight to the author. InkVein takes nothing.`],
    [<CalendarCheck key="3" size={22} />, "Earn free coins daily", "Check in every day for free coins and power stones. Build a streak to grow the reward."],
    [<Zap key="4" size={22} />, "Vote with power stones", `Power stones (${STONE}) are free, earned daily, and spent on votes that push novels up the rankings.`],
    [<Gift key="5" size={22} />, "Gift the authors you love", "Send a coffee, a quill, even a floating castle. The full value lands in the author's wallet."],
    [<Settings2 key="6" size={22} />, "Read your way", "Adjust font size, spacing, width and theme (night / sepia / light) right inside the reader."],
  ];
  return (
    <div className="fade-up">
      <h1 style={S.pageTitle}><HelpCircle size={22} style={{ color: "var(--gold)" }} /> How InkVein works</h1>
      <p style={{ color: "var(--ink-soft)", marginTop: 4, marginBottom: 28, maxWidth: 620, lineHeight: 1.6 }}>A serial-fiction platform built on one rule: the money belongs to the storyteller.</p>
      <div style={S.howGrid}>{steps.map(([icon, title, body], i) => (
        <div key={i} style={S.howCard}><div style={S.howIcon}>{icon}</div>
          <div style={{ fontFamily: "var(--display)", fontSize: 19, marginBottom: 6 }}>{title}</div>
          <p style={{ color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{body}</p></div>))}</div>
      <div style={S.howNote}><ShieldCheck size={16} style={{ color: "var(--gold)" }} />
        <span>Two currencies: <b style={{ color: "var(--gold)" }}>Coins {COIN}</b> (buy or earn, spend to unlock & gift) and <b style={{ color: "var(--gold)" }}>Power Stones {STONE}</b> (free, daily, for votes). Read the <button className="linkbtn" onClick={() => setView({ name: "legal" })}>Copyright & Terms</button> for how works are protected.</span></div>
    </div>
  );
}

function Legal() {
  return (
    <div className="fade-up" style={{ maxWidth: 720 }}>
      <h1 style={S.pageTitle}><ShieldCheck size={22} style={{ color: "var(--gold)" }} /> Copyright & Terms</h1>
      <div style={S.legalBox}>
        <h3 style={S.legalH}>Ownership of works</h3>
        <p style={S.legalP}>Every novel, chapter, title, and cover published on InkVein remains the exclusive intellectual property of its author. By publishing, authors retain full copyright in their work; InkVein claims no ownership and only displays the work to readers.</p>

        <h3 style={S.legalH}>No copying without permission</h3>
        <p style={S.legalP}>You may read works on InkVein for your personal enjoyment. You may <b>not</b>, without the author's prior written permission: copy, reproduce, republish, scrape, screenshot for redistribution, translate, adapt, sell, sublicense, or otherwise distribute any chapter or novel, in whole or in part, on any platform or in any medium. Unlocking a paid chapter grants you a personal, non-transferable licence to read it - not to redistribute it.</p>

        <h3 style={S.legalH}>Plagiarism & AI scraping</h3>
        <p style={S.legalP}>Uploading work you do not own, or that infringes another's copyright, is strictly prohibited and will be removed. Automated harvesting of works for training datasets or bulk download is forbidden without explicit author consent.</p>

        <h3 style={S.legalH}>Payments</h3>
        <p style={S.legalP}>Coins spent to unlock chapters or send gifts transfer in full to the author. InkVein charges a 0% platform fee. Authors set and may change chapter prices and lock status at any time.</p>

        <h3 style={S.legalH}>Reporting infringement</h3>
        <p style={S.legalP}>If you believe a work infringes your copyright, use the "Report" button on the novel page. Verified claims result in takedown of the infringing content.</p>

        <h3 style={S.legalH}>Enforcement</h3>
        <p style={S.legalP}>Violation of these terms may result in removal of content, suspension of accounts, and - where applicable - legal action by the rights holder. These terms are governed by applicable copyright law in the author's jurisdiction.</p>

        <div style={S.legalCopyright}>{"\u00A9"} 2026 InkVein and respective authors. All rights reserved. Unauthorized copying or distribution is prohibited.</div>
        <div style={S.secureNote}><AlertCircle size={13} /> This notice is a product feature for the demo, not legal advice. A real platform should have a lawyer draft enforceable Terms of Service, a DMCA/takedown policy, and a privacy policy.</div>
      </div>
    </div>
  );
}

function StarRow({ value, onSet, size = 18 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "inline-flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} onClick={() => onSet && onSet(s)} onMouseEnter={() => onSet && setHover(s)} onMouseLeave={() => setHover(0)}
          style={{ background: "none", border: "none", padding: 0, cursor: onSet ? "pointer" : "default", lineHeight: 0 }}>
          <Star size={size} style={{ color: (hover || value) >= s ? "#e0a458" : "rgba(255,255,255,0.2)", fill: (hover || value) >= s ? "#e0a458" : "none" }} /></button>))}
    </div>
  );
}

function NovelPage({ novel, authorName, me, db, canRead, hasPurchased, isBookmarked, onToggleBookmark, onBack, onRead, onPurchase, onLike, onVote, onGift, onRate, onAddToList, onFollow, isFollowing, onToggleReadMark, flash }) {
  const isAuthor = novel.authorId === me.id; const saved = isBookmarked(novel.id);
  const [giftOpen, setGiftOpen] = useState(false); const [listOpen, setListOpen] = useState(false); const [newList, setNewList] = useState("");
  const [myStars, setMyStars] = useState(me.ratings?.[novel.id] || 0); const [reviewText, setReviewText] = useState("");
  const progressId = me.progress?.[novel.id];
  const st = novelStats(novel);
  const visibleChapters = novel.chapters.filter(c => !c.draft || isAuthor);
  const readMarks = me.readMarks || [];
  const doneIdx = progressId ? visibleChapters.findIndex(c => c.id === progressId) : -1;
  const completion = doneIdx >= 0 && visibleChapters.length ? Math.round(((doneIdx + 1) / visibleChapters.length) * 100) : 0;
  const remainingMins = visibleChapters.slice(doneIdx + 1).reduce((s, c) => s + readMins(wordCount(c.body)), 0);
  const share = () => { const txt = `${novel.title} on InkVein`; if (navigator.clipboard) { navigator.clipboard.writeText(txt).then(() => flash("Share text copied to clipboard.")).catch(() => flash("Couldn't copy.", "err")); } else flash("Clipboard not available.", "err"); };
  const report = () => flash("Thanks - this work has been reported for review.");
  const existingLists = Object.keys(me.lists || {});
  return (
    <div className="fade-up">
      <button className="ghost" style={S.back} onClick={onBack}><ChevronLeft size={16} /> Library</button>
      {novel.pinned && <div style={S.pinNote}><AlertCircle size={16} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 1 }} /><span><b style={{ color: "var(--gold)" }}>From the author:</b> {novel.pinned}</span></div>}
      <div style={S.novelHead}>
        <div style={{ ...S.novelCover, background: coverBg(novel) }}><span style={S.coverGenre}>{novel.genre}</span></div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <h1 style={S.novelTitle}>{novel.title}</h1>
          <p style={S.novelTagline}>{novel.tagline}</p>
          <div style={S.novelByline}><User size={14} /> by <b style={{ color: "var(--gold)" }}>{authorName}</b>{isAuthor && <span style={S.youTag}>that's you</span>}
            {!isAuthor && <button className={isFollowing ? "primary" : "ghost"} style={{ ...S.smallBtn, marginLeft: 6, padding: "4px 11px" }} onClick={onFollow}>{isFollowing ? "Following" : "+ Follow"}</button>}</div>
          {db.users[novel.authorId]?.bio && <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "8px 0 0", maxWidth: 520 }}>{db.users[novel.authorId].bio}</p>}
          <div style={S.statRow}>
            {st.avg > 0 && <span><Star size={14} style={{ color: "#e0a458" }} /> {st.avg.toFixed(1)} ({novel.reviews.length})</span>}
            <span><Zap size={14} style={{ color: "var(--gold)" }} /> {novel.powerStones}</span>
            <span><Heart size={14} /> {novel.likes}</span>
            <span><Clock size={14} /> {st.mins} min read</span>
            <span><Type size={14} /> {st.words.toLocaleString()} words</span></div>
          {novel.tags && novel.tags.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>{novel.tags.map(t => <span key={t} style={S.tagPill}><Hash size={11} /> {t}</span>)}</div>}
          {completion > 0 && (<div style={{ marginTop: 12 }}><div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 4 }}>Your progress: {completion}%{remainingMins > 0 && ` . ${remainingMins} min left`}</div>
            <div style={S.progressTrack}><div style={{ ...S.progressFill, width: `${completion}%` }} /></div></div>)}
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <button className="ghost" style={S.likeBtn} onClick={onLike}><Heart size={14} /> Like</button>
            <button className="primary" style={S.likeBtn} onClick={onVote}><Zap size={14} /> Vote {STONE}</button>
            <button className="ghost" style={S.likeBtn} onClick={() => setGiftOpen(!giftOpen)}><Gift size={14} /> Gift</button>
            <button className={saved ? "primary" : "ghost"} style={S.likeBtn} onClick={onToggleBookmark}>{saved ? <><BookmarkCheck size={14} /> Saved</> : <><Bookmark size={14} /> Save</>}</button>
            <button className="ghost" style={S.likeBtn} onClick={() => setListOpen(!listOpen)}><ListPlus size={14} /> Add to list</button>
            <button className="ghost" style={S.likeBtn} onClick={share}><Share2 size={14} /> Share</button>
            <button className="ghost" style={S.likeBtn} onClick={report}><Flag size={14} /> Report</button></div>
          {giftOpen && (<div style={S.giftRow} className="fade-up">{GIFTS.map(g => (
            <button key={g.id} className="ghost" style={S.giftBtn} onClick={() => onGift(g)} title={`${g.cost}${COIN}`}>
              <span style={{ fontSize: 22 }}>{g.icon}</span><span style={{ fontSize: 11 }}>{g.name}</span><span style={{ fontSize: 11, color: "var(--gold)" }}>{g.cost}{COIN}</span></button>))}</div>)}
          {listOpen && (<div style={{ ...S.form, marginTop: 14, marginBottom: 0 }} className="fade-up">
            {existingLists.length > 0 && <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>{existingLists.map(l => <button key={l} className="ghost" style={S.smallBtn} onClick={() => { onAddToList(l); setListOpen(false); }}>{l}</button>)}</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <input style={{ ...S.input, marginBottom: 0 }} placeholder="New list name..." value={newList} onChange={e => setNewList(e.target.value)} />
              <button className="primary" style={S.smallBtn} disabled={!newList.trim()} onClick={() => { onAddToList(newList.trim()); setNewList(""); setListOpen(false); }}><Plus size={14} /></button></div></div>)}
        </div>
      </div>

      <h3 style={S.chaptersHeading}>Chapters</h3>
      <div style={S.chapList}>
        {visibleChapters.map((ch, i) => {
          const readable = canRead(novel, ch); const owned = hasPurchased(ch.id); const lastRead = progressId === ch.id; const cm = readMins(wordCount(ch.body)); const marked = readMarks.includes(ch.id);
          return (
            <div key={ch.id} className="chaprow" style={{ ...S.chapRow, ...(lastRead ? { borderColor: "rgba(212,175,110,0.5)" } : {}), opacity: ch.draft ? 0.6 : 1 }}>
              <button className="ghost" style={{ ...S.iconBtn, padding: 6, borderRadius: "50%" }} title={marked ? "Mark unread" : "Mark read"} onClick={() => onToggleReadMark(ch.id)}>
                {marked ? <Check size={15} style={{ color: "#6fcf97" }} /> : <span style={{ fontFamily: "var(--display)", fontSize: 14, color: "rgba(212,175,110,0.5)", width: 16, display: "inline-block", textAlign: "center" }}>{String(i + 1).padStart(2, "0")}</span>}</button>
              <div style={{ flex: 1 }}><div style={S.chapTitle}>{ch.title} {ch.draft && <span style={S.draftTag}>draft</span>} {lastRead && <span style={S.lastReadTag}>last read</span>}</div>
                <div style={S.chapStatus}>{(!ch.locked || ch.price === 0) ? <span style={{ color: "var(--gold)" }}><Unlock size={12} /> Free</span>
                  : owned ? <span style={{ color: "#6fcf97" }}><Check size={12} /> Unlocked</span>
                  : <span style={{ color: "#e0a458" }}><Lock size={12} /> {ch.price}{COIN}</span>} <span style={{ opacity: 0.5 }}>. <Clock size={11} style={{ verticalAlign: -1 }} /> {cm}m{ch.views ? ` . ${ch.views} views` : ""}</span></div></div>
              {readable ? <button className="primary" style={S.readBtn} onClick={() => onRead(ch.id)}><Eye size={14} /> Read</button>
                : <button className="unlock" style={S.unlockBtn} onClick={() => { if (onPurchase(ch)) onRead(ch.id); }}><Coins size={14} /> Unlock {ch.price}{COIN}</button>}
            </div>
          );
        })}
      </div>

      <h3 style={S.chaptersHeading}><Star size={18} style={{ verticalAlign: -3, color: "#e0a458" }} /> Ratings & Reviews</h3>
      <div style={S.reviewWrite}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>Your rating:</span>
          <StarRow value={myStars} onSet={setMyStars} /></div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <input style={{ ...S.input, marginBottom: 0 }} placeholder="Write a short review (optional)..." value={reviewText} onChange={e => setReviewText(e.target.value)} />
          <button className="primary" style={S.smallBtn} disabled={!myStars} onClick={() => { onRate(myStars, reviewText); setReviewText(""); }}><Send size={14} /> Post</button></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
        {(!novel.reviews || novel.reviews.length === 0) && <div style={{ color: "var(--ink-soft)", fontSize: 13, fontStyle: "italic" }}>No reviews yet. Be the first.</div>}
        {(novel.reviews || []).map((r, i) => (
          <div key={i} style={S.reviewCard}><div style={S.commentAvatar}>{r.user[0]?.toUpperCase()}</div>
            <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><b style={{ fontSize: 13.5 }}>{r.user}</b><StarRow value={r.stars} size={13} /></div>
              {r.text && <div style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 3 }}>{r.text}</div>}</div></div>))}
      </div>
    </div>
  );
}

const THEMES = {
  night: { bg: "transparent", color: "#e9e3d6" },
  sepia: { bg: "#f4ecd8", color: "#433422" },
  light: { bg: "#fbfbfb", color: "#1a1a1a" },
};

function Reader({ db, novel, chapId, me, prefs, setPrefs, onBack, onNav, onComment, onMarkRead, onView, onChapterLike, flash }) {
  const idx = novel.chapters.findIndex(c => c.id === chapId);
  const ch = novel.chapters[idx]; const prev = novel.chapters[idx - 1]; const next = novel.chapters[idx + 1];
  const [text, setText] = useState(""); const [panel, setPanel] = useState(false); const [binge, setBinge] = useState(false);
  const comments = (novel.comments && novel.comments[chapId]) || [];
  const bodyRef = useRef(null);
  const mins = readMins(wordCount(ch.body));
  const liked = (me.chapterLikes || []).includes(chapId);
  useEffect(() => { onMarkRead(); onView(); }, [chapId]);
  // keyboard nav
  useEffect(() => {
    const h = (e) => { if (e.key === "ArrowLeft" && prev) onNav(prev.id); if (e.key === "ArrowRight" && next) onNav(next.id); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [prev, next]);
  // binge mode: auto-advance after a short dwell
  useEffect(() => {
    if (!binge || !next) return;
    const t = setTimeout(() => onNav(next.id), Math.max(4000, mins * 1500));
    return () => clearTimeout(t);
  }, [binge, chapId, next]);
  const submit = () => { if (text.trim()) { onComment(text.trim()); setText(""); } };
  const theme = THEMES[prefs.theme] || THEMES.night;
  const setP = (patch) => setPrefs({ ...prefs, ...patch });
  const fontFam = prefs.fontFamily === "sans" ? "var(--read-sans)" : "var(--read)";
  return (
    <div className="fade-up" style={{ ...S.readerWrap, maxWidth: prefs.width }}>
      <div style={S.readerTop}>
        <button className="ghost" style={S.back} onClick={onBack}><ChevronLeft size={16} /> {novel.title}</button>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select style={S.jumpSelect} value={chapId} onChange={e => onNav(e.target.value)} title="Jump to chapter">
            {novel.chapters.map((c, i) => <option key={c.id} value={c.id}>{i + 1}. {c.title}</option>)}</select>
          <button className={binge ? "primary" : "ghost"} style={S.iconBtn} onClick={() => setBinge(!binge)} title="Binge mode: auto-advance"><Sparkle size={16} /></button>
          <button className="ghost" style={S.iconBtn} onClick={() => setPanel(!panel)} title="Reading settings"><Settings2 size={16} /></button></div></div>

      {panel && (
        <div style={S.readerPanel} className="fade-up">
          <div style={S.prefRow}><span style={S.prefLabel}><Type size={14} /> Font size</span>
            <div style={S.prefCtrl}><button className="ghost" style={S.stepBtn} onClick={() => setP({ fontSize: Math.max(14, prefs.fontSize - 1) })}><Minus size={13} /></button>
              <span style={{ width: 34, textAlign: "center" }}>{prefs.fontSize}</span>
              <button className="ghost" style={S.stepBtn} onClick={() => setP({ fontSize: Math.min(28, prefs.fontSize + 1) })}><Plus size={13} /></button></div></div>
          <div style={S.prefRow}><span style={S.prefLabel}><AlignJustify size={14} /> Line spacing</span>
            <div style={S.prefCtrl}><button className="ghost" style={S.stepBtn} onClick={() => setP({ lineHeight: Math.max(1.4, +(prefs.lineHeight - 0.1).toFixed(1)) })}><Minus size={13} /></button>
              <span style={{ width: 34, textAlign: "center" }}>{prefs.lineHeight}</span>
              <button className="ghost" style={S.stepBtn} onClick={() => setP({ lineHeight: Math.min(2.2, +(prefs.lineHeight + 0.1).toFixed(1)) })}><Plus size={13} /></button></div></div>
          <div style={S.prefRow}><span style={S.prefLabel}><Type size={14} /> Typeface</span>
            <div style={S.prefCtrl}>
              <button className={prefs.fontFamily !== "sans" ? "primary" : "ghost"} style={S.themeBtn} onClick={() => setP({ fontFamily: "serif" })}>Serif</button>
              <button className={prefs.fontFamily === "sans" ? "primary" : "ghost"} style={S.themeBtn} onClick={() => setP({ fontFamily: "sans" })}>Sans</button></div></div>
          <div style={S.prefRow}><span style={S.prefLabel}><AlignJustify size={14} /> Justify text</span>
            <div style={S.prefCtrl}>
              <button className={!prefs.justify ? "primary" : "ghost"} style={S.themeBtn} onClick={() => setP({ justify: false })}>Off</button>
              <button className={prefs.justify ? "primary" : "ghost"} style={S.themeBtn} onClick={() => setP({ justify: true })}>On</button></div></div>
          <div style={S.prefRow}><span style={S.prefLabel}><Maximize2 size={14} /> Width</span>
            <div style={S.prefCtrl}>{[["Narrow", 580], ["Medium", 680], ["Wide", 820]].map(([l, w]) => (
              <button key={w} className={prefs.width === w ? "primary" : "ghost"} style={S.themeBtn} onClick={() => setP({ width: w })}>{l}</button>))}</div></div>
          <div style={S.prefRow}><span style={S.prefLabel}><Sun size={14} /> Theme</span>
            <div style={S.prefCtrl}>
              <button className={prefs.theme === "night" ? "primary" : "ghost"} style={S.themeBtn} onClick={() => setP({ theme: "night" })}><Moon size={13} /> Night</button>
              <button className={prefs.theme === "sepia" ? "primary" : "ghost"} style={S.themeBtn} onClick={() => setP({ theme: "sepia" })}>Sepia</button>
              <button className={prefs.theme === "light" ? "primary" : "ghost"} style={S.themeBtn} onClick={() => setP({ theme: "light" })}><Sun size={13} /> Light</button></div></div>
        </div>
      )}

      <div style={S.readerChapLabel}>CHAPTER {idx + 1} . {mins} MIN READ{binge ? " . BINGE ON" : ""}</div>
      <h1 style={{ ...S.readerTitle, color: prefs.theme === "night" ? undefined : theme.color }}>{ch.title}</h1>
      <div style={S.readerRule} />
      <article ref={bodyRef} style={{ ...S.readerBody, fontFamily: fontFam, fontSize: prefs.fontSize, lineHeight: prefs.lineHeight, textAlign: prefs.justify ? "justify" : "left", color: theme.color, background: theme.bg, borderRadius: prefs.theme === "night" ? 0 : 14, padding: prefs.theme === "night" ? 0 : "28px 30px" }}>
        {ch.body.split("\n").filter(Boolean).map((p, i) => <p key={i} style={S.readerPara} className={i === 0 && prefs.theme === "night" && prefs.fontFamily !== "sans" ? "dropcap" : ""}>{p}</p>)}
      </article>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
        <button className={liked ? "primary" : "ghost"} style={S.likeBtn} onClick={() => onChapterLike(chapId)}><ThumbsUp size={14} /> {liked ? "Liked this chapter" : "Like this chapter"}</button></div>

      <div style={S.readerNav}>
        {prev ? <button className="ghost" style={S.navChip} onClick={() => onNav(prev.id)}><ChevronLeft size={14} /> {prev.title}</button> : <span />}
        {next && <button className="ghost" style={S.navChip} onClick={() => onNav(next.id)}>{next.title} {"\u203A"}</button>}</div>
      <div style={{ textAlign: "center", fontSize: 11.5, color: "var(--ink-soft)", marginTop: 12 }}>Tip: use {"\u2190"} / {"\u2192"} arrow keys to turn chapters</div>

      <div style={S.commentSection}>
        <h3 style={{ ...S.chaptersHeading, fontSize: 18 }}><MessageSquare size={16} style={{ verticalAlign: -2 }} /> Comments ({comments.length})</h3>
        <div style={S.commentBox}>
          <input style={{ ...S.input, marginBottom: 0 }} placeholder="Share a thought on this chapter..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
          <button className="primary" style={S.smallBtn} onClick={submit} disabled={!text.trim()}><Send size={14} /></button></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
          {comments.length === 0 && <div style={{ color: "var(--ink-soft)", fontSize: 13, fontStyle: "italic" }}>Be the first to comment.</div>}
          {comments.map((c, i) => (
            <div key={i} style={S.comment}><div style={S.commentAvatar}>{c.user[0]?.toUpperCase()}</div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.user}</div><div style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 2 }}>{c.text}</div>
                <button className="linkbtn" style={{ fontSize: 11.5, marginTop: 3 }} onClick={() => flash("Comment reported for review.")}>Report</button></div></div>))}
        </div>
      </div>
    </div>
  );
}

function Studio({ db, me, persist, flash, onToggleLock, onOpen, onReorder, onDuplicate, onToggleDraft, onBulkLock, onSetAllPrices, onPin, onSaveBio }) {
  const myNovels = db.novels.filter(n => n.authorId === me.id);
  const [creating, setCreating] = useState(false); const [editing, setEditing] = useState(null);
  const [pinFor, setPinFor] = useState(null); const [pinText, setPinText] = useState("");
  const [bio, setBio] = useState(me.bio || ""); const [bioOpen, setBioOpen] = useState(false);
  const [bulkPrice, setBulkPrice] = useState({});
  const totalCh = myNovels.reduce((s, n) => s + n.chapters.length, 0);
  const totalStones = myNovels.reduce((s, n) => s + n.powerStones, 0);
  const totalViews = myNovels.reduce((s, n) => s + n.views, 0);
  const createNovel = (d) => { const next = structuredClone(db); next.novels.unshift({ id: "n" + Date.now(), authorId: me.id, title: d.title, tagline: d.tagline, genre: d.genre || "Literary", cover: d.cover, coverImg: d.coverImg || "", tags: d.tags || [], likes: 0, powerStones: 0, views: 0, createdAt: Date.now(), comments: {}, reviews: [], chapters: [] }); persist(next); setCreating(false); flash(`Published "${d.title}".`); };
  const addChapter = (nid, d) => { const next = structuredClone(db); const nv = next.novels.find(n => n.id === nid); const locked = Number(d.price) > 0; nv.chapters.push({ id: "c" + Date.now(), title: d.title, body: d.body, price: Number(d.price) || 0, locked, draft: !!d.draft, views: 0 }); persist(next); setEditing(null); flash(d.draft ? `Saved draft "${d.title}".` : locked ? `Added "${d.title}" locked at ${d.price}${COIN}.` : `Added "${d.title}" - free.`); };
  const setPrice = (nid, cid, p) => { const next = structuredClone(db); const ch = next.novels.find(n => n.id === nid).chapters.find(c => c.id === cid); ch.price = Math.max(0, Number(p) || 0); if (ch.price === 0) ch.locked = false; persist(next); };
  const removeChapter = (nid, cid) => { const next = structuredClone(db); const nv = next.novels.find(n => n.id === nid); nv.chapters = nv.chapters.filter(c => c.id !== cid); persist(next); flash("Chapter removed."); };
  const removeNovel = (nid) => { const next = structuredClone(db); next.novels = next.novels.filter(n => n.id !== nid); persist(next); flash("Novel deleted."); };
  const exportNovel = (n) => {
    const txt = `${n.title}\nby ${me.name}\n\n` + n.chapters.map((c, i) => `Chapter ${i + 1}: ${c.title}\n\n${c.body}`).join("\n\n---\n\n") + `\n\n(c) ${new Date().getFullYear()} ${me.name}. All rights reserved.`;
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => flash("Full novel text copied to clipboard.")).catch(() => flash("Copy failed.", "err"));
    else flash("Clipboard not available.", "err");
  };
  return (
    <div className="fade-up">
      <div style={S.studioHead}>
        <div><h1 style={S.pageTitle}><Feather size={22} style={{ color: "var(--gold)" }} /> {me.name}'s Studio</h1>
          <p style={{ color: "var(--ink-soft)", margin: "6px 0 0", fontSize: 14 }}>Publish, lock chapters, set your own prices. You keep 100%.</p></div>
        <div style={S.earnPill}><span style={{ opacity: 0.6, fontSize: 11, letterSpacing: 1 }}>EARNED (wallet)</span><b style={{ fontSize: 22, color: "var(--gold)" }}>{me.wallet}{COIN}</b></div></div>
      <div style={S.analyticsGrid}>
        {[[<BookOpen size={18} key="a" />, myNovels.length, "Novels"], [<Library size={18} key="b" />, totalCh, "Chapters"], [<Zap size={18} key="c" />, totalStones, "Power stones"], [<Eye size={18} key="d" />, totalViews, "Total views"], [<Gift size={18} key="e" />, me.giftsReceived || 0, "Gifts received"], [<Coins size={18} key="f" />, me.coinsEarned || 0, "Coins earned"]].map(([icon, val, label], i) => (
          <div key={i} style={S.statCard}><div style={S.statIcon}>{icon}</div><div style={{ fontSize: 22, fontFamily: "var(--display)", color: "var(--gold)" }}>{val}</div><div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{label}</div></div>))}</div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        <button className="primary" style={{ ...S.bigBtn, marginBottom: 0 }} onClick={() => setCreating(!creating)}><PlusCircle size={16} /> {creating ? "Cancel" : "New Novel"}</button>
        <button className="ghost" style={{ ...S.bigBtn, marginBottom: 0 }} onClick={() => setBioOpen(!bioOpen)}><User size={16} /> Author bio</button></div>
      {bioOpen && (<div style={S.form}><textarea style={{ ...S.input, minHeight: 80, fontFamily: "var(--body)" }} placeholder="Tell readers about yourself..." value={bio} onChange={e => setBio(e.target.value)} />
        <button className="primary" style={S.bigBtn} onClick={() => { onSaveBio(bio); setBioOpen(false); }}><Check size={16} /> Save bio</button></div>)}
      {creating && <NovelForm onSubmit={createNovel} />}
      {myNovels.length === 0 && !creating && <div style={S.empty}>No stories yet. Start a novel above.</div>}
      {myNovels.map(n => (
        <div key={n.id} style={S.studioCard}>
          <div style={S.studioCardHead}>
            <div style={{ ...S.miniCover, background: coverBg(n) }} />
            <div style={{ flex: 1, minWidth: 160 }}><div style={{ fontFamily: "var(--display)", fontSize: 20 }}>{n.title}</div>
              <div style={{ color: "var(--ink-soft)", fontSize: 13 }}>{n.genre} . {n.chapters.length} ch . {n.likes} likes . {n.powerStones}{STONE}</div></div>
            <button className="ghost" style={S.smallBtn} onClick={() => onOpen(n.id)}><Eye size={14} /> Preview</button>
            <button className="ghost" style={S.smallBtn} onClick={() => exportNovel(n)}><Copy size={14} /> Export</button>
            <button className="primary" style={S.smallBtn} onClick={() => setEditing(editing === n.id ? null : n.id)}><PlusCircle size={14} /> Chapter</button>
            <button className="ghost" style={S.iconBtn} onClick={() => removeNovel(n.id)} title="Delete novel"><Trash2 size={14} /></button></div>

          <div style={{ ...S.bulkBar, marginTop: 14 }}>
            <button className="ghost" style={S.smallBtn} onClick={() => { setPinFor(pinFor === n.id ? null : n.id); setPinText(n.pinned || ""); }}><AlertCircle size={13} /> Announcement</button>
            <button className="ghost" style={S.smallBtn} onClick={() => onBulkLock(n.id, true)}><Lock size={13} /> Lock all</button>
            <button className="ghost" style={S.smallBtn} onClick={() => onBulkLock(n.id, false)}><Unlock size={13} /> Free all</button>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <input type="number" min="0" style={{ ...S.priceInput, width: 64 }} placeholder="price" value={bulkPrice[n.id] ?? ""} onChange={e => setBulkPrice({ ...bulkPrice, [n.id]: e.target.value })} />
              <button className="ghost" style={S.smallBtn} onClick={() => onSetAllPrices(n.id, bulkPrice[n.id] || 0)}>Set all {COIN}</button></div></div>
          {pinFor === n.id && (<div style={{ ...S.form, marginBottom: 14 }}>
            <input style={{ ...S.input, marginBottom: 10 }} placeholder="Announcement to readers (e.g. 'New chapters every Friday!')" value={pinText} onChange={e => setPinText(e.target.value)} />
            <div style={{ display: "flex", gap: 8 }}><button className="primary" style={S.smallBtn} onClick={() => { onPin(n.id, pinText.trim()); setPinFor(null); }}><Check size={14} /> Pin</button>
              <button className="ghost" style={S.smallBtn} onClick={() => { onPin(n.id, ""); setPinFor(null); }}>Clear</button></div></div>)}

          {editing === n.id && <ChapterForm onSubmit={d => addChapter(n.id, d)} />}
          <div style={S.studioChaps}>
            {n.chapters.map((ch, i) => (
              <div key={ch.id} style={S.studioChapRow}>
                <span style={S.chapNum}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ flex: 1, fontWeight: 500, minWidth: 120 }}>{ch.title}{ch.draft && <span style={S.draftTag}>draft</span>}{ch.views ? <span style={{ fontSize: 11, color: "var(--ink-soft)", marginLeft: 8 }}>{ch.views} views</span> : null}</span>
                <div style={{ display: "inline-flex", gap: 2 }}>
                  <button className="ghost" style={{ ...S.iconBtn, padding: 6 }} title="Move up" onClick={() => onReorder(n.id, i, -1)} disabled={i === 0}><ArrowUp size={13} /></button>
                  <button className="ghost" style={{ ...S.iconBtn, padding: 6 }} title="Move down" onClick={() => onReorder(n.id, i, 1)} disabled={i === n.chapters.length - 1}><ArrowUp size={13} style={{ transform: "rotate(180deg)" }} /></button>
                  <button className="ghost" style={{ ...S.iconBtn, padding: 6 }} title="Duplicate" onClick={() => onDuplicate(n.id, ch.id)}><Copy size={13} /></button></div>
                <div style={S.priceCtrl}><span style={{ opacity: 0.5, fontSize: 12 }}>price</span>
                  <input type="number" min="0" value={ch.price} onChange={e => setPrice(n.id, ch.id, e.target.value)} style={S.priceInput} /><span style={{ color: "var(--gold)" }}>{COIN}</span></div>
                <button className={ch.draft ? "ghost" : "lockoff"} style={S.lockToggle} onClick={() => onToggleDraft(n.id, ch.id)} title={ch.draft ? "Draft - click to publish" : "Published - click to draft"}>{ch.draft ? "Draft" : "Live"}</button>
                <button className={ch.locked ? "lockon" : "lockoff"} style={S.lockToggle} onClick={() => onToggleLock(n.id, ch.id)} title={ch.locked ? "Locked - click to free" : "Free - click to lock"}>{ch.locked ? <><Lock size={13} /> Locked</> : <><Unlock size={13} /> Free</>}</button>
                <button className="ghost" style={S.iconBtn} onClick={() => removeChapter(n.id, ch.id)} title="Delete chapter"><Trash2 size={14} /></button></div>
            ))}
            {n.chapters.length === 0 && <div style={{ opacity: 0.5, fontSize: 13, padding: 12 }}>No chapters yet.</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function NovelForm({ onSubmit }) {
  const [f, setF] = useState({ title: "", tagline: "", genre: "Fantasy", cover: "#2a3d4f", coverImg: "", tags: [] });
  const [customGenre, setCustomGenre] = useState(""); const [tagInput, setTagInput] = useState("");
  const palette = ["#2a3d4f", "#3a1f1f", "#1f3a2e", "#3a2f1f", "#2f1f3a", "#13414f"];
  const onUpload = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 1.6 * 1024 * 1024) return alert("Please choose an image under ~1.5MB.");
    const r = new FileReader(); r.onload = () => setF(s => ({ ...s, coverImg: r.result })); r.readAsDataURL(file);
  };
  const addTag = () => { const t = tagInput.trim(); if (t && !f.tags.includes(t)) setF({ ...f, tags: [...f.tags, t] }); setTagInput(""); };
  const previewBg = f.coverImg ? `url(${f.coverImg}) center/cover` : `linear-gradient(150deg, ${f.cover}, #0c0c10)`;
  return (
    <div style={S.form}>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 auto" }}>
          <div style={{ ...S.novelCover, width: 110, height: 154, background: previewBg, marginBottom: 8 }} />
          <label className="ghost" style={{ ...S.smallBtn, cursor: "pointer", display: "inline-flex" }}><ImageIcon size={14} /> Upload cover
            <input type="file" accept="image/*" onChange={onUpload} style={{ display: "none" }} /></label>
          {f.coverImg && <button className="ghost" style={{ ...S.smallBtn, marginLeft: 6 }} onClick={() => setF({ ...f, coverImg: "" })}>Clear</button>}
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <input style={S.input} placeholder="Title" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} />
          <input style={S.input} placeholder="One-line tagline" value={f.tagline} onChange={e => setF({ ...f, tagline: e.target.value })} />
          <select style={S.input} value={f.genre} onChange={e => setF({ ...f, genre: e.target.value })}>{GENRES.map(g => <option key={g}>{g}</option>)}</select>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input style={{ ...S.input, marginBottom: 0 }} placeholder="...or add a custom genre" value={customGenre} onChange={e => setCustomGenre(e.target.value)} onKeyDown={e => e.key === "Enter" && customGenre.trim() && (setF({ ...f, genre: customGenre.trim() }), setCustomGenre(""))} />
            <button className="ghost" style={S.smallBtn} disabled={!customGenre.trim()} onClick={() => { setF({ ...f, genre: customGenre.trim() }); setCustomGenre(""); }}><Plus size={14} /></button></div>
          {!f.coverImg && (<div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}><span style={{ color: "var(--ink-soft)", fontSize: 13 }}>or color</span>
            {palette.map(c => <button key={c} onClick={() => setF({ ...f, cover: c })} style={{ width: 26, height: 26, borderRadius: 6, background: c, border: f.cover === c ? "2px solid var(--gold)" : "2px solid transparent", cursor: "pointer" }} />)}</div>)}
        </div>
      </div>
      <div style={{ marginTop: 4, marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 6 }}>Tags (optional, helps discovery)</div>
        <div style={{ display: "flex", gap: 8, marginBottom: f.tags.length ? 8 : 0 }}>
          <input style={{ ...S.input, marginBottom: 0 }} placeholder="e.g. enemies-to-lovers, slow-burn" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} />
          <button className="ghost" style={S.smallBtn} disabled={!tagInput.trim()} onClick={addTag}><Plus size={14} /></button></div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{f.tags.map(t => <span key={t} style={S.tagPill}>{t} <button onClick={() => setF({ ...f, tags: f.tags.filter(x => x !== t) })} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0 }}><X size={11} /></button></span>)}</div>
      </div>
      <button className="primary" style={S.bigBtn} disabled={!f.title} onClick={() => onSubmit(f)}><Check size={16} /> Publish Novel</button>
    </div>
  );
}

function ChapterForm({ onSubmit }) {
  const [f, setF] = useState({ title: "", body: "", price: 0, draft: false });
  const words = wordCount(f.body);
  return (
    <div style={S.form}>
      <input style={S.input} placeholder="Chapter title" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} />
      <textarea style={{ ...S.input, minHeight: 140, resize: "vertical", fontFamily: "var(--body)" }} placeholder="Write your chapter...  (blank lines separate paragraphs)" value={f.body} onChange={e => setF({ ...f, body: e.target.value })} />
      <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 10 }}>{words} words . ~{readMins(words)} min read</div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "4px 0 12px", flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>Unlock price</span>
        <input type="number" min="0" style={{ ...S.priceInput, width: 80 }} value={f.price} onChange={e => setF({ ...f, price: e.target.value })} /><span style={{ color: "var(--gold)" }}>{COIN}</span>
        <span style={{ fontSize: 12, opacity: 0.5 }}>{Number(f.price) > 0 ? "-> locked" : "-> free (0 = free)"}</span></div>
      <label style={{ ...S.checkRow, marginBottom: 12 }}><input type="checkbox" checked={f.draft} onChange={e => setF({ ...f, draft: e.target.checked })} style={{ accentColor: "#d4af6e", width: 16, height: 16 }} /> Save as draft (hidden from readers until published)</label>
      <button className="primary" style={S.bigBtn} disabled={!f.title || !f.body} onClick={() => onSubmit(f)}><Check size={16} /> {f.draft ? "Save Draft" : "Publish Chapter"}</button>
    </div>
  );
}

function WalletPage({ db, me, onTopUp, onConnect, onDisconnect, onCheckin }) {
  const purchases = me.purchases || []; const owned = [];
  db.novels.forEach(n => n.chapters.forEach(c => { if (purchases.includes(c.id)) owned.push({ novel: n.title, chap: c.title, price: c.price }); }));
  const [form, setForm] = useState({ name: "", number: "", exp: "", cvc: "" });
  const valid = form.name && form.number.replace(/\s/g, "").length >= 12 && form.exp && form.cvc.length >= 3;
  const submit = () => { const num = form.number.replace(/\s/g, ""); const brand = num[0] === "4" ? "Visa" : num[0] === "5" ? "Mastercard" : "Card"; onConnect({ brand, last4: num.slice(-4) }); setForm({ name: "", number: "", exp: "", cvc: "" }); };
  const checkedIn = me.lastCheckin === today();
  return (
    <div className="fade-up">
      <h1 style={S.pageTitle}><Wallet size={22} style={{ color: "var(--gold)" }} /> Wallet & Payments</h1>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "18px 0 8px" }}>
        <div style={{ ...S.walletBig, flex: 1, minWidth: 220 }}>
          <span style={{ opacity: 0.55, fontSize: 12, letterSpacing: 2 }}>COINS</span>
          <div style={{ fontSize: 44, fontFamily: "var(--display)", color: "var(--gold)" }}>{me.wallet}{COIN}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>{[20, 50, 100].map(a => <button key={a} className="primary" style={S.smallBtn} disabled={!me.payment?.connected} onClick={() => onTopUp(a)}>+ {a}{COIN}</button>)}</div></div>
        <div style={{ ...S.walletBig, flex: 1, minWidth: 220, background: "radial-gradient(120% 120% at 80% 0%, #2a2410, #101015)" }}>
          <span style={{ opacity: 0.55, fontSize: 12, letterSpacing: 2 }}>POWER STONES</span>
          <div style={{ fontSize: 44, fontFamily: "var(--display)", color: "var(--gold)" }}>{me.stones || 0}{STONE}</div>
          <button className={checkedIn ? "ghost" : "primary"} style={{ ...S.smallBtn, marginTop: 12 }} onClick={onCheckin}><CalendarCheck size={14} /> {checkedIn ? "Checked in today" : "Daily check-in"} {me.streak > 0 && <span style={S.streakDot}><Flame size={11} /> {me.streak}</span>}</button></div>
      </div>
      {!me.payment?.connected && <div style={{ ...S.secureNote, marginTop: 4 }}><AlertCircle size={13} /> Connect a payment method to top up & unlock chapters. Free check-in coins work without it.</div>}
      <h3 style={S.chaptersHeading}><CreditCard size={18} style={{ verticalAlign: -3 }} /> Payment Method</h3>
      {me.payment?.connected ? (
        <div style={S.payConnected}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={S.cardChip}><CreditCard size={20} /></div>
            <div><div style={{ fontWeight: 600 }}>{me.payment.brand} {"\u2022\u2022\u2022\u2022"} {me.payment.last4}</div>
              <div style={{ fontSize: 12.5, color: "#6fcf97", display: "flex", alignItems: "center", gap: 5 }}><ShieldCheck size={13} /> Connected . payments go direct to authors</div></div></div>
          <button className="ghost" style={S.smallBtn} onClick={onDisconnect}>Disconnect</button></div>
      ) : (
        <div style={S.form}>
          <input style={S.input} placeholder="Name on card" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input style={S.input} placeholder="Card number" inputMode="numeric" value={form.number} onChange={e => setForm({ ...form, number: e.target.value.replace(/[^\d ]/g, "").slice(0, 19) })} />
          <div style={{ display: "flex", gap: 12 }}>
            <input style={S.input} placeholder="MM/YY" value={form.exp} onChange={e => setForm({ ...form, exp: e.target.value.slice(0, 5) })} />
            <input style={S.input} placeholder="CVC" inputMode="numeric" value={form.cvc} onChange={e => setForm({ ...form, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} /></div>
          <button className="primary" style={{ ...S.bigBtn, marginBottom: 0 }} disabled={!valid} onClick={submit}><ShieldCheck size={16} /> Connect Securely</button>
          <div style={S.secureNote}><ShieldCheck size={13} /> Demo only - no card data leaves this screen. Production would use a tokenized gateway (Stripe / Razorpay).</div></div>
      )}
      <h3 style={S.chaptersHeading}>Chapters you've unlocked</h3>
      {owned.length === 0 ? <div style={S.empty}>No paid unlocks yet - plenty of free chapters await.</div> : (
        <div style={S.chapList}>{owned.map((o, i) => (
          <div key={i} style={S.chapRow}><Coins size={16} style={{ color: "var(--gold)" }} />
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{o.chap}</div><div style={{ opacity: 0.5, fontSize: 12 }}>{o.novel}</div></div>
            <span style={{ color: "var(--gold)" }}>{o.price}{COIN}</span></div>))}</div>
      )}
    </div>
  );
}

function RoleGate({ onSwitch }) {
  return (
    <div style={S.empty}><Feather size={36} style={{ opacity: 0.4 }} /><br /><br />
      You're in <b>reader</b> mode. Switch to <b style={{ color: "var(--gold)" }}>author</b> mode to open your Studio.<br /><br />
      <button className="primary" style={S.bigBtn} onClick={onSwitch}><Repeat size={15} /> Switch to Author</button></div>
  );
}
function Toast({ toast }) {
  return <div style={{ ...S.toast, borderColor: toast.kind === "err" ? "#b4493f" : "var(--gold)" }}>{toast.kind === "err" ? <X size={16} /> : <Check size={16} />} {toast.msg}</div>;
}

const navStyle = (a) => ({ display: "flex", alignItems: "center", gap: 6, padding: "8px 11px", background: a ? "rgba(212,175,110,0.14)" : "transparent", color: a ? "var(--gold)" : "var(--ink-soft)", border: "1px solid", borderColor: a ? "rgba(212,175,110,0.4)" : "transparent", borderRadius: 10, cursor: "pointer", fontSize: 13.5, fontWeight: 500, transition: "all .2s" });
const authTab = (a) => ({ flex: 1, padding: "10px", background: a ? "rgba(212,175,110,0.16)" : "transparent", color: a ? "var(--gold)" : "var(--ink-soft)", border: "none", borderBottom: a ? "2px solid var(--gold)" : "2px solid transparent", cursor: "pointer", fontSize: 14.5, fontWeight: 600, fontFamily: "var(--body)" });
const genreChip = (on, kind) => ({ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 20, fontSize: 12.5, cursor: "pointer", fontFamily: "var(--body)", transition: "all .15s",
  background: on ? (kind === "inc" ? "rgba(111,207,151,0.15)" : "rgba(180,73,63,0.18)") : "rgba(255,255,255,0.05)",
  color: on ? (kind === "inc" ? "#6fcf97" : "#e07a70") : "var(--ink-soft)",
  border: "1px solid " + (on ? (kind === "inc" ? "rgba(111,207,151,0.45)" : "rgba(180,73,63,0.5)") : "rgba(255,255,255,0.1)") });
const rankTab = (a) => ({ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 10, fontSize: 13.5, cursor: "pointer", fontFamily: "var(--body)", fontWeight: 600,
  background: a ? "rgba(212,175,110,0.16)" : "rgba(255,255,255,0.05)", color: a ? "var(--gold)" : "var(--ink-soft)", border: "1px solid " + (a ? "rgba(212,175,110,0.4)" : "rgba(255,255,255,0.1)") });

const S = {
  loadWrap: { minHeight: "100vh", background: "#0c0c10", color: "#d4af6e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  root: { height: "100vh", background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--body)", display: "flex", flexDirection: "column", overflow: "hidden" },
  header: { flexShrink: 0, display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", background: "rgba(14,14,18,0.9)", borderBottom: "1px solid rgba(212,175,110,0.16)", flexWrap: "wrap", zIndex: 30 },
  brand: { display: "flex", alignItems: "center", gap: 9, cursor: "pointer", marginRight: "auto" },
  brandMark: { width: 34, height: 34, borderRadius: 9, background: "linear-gradient(140deg,#d4af6e,#8a6a35)", display: "grid", placeItems: "center", color: "#1a1409", flexShrink: 0 },
  brandName: { fontFamily: "var(--display)", fontSize: 23 },
  nav: { display: "flex", gap: 2, flexWrap: "wrap" },
  who: { display: "flex", alignItems: "center", gap: 8 },
  stoneTag: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--gold)", padding: "6px 10px", borderRadius: 9, background: "rgba(212,175,110,0.1)", border: "1px solid rgba(212,175,110,0.25)" },
  checkinBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", fontSize: 12.5, fontWeight: 600 },
  streakDot: { display: "inline-flex", alignItems: "center", gap: 2, marginLeft: 4, fontSize: 11, color: "#e0834e" },
  roleBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", fontSize: 12.5, fontWeight: 600 },
  avatar: { width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(140deg,#d4af6e,#8a6a35)", color: "#1a1409", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 14 },
  iconBtn: { padding: 8, display: "grid", placeItems: "center", borderRadius: 9 },
  main: { flex: 1, overflowY: "auto", position: "relative" },
  inner: { maxWidth: 1080, width: "100%", margin: "0 auto", padding: "30px 24px 60px" },
  hero: { position: "relative", overflow: "hidden", borderRadius: 22, padding: "46px 40px", marginBottom: 28, background: "radial-gradient(120% 140% at 80% 0%, #1d2b33 0%, #101015 55%, #0c0c10 100%)", border: "1px solid rgba(212,175,110,0.18)" },
  heroGrain: { position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")" },
  kicker: { fontSize: 12, letterSpacing: 3, color: "var(--gold)", marginBottom: 16, fontWeight: 600 },
  heroTitle: { fontFamily: "var(--display)", fontSize: "clamp(34px,5.5vw,56px)", lineHeight: 1.02, margin: 0, fontWeight: 600 },
  heroSub: { maxWidth: 560, marginTop: 16, fontSize: 16, lineHeight: 1.6, color: "var(--ink-soft)" },
  heroBtn: { display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 18px", fontSize: 14 },
  continueCard: { display: "flex", alignItems: "center", gap: 16, padding: 16, borderRadius: 16, background: "rgba(212,175,110,0.07)", border: "1px solid rgba(212,175,110,0.28)", marginBottom: 26, cursor: "pointer", transition: "border-color .2s" },
  shelfTitle: { fontFamily: "var(--display)", fontSize: 21, margin: "28px 0 14px", display: "flex", alignItems: "center", gap: 8 },
  searchRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" },
  searchBox: { display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,110,0.22)", borderRadius: 12, padding: "10px 14px", flex: 1, minWidth: 220 },
  searchInput: { background: "transparent", border: "none", outline: "none", color: "var(--ink)", fontFamily: "var(--body)", fontSize: 14.5, width: "100%" },
  clearBtn: { padding: 4, borderRadius: 6, display: "grid", placeItems: "center" },
  filterBtn: { display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 15px", fontSize: 13.5 },
  filterBtnActive: { borderColor: "var(--gold)", color: "var(--gold)" },
  badge: { background: "var(--gold)", color: "#1a1409", borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 700 },
  sortBox: { display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 11, padding: "0 12px" },
  sortSelect: { background: "transparent", color: "var(--ink)", border: "none", outline: "none", padding: "10px 4px", fontFamily: "var(--body)", fontSize: 13.5, cursor: "pointer" },
  filterPanel: { background: "rgba(0,0,0,0.28)", border: "1px solid rgba(212,175,110,0.18)", borderRadius: 16, padding: 22, marginBottom: 16, display: "flex", flexDirection: "column", gap: 18 },
  filterLabel: { fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 10 },
  chipWrap: { display: "flex", flexWrap: "wrap", gap: 8 },
  numInput: { width: 76, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,110,0.3)", borderRadius: 8, padding: "8px 10px", color: "var(--ink)", fontFamily: "var(--body)", fontSize: 14, textAlign: "center" },
  checkRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer", color: "var(--ink-soft)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 22 },
  card: { cursor: "pointer", borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", transition: "transform .25s, border-color .25s, box-shadow .25s" },
  cardCover: { position: "relative", height: 180, padding: 18, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" },
  coverGenre: { position: "absolute", top: 14, left: 16, fontSize: 11, letterSpacing: 1.5, color: "rgba(255,255,255,0.7)", textTransform: "uppercase" },
  coverTitle: { fontFamily: "var(--display)", fontSize: 25, lineHeight: 1.1, position: "relative", zIndex: 2 },
  coverGlow: { position: "absolute", bottom: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,rgba(212,175,110,0.35),transparent 70%)" },
  powerBadge: { position: "absolute", top: 12, left: 14, zIndex: 3, display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: "#1a1409", background: "var(--gold)", borderRadius: 20, padding: "2px 8px" },
  bookmarkBtn: { position: "absolute", top: 12, right: 12, zIndex: 3, width: 34, height: 34, borderRadius: 9, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.18)", display: "grid", placeItems: "center", cursor: "pointer", color: "#fff", backdropFilter: "blur(4px)" },
  cardBody: { padding: "16px 18px 18px" },
  cardTagline: { fontSize: 14, lineHeight: 1.5, color: "var(--ink-soft)", margin: "0 0 14px", minHeight: 42 },
  cardMeta: { display: "flex", gap: 13, fontSize: 12.5, color: "var(--ink-soft)", alignItems: "center", flexWrap: "wrap" },
  back: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 14, padding: "8px 13px" },
  novelHead: { display: "flex", gap: 26, marginBottom: 30, flexWrap: "wrap" },
  novelCover: { width: 150, height: 210, borderRadius: 14, position: "relative", flexShrink: 0, boxShadow: "0 18px 40px rgba(0,0,0,0.5)" },
  novelTitle: { fontFamily: "var(--display)", fontSize: "clamp(28px,4.5vw,44px)", margin: 0, lineHeight: 1.05 },
  novelTagline: { fontSize: 17, color: "var(--ink-soft)", margin: "12px 0 14px", fontStyle: "italic", maxWidth: 540 },
  novelByline: { display: "flex", alignItems: "center", gap: 7, fontSize: 14, color: "var(--ink-soft)" },
  statRow: { display: "flex", gap: 16, marginTop: 12, fontSize: 13.5, color: "var(--ink-soft)", flexWrap: "wrap", alignItems: "center" },
  youTag: { marginLeft: 8, fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "rgba(212,175,110,0.16)", color: "var(--gold)" },
  progressTrack: { height: 6, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden", maxWidth: 320 },
  progressFill: { height: "100%", background: "linear-gradient(90deg,#d4af6e,#a07d3e)", borderRadius: 4 },
  likeBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 14px", fontSize: 13 },
  giftRow: { display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" },
  giftBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "10px 14px", minWidth: 76 },
  pageTitle: { fontFamily: "var(--display)", fontSize: 30, margin: 0, display: "flex", alignItems: "center", gap: 10 },
  chaptersHeading: { fontFamily: "var(--display)", fontSize: 22, margin: "30px 0 16px" },
  chapList: { display: "flex", flexDirection: "column", gap: 10 },
  chapRow: { display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderRadius: 13, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", transition: "border-color .2s, background .2s", cursor: "pointer" },
  chapNum: { fontFamily: "var(--display)", fontSize: 18, color: "rgba(212,175,110,0.5)", width: 28, flexShrink: 0 },
  chapTitle: { fontSize: 16, fontWeight: 500 },
  lastReadTag: { fontSize: 10.5, padding: "1px 7px", borderRadius: 20, background: "rgba(212,175,110,0.18)", color: "var(--gold)", marginLeft: 8, verticalAlign: 2 },
  chapStatus: { fontSize: 12.5, marginTop: 4, display: "flex", alignItems: "center", gap: 5 },
  readBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", fontSize: 13.5 },
  unlockBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", fontSize: 13.5 },
  reviewWrite: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 18 },
  reviewCard: { display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" },
  readerWrap: { margin: "0 auto" },
  readerTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 10, flexWrap: "wrap" },
  readerPanel: { background: "rgba(0,0,0,0.32)", border: "1px solid rgba(212,175,110,0.2)", borderRadius: 16, padding: 18, marginBottom: 24, display: "flex", flexDirection: "column", gap: 14 },
  prefRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  prefLabel: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, color: "var(--ink-soft)" },
  prefCtrl: { display: "flex", alignItems: "center", gap: 6 },
  stepBtn: { padding: 7, display: "grid", placeItems: "center", borderRadius: 8 },
  themeBtn: { display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 12px", fontSize: 12.5, borderRadius: 9 },
  jumpSelect: { background: "rgba(255,255,255,0.06)", color: "var(--ink)", border: "1px solid rgba(212,175,110,0.3)", borderRadius: 9, padding: "8px 10px", fontFamily: "var(--body)", fontSize: 13, cursor: "pointer", maxWidth: 200 },
  readerChapLabel: { fontSize: 12, letterSpacing: 3, color: "var(--gold)", marginBottom: 8 },
  readerTitle: { fontFamily: "var(--display)", fontSize: "clamp(28px,5vw,42px)", margin: 0, lineHeight: 1.1 },
  readerRule: { width: 60, height: 2, background: "var(--gold)", margin: "22px 0 26px", opacity: 0.7 },
  readerBody: { fontFamily: "var(--read)" },
  readerPara: { margin: "0 0 1.4em" },
  readerNav: { display: "flex", justifyContent: "space-between", gap: 12, marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", flexWrap: "wrap" },
  navChip: { padding: "10px 14px", fontSize: 13, maxWidth: 240 },
  commentSection: { marginTop: 36, paddingTop: 8 },
  commentBox: { display: "flex", gap: 10, alignItems: "center" },
  comment: { display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0" },
  commentAvatar: { width: 30, height: 30, borderRadius: "50%", background: "rgba(212,175,110,0.2)", color: "var(--gold)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 },
  rankTabs: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  rankList: { display: "flex", flexDirection: "column", gap: 10 },
  rankRow: { display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", borderRadius: 13, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", transition: "border-color .2s, background .2s" },
  rankNum: { width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", fontFamily: "var(--display)", fontSize: 17, color: "var(--ink-soft)", background: "rgba(255,255,255,0.05)", flexShrink: 0 },
  rankNumTop: { color: "var(--gold)", background: "rgba(212,175,110,0.14)" },
  rankStat: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 600 },
  studioHead: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, marginBottom: 20, flexWrap: "wrap" },
  earnPill: { display: "flex", flexDirection: "column", gap: 2, padding: "12px 20px", borderRadius: 14, background: "rgba(212,175,110,0.08)", border: "1px solid rgba(212,175,110,0.25)" },
  analyticsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, marginBottom: 22 },
  statCard: { padding: "16px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" },
  statIcon: { color: "var(--gold)", marginBottom: 8, display: "flex", justifyContent: "center" },
  bigBtn: { display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", fontSize: 14.5, marginBottom: 18 },
  studioCard: { borderRadius: 16, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", padding: 20, marginBottom: 20 },
  studioCardHead: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" },
  miniCover: { width: 46, height: 60, borderRadius: 8, flexShrink: 0 },
  smallBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 13px", fontSize: 13 },
  studioChaps: { marginTop: 16, display: "flex", flexDirection: "column", gap: 8 },
  studioChapRow: { display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 11, background: "rgba(0,0,0,0.22)", flexWrap: "wrap" },
  draftTag: { fontSize: 10.5, padding: "1px 7px", borderRadius: 20, background: "rgba(180,73,63,0.2)", color: "#e07a70", marginLeft: 6 },
  tagPill: { display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, fontSize: 12, background: "rgba(212,175,110,0.12)", color: "var(--gold)", border: "1px solid rgba(212,175,110,0.25)" },
  priceCtrl: { display: "flex", alignItems: "center", gap: 6 },
  priceInput: { width: 60, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,110,0.3)", borderRadius: 7, padding: "6px 8px", color: "var(--ink)", fontFamily: "var(--body)", fontSize: 14, textAlign: "center" },
  lockToggle: { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 9, fontSize: 13, cursor: "pointer", fontWeight: 500, border: "1px solid" },
  bulkBar: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 },
  walletBig: { borderRadius: 18, padding: 26, background: "radial-gradient(120% 120% at 80% 0%, #1d2b33, #101015)", border: "1px solid rgba(212,175,110,0.2)" },
  payConnected: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "18px 20px", borderRadius: 14, background: "rgba(111,207,151,0.07)", border: "1px solid rgba(111,207,151,0.3)", flexWrap: "wrap" },
  cardChip: { width: 46, height: 32, borderRadius: 7, background: "linear-gradient(140deg,#d4af6e,#8a6a35)", color: "#1a1409", display: "grid", placeItems: "center" },
  form: { background: "rgba(0,0,0,0.25)", border: "1px solid rgba(212,175,110,0.18)", borderRadius: 14, padding: 20, marginBottom: 22 },
  input: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "11px 14px", color: "var(--ink)", fontFamily: "var(--body)", fontSize: 14.5, marginBottom: 12, outline: "none", boxSizing: "border-box" },
  eyeBtn: { position: "absolute", right: 8, top: 7, padding: 7, borderRadius: 8, background: "transparent", border: "none", color: "var(--ink-soft)", cursor: "pointer" },
  secureNote: { display: "flex", alignItems: "flex-start", gap: 7, fontSize: 12, color: "var(--ink-soft)", marginTop: 14, lineHeight: 1.5 },
  howGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 18 },
  howCard: { padding: 22, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" },
  howIcon: { width: 46, height: 46, borderRadius: 12, background: "rgba(212,175,110,0.12)", color: "var(--gold)", display: "grid", placeItems: "center", marginBottom: 14 },
  howNote: { display: "flex", gap: 10, alignItems: "flex-start", marginTop: 24, padding: 18, borderRadius: 14, background: "rgba(212,175,110,0.07)", border: "1px solid rgba(212,175,110,0.22)", fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-soft)" },
  legalBox: { marginTop: 20, padding: "26px 28px", borderRadius: 16, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" },
  legalH: { fontFamily: "var(--display)", fontSize: 18, color: "var(--gold)", margin: "20px 0 6px" },
  legalP: { fontSize: 14.5, lineHeight: 1.65, color: "var(--ink-soft)", margin: 0 },
  legalCopyright: { marginTop: 26, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: 13, color: "var(--gold)", fontWeight: 600 },
  pinNote: { display: "flex", gap: 9, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: "rgba(212,175,110,0.09)", border: "1px solid rgba(212,175,110,0.28)", marginBottom: 12, fontSize: 14, color: "var(--ink)", cursor: "pointer" },
  authorChip: { display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 30, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" },
  threadRow: { display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderRadius: 13, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", transition: "border-color .2s, background .2s" },
  voteBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minWidth: 34, padding: "4px 0", borderRadius: 9, cursor: "pointer" },
  catTag: { display: "inline-block", fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", color: "var(--gold)", background: "rgba(212,175,110,0.12)", border: "1px solid rgba(212,175,110,0.25)", borderRadius: 20, padding: "2px 10px" },
  threadHead: { marginBottom: 16 },
  linkedNovel: { display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: 14, background: "rgba(212,175,110,0.07)", border: "1px solid rgba(212,175,110,0.25)", marginTop: 16, cursor: "pointer" },
  shareBox: { display: "flex", gap: 24, flexWrap: "wrap", padding: 20, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,110,0.18)", marginBottom: 30 },
  codeChip: { fontFamily: "var(--display)", fontSize: 20, letterSpacing: 3, color: "var(--gold)", background: "rgba(212,175,110,0.12)", border: "1px solid rgba(212,175,110,0.3)", borderRadius: 10, padding: "8px 16px" },
  chatScroll: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, padding: "6px 2px" },
  chatRow: { display: "flex", gap: 10, alignItems: "flex-start" },
  botAvatar: { width: 32, height: 32, borderRadius: 9, background: "linear-gradient(140deg,#d4af6e,#8a6a35)", color: "#1a1409", display: "grid", placeItems: "center", flexShrink: 0 },
  bubble: { maxWidth: "78%", padding: "12px 16px", borderRadius: 16, fontSize: 14.5, lineHeight: 1.6 },
  bubbleBot: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderTopLeftRadius: 4 },
  bubbleUser: { background: "linear-gradient(140deg,#d4af6e,#a07d3e)", color: "#1a1409", borderTopRightRadius: 4, fontWeight: 500 },
  authWrap: { minHeight: "100vh", display: "grid", placeItems: "center", padding: 20, position: "relative", overflow: "hidden", background: "radial-gradient(120% 120% at 70% 10%, #1d2b33, #0c0c10 60%)" },
  authGrain: { position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")" },
  authCard: { position: "relative", zIndex: 2, width: "100%", maxWidth: 400, background: "rgba(18,18,24,0.86)", backdropFilter: "blur(16px)", border: "1px solid rgba(212,175,110,0.22)", borderRadius: 22, padding: 32, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" },
  authBrand: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 },
  authTabs: { display: "flex", marginBottom: 22, borderBottom: "1px solid rgba(255,255,255,0.08)" },
  demoBox: { marginTop: 16, padding: "12px 14px", borderRadius: 10, background: "rgba(212,175,110,0.08)", border: "1px solid rgba(212,175,110,0.2)", fontSize: 12.5, lineHeight: 1.7, color: "var(--ink-soft)" },
  empty: { textAlign: "center", padding: "50px 20px", color: "var(--ink-soft)", fontStyle: "italic" },
  toast: { position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)", zIndex: 100, display: "flex", alignItems: "center", gap: 9, background: "rgba(20,20,26,0.97)", border: "1px solid var(--gold)", borderRadius: 12, padding: "13px 20px", fontSize: 14, maxWidth: "90vw", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" },
  toTop: { position: "fixed", bottom: 80, right: 28, zIndex: 90, width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(140deg,#d4af6e,#a07d3e)", color: "#1a1409", border: "none", cursor: "pointer", display: "grid", placeItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" },
  footer: { flexShrink: 0, textAlign: "center", padding: "14px", fontSize: 12.5, color: "var(--ink-soft)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Spectral:ital,wght@0,400;0,500;1,400&family=Newsreader:ital@0;1&family=Inter:wght@400;500&display=swap');
:root{--bg:#0c0c10;--ink:#ece7dc;--ink-soft:#a8a194;--gold:#d4af6e;--display:'Fraunces',Georgia,serif;--body:'Spectral',Georgia,serif;--read:'Newsreader',Georgia,serif;--read-sans:'Inter',system-ui,sans-serif;}
*{box-sizing:border-box}body{margin:0}
::-webkit-scrollbar{width:10px}::-webkit-scrollbar-track{background:#0c0c10}::-webkit-scrollbar-thumb{background:rgba(212,175,110,0.3);border-radius:5px}
button{font-family:var(--body);color:var(--ink)}
select option{background:#16161c;color:var(--ink)}
.primary{background:linear-gradient(140deg,#d4af6e,#a07d3e);color:#1a1409;border:none;border-radius:10px;font-weight:600;cursor:pointer;transition:transform .15s,filter .2s}
.primary:hover{filter:brightness(1.08);transform:translateY(-1px)}
.primary:disabled{opacity:.4;cursor:not-allowed;filter:none;transform:none}
.unlock{background:rgba(224,164,88,0.12);color:#e0a458;border:1px solid rgba(224,164,88,0.5);border-radius:10px;font-weight:600;cursor:pointer;transition:all .2s}
.unlock:hover{background:rgba(224,164,88,0.22)}
.ghost{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:10px;cursor:pointer;transition:all .2s;color:var(--ink)}
.ghost:hover{background:rgba(255,255,255,0.1);border-color:rgba(212,175,110,0.4)}
.ghost:disabled{opacity:.35;cursor:not-allowed}
.linkbtn{background:none;border:none;color:var(--gold);cursor:pointer;text-decoration:underline;font-size:12.5px;padding:0}
.navbtn:hover{color:var(--gold)}
.card:hover{transform:translateY(-4px);border-color:rgba(212,175,110,0.4);box-shadow:0 16px 40px rgba(0,0,0,0.4)}
.bookmarkbtn:hover{background:rgba(0,0,0,0.65)!important;border-color:var(--gold)!important}
.chaprow:hover{border-color:rgba(212,175,110,0.35)!important;background:rgba(255,255,255,0.04)!important}
.lockon{background:rgba(224,164,88,0.14);border-color:rgba(224,164,88,0.5)!important;color:#e0a458}
.lockoff{background:rgba(111,207,151,0.12);border-color:rgba(111,207,151,0.45)!important;color:#6fcf97}
.totop:hover{transform:translateY(-2px)}
.dropcap::first-letter{font-family:var(--display);font-size:3.6em;float:left;line-height:0.78;padding:6px 10px 0 0;color:var(--gold)}
input::placeholder,textarea::placeholder{color:rgba(168,161,148,0.55)}
.fade-up{animation:fadeUp .5s ease both}
.card{animation:fadeUp .5s ease both}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.spin{animation:spin 1s linear infinite}
@media(max-width:760px){.navbtn span{display:none}}
`;

export default App;
