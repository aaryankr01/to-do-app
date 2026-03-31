import { useState, useEffect, useRef } from "react";

const API = "https://todo-backend-ltfy.onrender.com/api";

/* ══════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #07080f;
      --surface:  #0f1120;
      --card:     rgba(255,255,255,0.04);
      --border:   rgba(255,255,255,0.08);
      --border2:  rgba(255,255,255,0.14);
      --accent:   #6c63ff;
      --accent2:  #ff6b9d;
      --accent3:  #00d4aa;
      --text:     #f0f0f8;
      --muted:    rgba(240,240,248,0.4);
      --muted2:   rgba(240,240,248,0.2);
      --danger:   #ff5c5c;
      --success:  #00d4aa;
    }

    html, body, #root {
      height: 100%;
      font-family: 'Outfit', sans-serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
    }

    input, button, select { font-family: inherit; }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(108,99,255,0.3); border-radius: 10px; }

    /* Animations */
    @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
    @keyframes scaleIn  { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
    @keyframes spin     { to { transform:rotate(360deg); } }
    @keyframes pulse    { 0%,100%{opacity:0.5} 50%{opacity:1} }
    @keyframes slideIn  { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }
    @keyframes glow     { 0%,100%{box-shadow:0 0 20px rgba(108,99,255,0.2)} 50%{box-shadow:0 0 40px rgba(108,99,255,0.5)} }
    @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes shimmer  {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }

    .fade-up    { animation: fadeUp  0.5s cubic-bezier(0.22,1,0.36,1) both; }
    .fade-in    { animation: fadeIn  0.4s ease both; }
    .scale-in   { animation: scaleIn 0.35s cubic-bezier(0.22,1,0.36,1) both; }
    .slide-in   { animation: slideIn 0.35s cubic-bezier(0.22,1,0.36,1) both; }

    .stagger-1  { animation-delay: 0.05s; }
    .stagger-2  { animation-delay: 0.10s; }
    .stagger-3  { animation-delay: 0.15s; }
    .stagger-4  { animation-delay: 0.20s; }
    .stagger-5  { animation-delay: 0.25s; }
    .stagger-6  { animation-delay: 0.30s; }

    /* Input styles */
    .tf-input {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1.5px solid var(--border);
      border-radius: 14px;
      padding: 14px 16px 14px 46px;
      color: var(--text);
      font-size: 15px;
      font-weight: 400;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
      outline: none;
    }
    .tf-input::placeholder { color: var(--muted2); }
    .tf-input:focus {
      border-color: var(--accent);
      background: rgba(108,99,255,0.06);
      box-shadow: 0 0 0 3px rgba(108,99,255,0.12);
    }
    .tf-input.error {
      border-color: var(--danger);
      box-shadow: 0 0 0 3px rgba(255,92,92,0.1);
    }

    /* Button styles */
    .tf-btn-primary {
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 14px;
      background: linear-gradient(135deg, #6c63ff 0%, #9b59b6 100%);
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.01em;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
      box-shadow: 0 6px 28px rgba(108,99,255,0.35);
      position: relative;
      overflow: hidden;
    }
    .tf-btn-primary::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
      opacity: 0;
      transition: opacity 0.2s;
    }
    .tf-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(108,99,255,0.5); }
    .tf-btn-primary:hover:not(:disabled)::after { opacity: 1; }
    .tf-btn-primary:active:not(:disabled) { transform: translateY(0); }
    .tf-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

    .tf-btn-ghost {
      background: none;
      border: 1.5px solid var(--border2);
      border-radius: 12px;
      color: var(--muted);
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tf-btn-ghost:hover { border-color: var(--accent); color: var(--accent); background: rgba(108,99,255,0.06); }

    /* Todo item hover */
    .todo-item { transition: transform 0.2s, box-shadow 0.2s, background 0.2s; }
    .todo-item:hover { transform: translateX(4px); background: rgba(255,255,255,0.06) !important; }

    /* Checkbox */
    .check-ring { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
    .check-ring:hover { transform: scale(1.15); }

    /* Tab */
    .auth-tab { transition: all 0.25s; cursor: pointer; }
    .auth-tab:hover { color: var(--text) !important; }
  `}</style>
);

/* ══════════════════════════════════════════════
   ANIMATED BACKGROUND
══════════════════════════════════════════════ */
const Background = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", background: "var(--bg)" }}>
    {/* Orbs */}
    <div style={{ position:"absolute", top:"-10%", left:"-5%", width:600, height:600, borderRadius:"50%",
      background:"radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)", filter:"blur(60px)",
      animation:"float 8s ease-in-out infinite" }} />
    <div style={{ position:"absolute", bottom:"-15%", right:"-5%", width:500, height:500, borderRadius:"50%",
      background:"radial-gradient(circle, rgba(255,107,157,0.10) 0%, transparent 70%)", filter:"blur(60px)",
      animation:"float 10s ease-in-out infinite reverse" }} />
    <div style={{ position:"absolute", top:"40%", right:"20%", width:300, height:300, borderRadius:"50%",
      background:"radial-gradient(circle, rgba(0,212,170,0.07) 0%, transparent 70%)", filter:"blur(40px)",
      animation:"float 12s ease-in-out infinite" }} />
    {/* Grid */}
    <div style={{ position:"absolute", inset:0, opacity:0.025,
      backgroundImage:"linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
      backgroundSize:"40px 40px" }} />
    {/* Noise texture */}
    <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.025 }}>
      <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" /><feColorMatrix type="saturate" values="0"/></filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  </div>
);

/* ══════════════════════════════════════════════
   FIELD COMPONENT
══════════════════════════════════════════════ */
const Field = ({ label, type="text", value, onChange, placeholder, icon, error, onKeyDown }) => (
  <div style={{ marginBottom: 18 }}>
    {label && <label style={{ display:"block", fontSize:12, fontWeight:600, color:"var(--muted)",
      letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>{label}</label>}
    <div style={{ position:"relative" }}>
      <span style={{ position:"absolute", left:15, top:"50%", transform:"translateY(-50%)",
        fontSize:17, pointerEvents:"none", userSelect:"none" }}>{icon}</span>
      <input className={`tf-input${error?" error":""}`} type={type} value={value}
        onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder} />
    </div>
    {error && <div style={{ fontSize:12, color:"var(--danger)", marginTop:6, paddingLeft:4 }}>⚠ {error}</div>}
  </div>
);

/* ══════════════════════════════════════════════
   SPINNER
══════════════════════════════════════════════ */
const Spinner = () => (
  <span style={{ display:"inline-block", width:18, height:18, border:"2.5px solid rgba(255,255,255,0.3)",
    borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite", verticalAlign:"middle", marginRight:8 }} />
);

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */
const Toast = ({ msg, type }) => {
  if (!msg) return null;
  return (
    <div className="scale-in" style={{
      padding:"12px 18px", borderRadius:12, fontSize:14, fontWeight:500, marginBottom:18,
      background: type==="error" ? "rgba(255,92,92,0.12)" : "rgba(0,212,170,0.12)",
      border: `1px solid ${type==="error" ? "rgba(255,92,92,0.25)" : "rgba(0,212,170,0.25)"}`,
      color: type==="error" ? "#ff9090" : "#00d4aa",
    }}>
      {type==="error" ? "⚠️ " : "✅ "}{msg}
    </div>
  );
};

/* ══════════════════════════════════════════════
   AUTH CARD WRAPPER
══════════════════════════════════════════════ */
const AuthCard = ({ children }) => (
  <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:"24px 16px" }}>
    {/* Logo */}
    <div className="fade-up" style={{ textAlign:"center", marginBottom:32 }}>
      <div style={{ width:64, height:64, borderRadius:20, margin:"0 auto 14px",
        background:"linear-gradient(135deg, #6c63ff, #ff6b9d)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:28, animation:"glow 3s ease-in-out infinite",
        boxShadow:"0 8px 32px rgba(108,99,255,0.4)" }}>⚡</div>
      <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:32, fontWeight:800,
        background:"linear-gradient(135deg, #fff 0%, #a89dff 100%)",
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        letterSpacing:"-0.02em" }}>TaskFlow</h1>
      <p style={{ fontSize:13, color:"var(--muted)", marginTop:6, letterSpacing:"0.06em" }}>
        Your tasks. Beautifully organized.
      </p>
    </div>

    {/* Card */}
    <div className="fade-up stagger-1" style={{
      width:"100%", maxWidth:440, borderRadius:24,
      background:"rgba(15,17,32,0.85)", backdropFilter:"blur(24px)",
      border:"1px solid rgba(255,255,255,0.09)",
      boxShadow:"0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
      padding:"36px 36px 32px",
    }}>
      {children}
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════ */
const LoginPage = ({ onSwitch, onLogin }) => {
  const [form, setForm]     = useState({ email:"", password:"" });
  const [errors, setErrors] = useState({});
  const [toast, setToast]   = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 6)  e.password = "Min 6 characters";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setLoading(true); setToast(null);
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ email:form.email, password:form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setToast({ msg:data.message, type:"error" }); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user",  JSON.stringify(data.user));
      setToast({ msg:"Login successful! Loading your tasks...", type:"success" });
      setTimeout(() => onLogin(data.user), 900);
    } catch {
      setToast({ msg:"Cannot connect to server. Is backend running?", type:"error" });
    } finally { setLoading(false); }
  };

  const kd = (e) => e.key === "Enter" && submit();

  return (
    <AuthCard>
      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid var(--border)", marginBottom:28 }}>
        {["Sign In","Sign Up"].map((t,i) => (
          <div key={t} className="auth-tab" onClick={i===1 ? onSwitch : undefined}
            style={{ flex:1, textAlign:"center", paddingBottom:14, fontSize:15, fontWeight:600,
              color: i===0 ? "var(--text)" : "var(--muted)",
              borderBottom: i===0 ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom:-1, transition:"all 0.2s" }}>
            {t}
          </div>
        ))}
      </div>

      <Toast {...(toast||{msg:null})} />

      <Field label="Email address" type="email" icon="✉️" placeholder="you@example.com"
        value={form.email} error={errors.email} onKeyDown={kd}
        onChange={e=>setForm({...form,email:e.target.value})} />

      <Field label="Password" type="password" icon="🔒" placeholder="Enter your password"
        value={form.password} error={errors.password} onKeyDown={kd}
        onChange={e=>setForm({...form,password:e.target.value})} />

      <div style={{ textAlign:"right", marginBottom:20, marginTop:-6 }}>
        <span style={{ fontSize:13, color:"var(--accent)", cursor:"pointer", fontWeight:500 }}>
          Forgot password?
        </span>
      </div>

      <button className="tf-btn-primary" onClick={submit} disabled={loading}>
        {loading ? <><Spinner />Signing in...</> : "Sign In →"}
      </button>

      <div style={{ textAlign:"center", marginTop:22, fontSize:14, color:"var(--muted)" }}>
        Don't have an account?{" "}
        <span onClick={onSwitch} style={{ color:"var(--accent)", cursor:"pointer", fontWeight:600 }}>
          Create one
        </span>
      </div>
    </AuthCard>
  );
};

/* ══════════════════════════════════════════════
   SIGNUP PAGE
══════════════════════════════════════════════ */
const SignupPage = ({ onSwitch, onLogin }) => {
  const [form, setForm]     = useState({ name:"", email:"", password:"", confirm:"" });
  const [errors, setErrors] = useState({});
  const [toast, setToast]   = useState(null);
  const [loading, setLoading] = useState(false);

  const strength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)  s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const sLevel = strength();
  const sColor = ["#ff5c5c","#ff5c5c","#ffaa2c","#00d4aa","#00d4aa","#6c63ff"][sLevel];
  const sLabel = ["","Weak","Fair","Good","Strong","Very Strong"][sLevel];

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 6)  e.password = "Min 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setLoading(true); setToast(null);
    try {
      const res  = await fetch(`${API}/auth/signup`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ name:form.name, email:form.email, password:form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setToast({ msg:data.message, type:"error" }); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user",  JSON.stringify(data.user));
      setToast({ msg:"Account created! Welcome to TaskFlow 🎉", type:"success" });
      setTimeout(() => onLogin(data.user), 900);
    } catch {
      setToast({ msg:"Cannot connect to server. Is backend running?", type:"error" });
    } finally { setLoading(false); }
  };

  const kd = (e) => e.key === "Enter" && submit();

  return (
    <AuthCard>
      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid var(--border)", marginBottom:28 }}>
        {["Sign In","Sign Up"].map((t,i) => (
          <div key={t} className="auth-tab" onClick={i===0 ? onSwitch : undefined}
            style={{ flex:1, textAlign:"center", paddingBottom:14, fontSize:15, fontWeight:600,
              color: i===1 ? "var(--text)" : "var(--muted)",
              borderBottom: i===1 ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom:-1 }}>
            {t}
          </div>
        ))}
      </div>

      <Toast {...(toast||{msg:null})} />

      <Field label="Full name" type="text" icon="👤" placeholder="John Doe"
        value={form.name} error={errors.name} onKeyDown={kd}
        onChange={e=>setForm({...form,name:e.target.value})} />

      <Field label="Email address" type="email" icon="✉️" placeholder="you@example.com"
        value={form.email} error={errors.email} onKeyDown={kd}
        onChange={e=>setForm({...form,email:e.target.value})} />

      <Field label="Password" type="password" icon="🔒" placeholder="Min. 6 characters"
        value={form.password} error={errors.password} onKeyDown={kd}
        onChange={e=>setForm({...form,password:e.target.value})} />

      {/* Password strength */}
      {form.password.length > 0 && (
        <div style={{ marginTop:-10, marginBottom:16 }}>
          <div style={{ display:"flex", gap:4, marginBottom:5 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ flex:1, height:3, borderRadius:99, transition:"background 0.3s",
                background: i<=sLevel ? sColor : "rgba(255,255,255,0.08)" }} />
            ))}
          </div>
          <div style={{ fontSize:11, color:sColor, fontWeight:600 }}>{sLabel}</div>
        </div>
      )}

      <Field label="Confirm password" type="password" icon="🔑" placeholder="Repeat password"
        value={form.confirm} error={errors.confirm} onKeyDown={kd}
        onChange={e=>setForm({...form,confirm:e.target.value})} />

      <button className="tf-btn-primary" onClick={submit} disabled={loading}>
        {loading ? <><Spinner />Creating account...</> : "Create Account →"}
      </button>

      <div style={{ textAlign:"center", marginTop:22, fontSize:14, color:"var(--muted)" }}>
        Already have an account?{" "}
        <span onClick={onSwitch} style={{ color:"var(--accent)", cursor:"pointer", fontWeight:600 }}>
          Sign in
        </span>
      </div>
    </AuthCard>
  );
};

/* ══════════════════════════════════════════════
   TODO APP
══════════════════════════════════════════════ */
const FILTERS = ["All","Active","Completed"];
const PRIORITIES = { high:"#ff6b9d", medium:"#ffaa2c", low:"#00d4aa" };

const TodoApp = ({ user, onLogout }) => {
  const [todos,   setTodos]   = useState([]);
  const [input,   setInput]   = useState("");
  const [priority,setPriority]= useState("medium");
  const [filter,  setFilter]  = useState("All");
  const [loading, setLoading] = useState(true);
  const [adding,  setAdding]  = useState(false);
  const [editId,  setEditId]  = useState(null);
  const [editText,setEditText]= useState("");
  const inputRef = useRef();

  const token = localStorage.getItem("token");
  const headers = { "Content-Type":"application/json", Authorization:`Bearer ${token}` };

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/todos`, { headers });
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch { setTodos([]); }
    finally { setLoading(false); }
  };

  const addTodo = async () => {
    if (!input.trim()) return;
    setAdding(true);
    try {
      const res  = await fetch(`${API}/todos`, { method:"POST", headers, body:JSON.stringify({ text:input, priority }) });
      const todo = await res.json();
      setTodos(prev => [todo,...prev]);
      setInput("");
      inputRef.current?.focus();
    } finally { setAdding(false); }
  };

  const deleteTodo = async (id) => {
    await fetch(`${API}/todos/${id}`, { method:"DELETE", headers });
    setTodos(prev => prev.filter(t => t._id !== id));
  };

  const toggleTodo = async (id) => {
    const res  = await fetch(`${API}/todos/${id}`, { method:"PUT", headers });
    const todo = await res.json();
    setTodos(prev => prev.map(t => t._id===id ? todo : t));
  };

  const filtered = todos.filter(t =>
    filter==="All" ? true : filter==="Active" ? !t.completed : t.completed
  );

  const done  = todos.filter(t=>t.completed).length;
  const pct   = todos.length ? Math.round(done/todos.length*100) : 0;

  return (
    <div style={{ position:"relative", zIndex:1, minHeight:"100vh", display:"flex", flexDirection:"column" }}>

      {/* ── HEADER ── */}
      <header className="fade-in" style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"18px 28px", borderBottom:"1px solid var(--border)",
        background:"rgba(7,8,15,0.8)", backdropFilter:"blur(20px)",
        position:"sticky", top:0, zIndex:10,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#6c63ff,#ff6b9d)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚡</div>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700,
            background:"linear-gradient(135deg,#fff,#a89dff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            TaskFlow
          </span>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{user.name}</div>
            <div style={{ fontSize:11, color:"var(--muted)" }}>{user.email}</div>
          </div>
          <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#6c63ff,#ff6b9d)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:700, cursor:"pointer" }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button className="tf-btn-ghost" onClick={onLogout} style={{ padding:"8px 14px", fontSize:13 }}>
            Sign out
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ flex:1, maxWidth:680, width:"100%", margin:"0 auto", padding:"36px 20px 80px" }}>

        {/* Title */}
        <div className="fade-up" style={{ marginBottom:32 }}>
          <div style={{ fontSize:13, letterSpacing:"0.15em", color:"var(--accent)", textTransform:"uppercase",
            fontWeight:600, marginBottom:10 }}>✦ My Workspace</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(30px,5vw,42px)", fontWeight:800,
            lineHeight:1.1, letterSpacing:"-0.02em" }}>
            Get Things <span style={{ background:"linear-gradient(90deg,#6c63ff,#ff6b9d)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Done.</span>
          </h2>
          <p style={{ fontSize:15, color:"var(--muted)", marginTop:8 }}>
            {todos.length===0 ? "Add your first task below." : `${done} of ${todos.length} tasks completed`}
          </p>
        </div>

        {/* Progress card */}
        {todos.length > 0 && (
          <div className="fade-up stagger-1" style={{
            borderRadius:20, padding:"20px 24px", marginBottom:24,
            background:"rgba(108,99,255,0.08)", border:"1px solid rgba(108,99,255,0.2)",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:13, color:"var(--muted)", fontWeight:500 }}>Overall progress</span>
              <span style={{ fontSize:22, fontWeight:800, color:"var(--accent)" }}>{pct}%</span>
            </div>
            <div style={{ height:8, borderRadius:99, background:"rgba(255,255,255,0.07)", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, borderRadius:99, transition:"width 0.6s cubic-bezier(0.4,0,0.2,1)",
                background:"linear-gradient(90deg,#6c63ff,#ff6b9d)" }} />
            </div>
            {/* Stats row */}
            <div style={{ display:"flex", gap:20, marginTop:14 }}>
              {[{ l:"Total", v:todos.length, c:"#a89dff" },{ l:"Active", v:todos.filter(t=>!t.completed).length, c:"#ff6b9d" },
                { l:"Done",  v:done, c:"#00d4aa" }].map(s=>(
                <div key={s.l}>
                  <div style={{ fontSize:18, fontWeight:700, color:s.c }}>{s.v}</div>
                  <div style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.07em" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Task */}
        <div className="fade-up stagger-2" style={{
          borderRadius:20, padding:"20px 22px", marginBottom:24,
          background:"rgba(15,17,32,0.7)", border:"1px solid var(--border)",
          backdropFilter:"blur(12px)",
        }}>
          <div style={{ fontSize:12, fontWeight:600, color:"var(--muted)", letterSpacing:"0.1em",
            textTransform:"uppercase", marginBottom:14 }}>Add New Task</div>

          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {/* Input */}
            <div style={{ position:"relative", flex:"1 1 200px" }}>
              <span style={{ position:"absolute", left:15, top:"50%", transform:"translateY(-50%)", fontSize:16 }}>📝</span>
              <input ref={inputRef} className="tf-input" value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addTodo()}
                placeholder="What needs to be done?" />
            </div>

            {/* Priority */}
            <select value={priority} onChange={e=>setPriority(e.target.value)}
              style={{
                background:"rgba(255,255,255,0.05)", border:"1.5px solid var(--border)",
                borderRadius:14, padding:"14px 14px", color:"var(--text)", fontSize:14,
                cursor:"pointer", outline:"none", transition:"border-color 0.2s",
                minWidth:120,
              }}>
              <option value="high"   style={{background:"#0f1120"}}>🔴 High</option>
              <option value="medium" style={{background:"#0f1120"}}>🟡 Medium</option>
              <option value="low"    style={{background:"#0f1120"}}>🟢 Low</option>
            </select>

            {/* Add button */}
            <button onClick={addTodo} disabled={adding}
              style={{
                padding:"14px 24px", borderRadius:14, border:"none", cursor:"pointer",
                background:"linear-gradient(135deg,#6c63ff,#9b59b6)", color:"#fff",
                fontSize:15, fontWeight:700, transition:"all 0.2s",
                boxShadow:"0 4px 20px rgba(108,99,255,0.35)",
                opacity: adding ? 0.7 : 1,
              }}
              onMouseOver={e=>!adding&&(e.target.style.transform="translateY(-2px)")}
              onMouseOut={e=>(e.target.style.transform="translateY(0)")}>
              {adding ? "Adding..." : "+ Add"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="fade-up stagger-3" style={{ display:"flex", gap:6, marginBottom:20 }}>
          {FILTERS.map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{
                flex:1, padding:"10px 0", border:"none", borderRadius:12, cursor:"pointer",
                fontSize:13, fontWeight:600,
                background: filter===f ? "rgba(108,99,255,0.2)" : "transparent",
                color: filter===f ? "#a89dff" : "var(--muted)",
                borderBottom: filter===f ? "2px solid var(--accent)" : "2px solid transparent",
                transition:"all 0.2s",
              }}>
              {f}
              <span style={{ marginLeft:6, fontSize:11, opacity:0.7,
                background:"rgba(255,255,255,0.08)", padding:"1px 6px", borderRadius:99 }}>
                {f==="All"?todos.length:f==="Active"?todos.filter(t=>!t.completed).length:done}
              </span>
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="fade-up stagger-4" style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {loading ? (
            <div style={{ textAlign:"center", padding:"48px 0", color:"var(--muted)" }}>
              <Spinner /><span style={{ fontSize:14 }}>Loading tasks...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"56px 0", color:"var(--muted2)" }}>
              <div style={{ fontSize:40, marginBottom:12, animation:"float 3s ease-in-out infinite" }}>
                {filter==="Completed" ? "🏆" : "🌙"}
              </div>
              <div style={{ fontSize:16, fontWeight:500, color:"var(--muted)" }}>
                {filter==="Completed" ? "No completed tasks yet" : filter==="Active" ? "No active tasks!" : "All quiet here"}
              </div>
              <div style={{ fontSize:13, marginTop:6, color:"var(--muted2)" }}>
                {filter==="All" ? "Add a task above to get started" : ""}
              </div>
            </div>
          ) : filtered.map((todo, idx) => (
            <div key={todo._id} className="todo-item slide-in"
              style={{
                animationDelay:`${idx*0.04}s`,
                display:"flex", alignItems:"center", gap:14,
                padding:"16px 18px", borderRadius:16,
                background: todo.completed ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                border:"1px solid var(--border)",
                opacity: todo.completed ? 0.7 : 1,
              }}>

              {/* Checkbox */}
              <div className="check-ring" onClick={()=>toggleTodo(todo._id)}
                style={{
                  width:24, height:24, borderRadius:"50%", cursor:"pointer", flexShrink:0,
                  border:`2px solid ${todo.completed ? "#6c63ff" : "rgba(255,255,255,0.2)"}`,
                  background: todo.completed ? "linear-gradient(135deg,#6c63ff,#9b59b6)" : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                {todo.completed && (
                  <svg width="12" height="12" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>

              {/* Text */}
              <div style={{ flex:1, minWidth:0 }}>
                {editId===todo._id ? (
                  <input autoFocus value={editText} onChange={e=>setEditText(e.target.value)}
                    onBlur={async()=>{
                      if(editText.trim()&&editText!==todo.text){
                        // optimistic update (backend doesn't have edit route — extend if needed)
                        setTodos(p=>p.map(t=>t._id===todo._id?{...t,text:editText}:t));
                      }
                      setEditId(null);
                    }}
                    onKeyDown={e=>{
                      if(e.key==="Enter"){ e.target.blur(); }
                      if(e.key==="Escape"){ setEditId(null); }
                    }}
                    style={{ background:"rgba(108,99,255,0.1)", border:"1.5px solid var(--accent)",
                      borderRadius:8, padding:"4px 10px", color:"var(--text)", fontSize:15, width:"100%", outline:"none" }}
                  />
                ) : (
                  <span onDoubleClick={()=>{ setEditId(todo._id); setEditText(todo.text); }}
                    title="Double-click to edit"
                    style={{ fontSize:15, fontWeight:500,
                      color: todo.completed ? "var(--muted)" : "var(--text)",
                      textDecoration: todo.completed ? "line-through" : "none",
                      display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                    }}>{todo.text}</span>
                )}
                <div style={{ fontSize:11, color:"var(--muted2)", marginTop:3 }}>
                  {todo.createdAt ? new Date(todo.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : ""}
                </div>
              </div>

              {/* Priority dot */}
              {todo.priority && (
                <div style={{ width:8, height:8, borderRadius:"50%", flexShrink:0,
                  background:PRIORITIES[todo.priority]||"#ffaa2c",
                  boxShadow:`0 0 6px ${PRIORITIES[todo.priority]||"#ffaa2c"}` }} />
              )}

              {/* Delete */}
              <button onClick={()=>deleteTodo(todo._id)}
                style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 6px",
                  color:"rgba(255,92,92,0.5)", fontSize:18, transition:"color 0.2s, transform 0.2s",
                  lineHeight:1 }}
                onMouseOver={e=>{ e.target.style.color="#ff5c5c"; e.target.style.transform="scale(1.2)"; }}
                onMouseOut={e=>{ e.target.style.color="rgba(255,92,92,0.5)"; e.target.style.transform="scale(1)"; }}>
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Clear completed */}
        {done > 0 && (
          <div style={{ textAlign:"right", marginTop:16 }}>
            <button className="tf-btn-ghost"
              onClick={async()=>{
                const completed = todos.filter(t=>t.completed);
                await Promise.all(completed.map(t=>fetch(`${API}/todos/${t._id}`,{method:"DELETE",headers})));
                setTodos(p=>p.filter(t=>!t.completed));
              }}
              style={{ fontSize:13, padding:"8px 16px", color:"var(--danger)", borderColor:"rgba(255,92,92,0.3)" }}>
              Clear {done} completed
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

/* ══════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Make sure user has a name before restoring
        if (parsed && parsed.name) setUser(parsed);
        else localStorage.removeItem("user");
      }
    } catch {
      localStorage.removeItem("user");
    }
  }, []);

  const handleLogin  = (u) => setUser(u);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("login");
  };

  return (
    <>
      <GlobalStyles />
      <Background />
      {user ? (
        <TodoApp user={user} onLogout={handleLogout} />
      ) : page==="login" ? (
        <LoginPage  onSwitch={()=>setPage("signup")} onLogin={handleLogin} />
      ) : (
        <SignupPage onSwitch={()=>setPage("login")}  onLogin={handleLogin} />
      )}
    </>
  );
}
