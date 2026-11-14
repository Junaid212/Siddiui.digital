/**
 * Reader/index.jsx - the Online Reading experience (chapters written in the admin dashboard).
 *   /read                         -> the library (or straight into the only book)
 *   /read/:bookSlug               -> table of contents, "Continue reading" where the reader stopped
 *   /read/:bookSlug/:chapterSlug  -> a chapter with previous / next
 * Read-only. Access is decided by the server on every request: only an Online Reading customer gets content; a Digital
 * Companion customer is told the reader belongs to the Online edition; visitors are asked to sign in. This page never
 * decides access itself. Chapter HTML is sanitised again here before it is shown.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { supabase } from "../../supabaseClient";
import { api } from "../../api";
import HeadTitle from "../../Components/Head/HeadTitle";
import "./Reader.css";

// Reader pages are private: keep them out of search results.
function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex,nofollow");
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

const clean = (html) =>
  DOMPurify.sanitize(html || "", { USE_PROFILES: { html: true }, ADD_ATTR: ["target"], FORBID_TAGS: ["style", "form", "input", "iframe"], FORBID_ATTR: ["srcset"] });

function Notice({ title, children, action }) {
  return (
    <div className="reader-notice" role="status" data-testid="reader-notice">
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </div>
  );
}

export default function ReaderPage() {
  useNoIndex();
  const navigate = useNavigate();
  const { bookSlug, chapterSlug } = useParams();

  const [session, setSession] = useState(undefined); // undefined = still checking
  const [state, setState] = useState({ status: "loading" });
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [tocOpen, setTocOpen] = useState(false);
  const saveTimer = useRef(null);
  const lastSaved = useRef(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data?.session || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s || null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const fail = useCallback(async (res) => {
    if (res.status === 401) return setState({ status: "signin" });
    if (res.status === 403) {
      if (res.data?.edition === "companion") return setState({ status: "companion" });
      return setState({ status: "none" });
    }
    if (res.status === 503) return setState({ status: "unavailable" });
    return setState({ status: "error", message: res.data?.error || "The reader could not be loaded." });
  }, []);

  // 1. library
  useEffect(() => {
    if (session === undefined) return;
    if (!session) return setState({ status: "signin" });
    let alive = true;
    (async () => {
      const res = await api.readerBooks();
      if (!alive) return;
      if (!res.ok) return fail(res);
      setBooks(res.data.books || []);
      setState({ status: "ready" });
      if (!bookSlug && res.data.books?.length === 1) navigate(`/read/${res.data.books[0].slug}`, { replace: true });
    })();
    return () => { alive = false; };
  }, [session, bookSlug, fail, navigate]);

  // 2. a book's table of contents
  useEffect(() => {
    setBook(null);
    if (state.status !== "ready" || !bookSlug) return undefined;
    let alive = true;
    api.readerBook(bookSlug).then((res) => { if (!alive) return; if (!res.ok) return res.status === 404 ? setState({ status: "missing" }) : fail(res); setBook(res.data); });
    return () => { alive = false; };
  }, [state.status, bookSlug, fail]);

  // 3. a chapter
  useEffect(() => {
    setChapter(null);
    if (state.status !== "ready" || !bookSlug || !chapterSlug) return undefined;
    let alive = true;
    api.readerChapter(bookSlug, chapterSlug).then((res) => {
      if (!alive) return;
      if (!res.ok) return res.status === 404 ? setState({ status: "missing" }) : fail(res);
      setChapter(res.data);
      window.scrollTo({ top: 0 });
    });
    return () => { alive = false; };
  }, [state.status, bookSlug, chapterSlug, fail]);

  // reading progress: saved at most every 5 seconds while scrolling, and when leaving the chapter
  useEffect(() => {
    if (!chapter) return undefined;
    const save = (force) => {
      const el = document.documentElement;
      const max = Math.max(el.scrollHeight - el.clientHeight, 1);
      const percent = Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100)));
      if (!force && Date.now() - lastSaved.current < 5000) return;
      lastSaved.current = Date.now();
      api.saveReaderProgress(chapter.book.slug, chapter.chapter.slug, percent).catch(() => {});
    };
    const onScroll = () => { clearTimeout(saveTimer.current); saveTimer.current = setTimeout(() => save(false), 700); };
    window.addEventListener("scroll", onScroll, { passive: true });
    save(true);
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(saveTimer.current); };
  }, [chapter]);

  const html = useMemo(() => (chapter ? clean(chapter.chapter.contentHtml) : ""), [chapter]);
  const signIn = () => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href, scopes: "openid email profile" } });

  const shell = (children) => (
    <>
      <HeadTitle title="Read Online | Marketing Reclassified" description="Online Reading Edition of Marketing Reclassified." />
      <main className="reader-page">{children}</main>
    </>
  );

  if (state.status === "loading" || session === undefined) return shell(<div className="reader-loading" data-testid="reader-loading">Loading…</div>);
  if (state.status === "signin") return shell(<Notice title="Sign in to read" action={<><button className="reader-btn" onClick={signIn}>Continue with Google</button> <Link className="reader-btn reader-btn--ghost" to="/login">Sign in with e-mail</Link></>}>The Online Reading Edition is available to its owners. Please sign in with the account you purchased with.</Notice>);
  if (state.status === "companion") return shell(<Notice title="Online reading is part of the Online Reading Edition" action={<Link className="reader-btn" to="/my-orders">Go to My Orders</Link>}>Your Digital Companion Edition includes the downloadable Companion materials and Ask SID. The online reader belongs to the Online Reading Edition.</Notice>);
  if (state.status === "none") return shell(<Notice title="No Online Reading access" action={<Link className="reader-btn" to="/publications/marketing-reclassified">View the Online Reading Edition</Link>}>We could not find an Online Reading Edition on this account. If you purchased with a different e-mail address, sign in with that account.</Notice>);
  if (state.status === "unavailable") return shell(<Notice title="Online reading is coming soon">The Online Reading Edition is being prepared. Please check back shortly.</Notice>);
  if (state.status === "missing") return shell(<Notice title="Not found" action={<Link className="reader-btn" to="/read">Back to the library</Link>}>That book or chapter is not available.</Notice>);
  if (state.status === "error") return shell(<Notice title="Something went wrong">{state.message}</Notice>);

  // library
  if (!bookSlug) {
    return shell(
      <section className="reader-library" data-testid="reader-library">
        <h1>Your online library</h1>
        {books.length === 0 ? <Notice title="Coming soon">No book has been published for online reading yet.</Notice> : (
          <ul>{books.map((b) => (
            <li key={b.slug}><Link to={`/read/${b.slug}`}><strong>{b.title}</strong>{b.subtitle ? <span>{b.subtitle}</span> : null}<em>{b.chapterCount} chapters</em></Link></li>
          ))}</ul>
        )}
      </section>
    );
  }

  // table of contents
  if (!chapterSlug) {
    if (!book) return shell(<div className="reader-loading">Loading…</div>);
    return shell(
      <section className="reader-toc" data-testid="reader-toc">
        <Link to="/read" className="reader-back">← Library</Link>
        <h1>{book.book.title}</h1>
        {book.book.subtitle && <p className="reader-sub">{book.book.subtitle}</p>}
        {book.book.description && <p>{book.book.description}</p>}
        {book.progress && <Link className="reader-btn" to={`/read/${bookSlug}/${book.progress.chapterSlug}`} data-testid="resume">Continue reading</Link>}
        <ol>{book.chapters.map((c) => <li key={c.slug}><Link to={`/read/${bookSlug}/${c.slug}`}>{c.title}</Link></li>)}</ol>
        {book.chapters.length === 0 && <p>No chapters have been published yet.</p>}
      </section>
    );
  }

  // chapter
  if (!chapter) return shell(<div className="reader-loading">Loading…</div>);
  const { chapter: ch, previous, next } = chapter;
  return shell(
    <div className="reader-layout" data-testid="reader-chapter">
      <button className="reader-toc-toggle" onClick={() => setTocOpen((o) => !o)} aria-expanded={tocOpen}>Contents</button>
      <nav className={`reader-sidebar ${tocOpen ? "open" : ""}`} aria-label="Chapters">
        <Link to={`/read/${bookSlug}`} className="reader-back">← {chapter.book.title}</Link>
        <ol>{(book?.chapters || []).map((c) => <li key={c.slug} className={c.slug === ch.slug ? "current" : ""}><Link to={`/read/${bookSlug}/${c.slug}`} onClick={() => setTocOpen(false)}>{c.title}</Link></li>)}</ol>
      </nav>
      <article className="reader-article">
        <p className="reader-count">Chapter {ch.number} of {ch.total}</p>
        <h1>{ch.title}</h1>
        <div className="reader-content" data-testid="reader-content" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="reader-pager">
          {previous ? <Link to={`/read/${bookSlug}/${previous.slug}`} data-testid="prev">← {previous.title}</Link> : <span />}
          {next ? <Link to={`/read/${bookSlug}/${next.slug}`} data-testid="next">{next.title} →</Link> : <span />}
        </div>
      </article>
    </div>
  );
}
