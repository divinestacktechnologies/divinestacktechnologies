// src/pages/Admin.jsx — Full Admin Panel with JWT + bcrypt auth
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  login, logout, getMe, updateProfile, changePassword,
  getEnquiries, getStats, updateStatus, deleteEnquiry,
  getAdminUsers, createAdminUser, toggleUser, deleteAdminUser
} from '../api';
import '../styles/Admin.css';

const fmt  = (d) => d ? new Date(d).toLocaleDateString('en-IN',  { day:'2-digit', month:'short', year:'numeric' }) : '—';
const fmtT = (d) => d ? new Date(d).toLocaleString('en-IN',  { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';
const STATUS_COLOR = { new:'#10b981', in_progress:'#f59e0b', closed:'#6B7280' };
const STATUS_LABEL = { new:'New', in_progress:'In Progress', closed:'Closed' };

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  return <div className={`a-toast a-toast--${type}`}>{msg}</div>;
}

function Avatar({ name='?', size=36 }) {
  const initials = (name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', flexShrink:0,
      background:'linear-gradient(135deg,#2563EB,#00D4FF)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'Orbitron,sans-serif', fontSize:size*.32, fontWeight:700, color:'#000' }}>
      {initials}
    </div>
  );
}

/* LOGIN */
function LoginScreen({ onLogin }) {
  const [form, setForm]     = useState({ username:'', password:'' });
  const [err, setErr]       = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) { setErr('Both fields required'); return; }
    setErr(''); setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem('dst_token', res.data.token);
      localStorage.setItem('dst_admin', JSON.stringify(res.data.admin));
      onLogin(res.data.admin);
    } catch(e2) {
      setErr(e2.response?.data?.message || 'Login failed. Check credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="a-login-wrap">
      <div className="a-login-card">
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <img src="/logo.png" alt="Divine Stack Technologies" style={{ width:64, height:64, objectFit:'contain', margin:'0 auto .8rem' }} />
          <div style={{ fontFamily:'Orbitron,sans-serif', fontSize:'1.5rem', fontWeight:700,
            background:'linear-gradient(90deg,#00D4FF,#2563EB)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Divine<span style={{fontWeight:400}}>Stack</span>
          </div>
          <p style={{ color:'#9CA3AF', fontSize:'.85rem', marginTop:'.4rem' }}>Admin Panel</p>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="form-group">
            <label>Username or Email</label>
            <input type="text" value={form.username} onChange={set('username')}
              placeholder="username or email" autoComplete="username" />
          </div>
          <div className="form-group" style={{ position:'relative' }}>
            <label>Password</label>
            <input type={showPw?'text':'password'} value={form.password} onChange={set('password')}
              placeholder="password" autoComplete="current-password" />
            <button type="button" onClick={()=>setShowPw(v=>!v)}
              style={{ position:'absolute', right:12, top:34, background:'none', border:'none',
                color:'#9CA3AF', cursor:'pointer', fontSize:'1.1rem' }}>
              {showPw?'🙈':'👁️'}
            </button>
          </div>
          {err && <p style={{ color:'#f87171', fontSize:'.85rem', marginBottom:'1rem' }}>{err}</p>}
          <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
            {loading ? '⏳ Logging in...' : '🔐 Login'}
          </button>
        </form>
        <p style={{ color:'#4B5563', fontSize:'.75rem', textAlign:'center', marginTop:'1.5rem' }}>
          First time? Run <code style={{color:'#00D4FF'}}>node setup-admin.js</code> in backend folder
        </p>
      </div>
    </div>
  );
}

/* PROFILE */
function ProfilePage({ admin, onUpdate, addToast }) {
  const [pf, setPf] = useState({ full_name:admin.full_name||'', email:admin.email||'', phone:admin.phone||'' });
  const [pw, setPw] = useState({ current_password:'', new_password:'', confirm_password:'' });
  const [pfLoad, setPfLoad] = useState(false);
  const [pwLoad, setPwLoad] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const setP = k => e => setPf(f=>({...f,[k]:e.target.value}));
  const setW = k => e => setPw(f=>({...f,[k]:e.target.value}));

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!pf.full_name||!pf.email) { addToast('Name and email required','error'); return; }
    setPfLoad(true);
    try {
      const res = await updateProfile(pf);
      localStorage.setItem('dst_admin', JSON.stringify(res.data.data));
      onUpdate(res.data.data);
      addToast('Profile updated!','success');
    } catch(e2) { addToast(e2.response?.data?.message||'Failed','error'); }
    finally { setPfLoad(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.new_password.length < 8) { addToast('Min 8 characters','error'); return; }
    if (pw.new_password !== pw.confirm_password) { addToast('Passwords do not match','error'); return; }
    setPwLoad(true);
    try {
      await changePassword(pw);
      setPw({ current_password:'', new_password:'', confirm_password:'' });
      addToast('Password changed successfully!','success');
    } catch(e2) { addToast(e2.response?.data?.message||'Failed','error'); }
    finally { setPwLoad(false); }
  };

  const strength = [
    { label:'8+ characters', ok: pw.new_password.length >= 8 },
    { label:'Uppercase letter', ok: /[A-Z]/.test(pw.new_password) },
    { label:'Number', ok: /\d/.test(pw.new_password) },
    { label:'Special char (!@#$...)', ok: /[!@#$%^&*]/.test(pw.new_password) },
  ];

  return (
    <div className="a-content">
      <h2 className="a-page-title">My Profile</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>

        <div className="a-card">
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem',
            paddingBottom:'1rem', borderBottom:'1px solid rgba(0,212,255,.12)' }}>
            <Avatar name={admin.full_name||admin.username} size={52} />
            <div>
              <div style={{ fontFamily:'Orbitron,sans-serif', fontWeight:600, fontSize:'.95rem' }}>
                {admin.full_name||admin.username}
              </div>
              <div style={{ fontSize:'.78rem', color:'#00D4FF', marginTop:2 }}>
                {admin.role.replace('_',' ').toUpperCase()}
              </div>
              <div style={{ fontSize:'.72rem', color:'#6B7280', marginTop:2 }}>
                Last login: {fmtT(admin.last_login)}
              </div>
            </div>
          </div>
          <form onSubmit={saveProfile}>
            <div className="form-group">
              <label>Full Name *</label>
              <input value={pf.full_name} onChange={setP('full_name')} placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" value={pf.email} onChange={setP('email')} placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" value={pf.phone} onChange={setP('phone')} placeholder="+91 xxxxx xxxxx" />
            </div>
            <div className="form-group">
              <label>Username <span style={{color:'#6B7280', fontSize:'.75rem'}}>(cannot be changed)</span></label>
              <input value={admin.username} disabled style={{ opacity:.5, cursor:'not-allowed' }} />
            </div>
            <button type="submit" className="btn-primary" disabled={pfLoad}>
              {pfLoad?'⏳ Saving...':'💾 Save Profile'}
            </button>
          </form>
        </div>

        <div className="a-card">
          <h3 style={{ fontFamily:'Orbitron,sans-serif', fontSize:'.9rem',
            color:'#00D4FF', marginBottom:'1.2rem' }}>🔒 Change Password</h3>
          <form onSubmit={savePassword}>
            <div className="form-group">
              <label>Current Password *</label>
              <input type={showPw?'text':'password'} value={pw.current_password}
                onChange={setW('current_password')} placeholder="Current password" />
            </div>
            <div className="form-group">
              <label>New Password * <span style={{color:'#6B7280',fontSize:'.75rem'}}>(min 8 chars)</span></label>
              <input type={showPw?'text':'password'} value={pw.new_password}
                onChange={setW('new_password')} placeholder="New password" />
            </div>
            {pw.new_password && (
              <div style={{ marginBottom:'1rem', background:'rgba(255,255,255,.03)',
                borderRadius:8, padding:'10px 12px', border:'1px solid rgba(0,212,255,.1)' }}>
                {strength.map(s => (
                  <div key={s.label} style={{ display:'flex', alignItems:'center', gap:6,
                    fontSize:'.78rem', color:s.ok?'#10b981':'#6B7280', marginBottom:3 }}>
                    <span>{s.ok?'✅':'⬜'}</span>{s.label}
                  </div>
                ))}
              </div>
            )}
            <div className="form-group">
              <label>Confirm New Password *</label>
              <input type={showPw?'text':'password'} value={pw.confirm_password}
                onChange={setW('confirm_password')} placeholder="Confirm new password" />
            </div>
            <label style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1rem',
              fontSize:'.85rem', color:'#9CA3AF', cursor:'pointer' }}>
              <input type="checkbox" checked={showPw} onChange={e=>setShowPw(e.target.checked)} />
              Show passwords
            </label>
            <button type="submit" className="btn-primary" disabled={pwLoad}>
              {pwLoad?'⏳ Changing...':'🔐 Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* DASHBOARD */
function Dashboard({ addToast }) {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getStats().then(r=>setStats(r.data.data)).catch(()=>addToast('Failed to load stats','error')).finally(()=>setLoading(false));
  }, [addToast]);

  if (loading) return <div className="a-content"><p style={{color:'#9CA3AF'}}>Loading...</p></div>;
  if (!stats)  return <div className="a-content"><p style={{color:'#f87171'}}>Failed to load</p></div>;
  const t = stats.totals;
  const maxSvc = Math.max(...(stats.byService.map(s=>s.count)||[1]), 1);
  const maxDay = Math.max(...(stats.daily.map(d=>d.count)||[1]), 1);

  return (
    <div className="a-content">
      <h2 className="a-page-title">Dashboard</h2>
      <div className="a-stat-grid">
        {[
          { label:'Total',       val:t.total||0,       color:'#00D4FF', icon:'📊' },
          { label:'New',         val:t.new_count||0,   color:'#10b981', icon:'🆕' },
          { label:'In Progress', val:t.in_progress||0, color:'#f59e0b', icon:'⚙️' },
          { label:'Closed',      val:t.closed||0,      color:'#6B7280', icon:'✅' },
          { label:'Today',       val:t.today||0,       color:'#8b5cf6', icon:'📅' },
          { label:'This Week',   val:t.this_week||0,   color:'#ec4899', icon:'📆' },
          { label:'Via Popup',   val:t.from_popup||0,  color:'#f97316', icon:'💬' },
          { label:'Contact Form',val:t.from_contact||0,color:'#06b6d4', icon:'📝' },
        ].map(s => (
          <div className="a-stat-card" key={s.label}>
            <div style={{fontSize:'1.5rem',marginBottom:'.4rem'}}>{s.icon}</div>
            <div style={{fontFamily:'Orbitron,sans-serif',fontSize:'2rem',fontWeight:900,color:s.color,lineHeight:1}}>
              {s.val}
            </div>
            <div style={{fontSize:'.78rem',color:'#9CA3AF',marginTop:'.3rem'}}>{s.label}</div>
          </div>
        ))}
      </div>

      {stats.byService.length > 0 && (
        <div className="a-card" style={{marginTop:'1.5rem'}}>
          <h3 style={{fontFamily:'Orbitron,sans-serif',fontSize:'.9rem',color:'#00D4FF',marginBottom:'1.2rem'}}>
            Enquiries by Service
          </h3>
          {stats.byService.map(s => (
            <div key={s.service} style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:12}}>
              <div style={{width:190,fontSize:'.83rem',color:'#D1D5DB',flexShrink:0,
                overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.service}</div>
              <div style={{flex:1,height:8,background:'rgba(255,255,255,.08)',borderRadius:4,overflow:'hidden'}}>
                <div style={{width:`${(s.count/maxSvc)*100}%`,height:'100%',
                  background:'linear-gradient(90deg,#00D4FF,#2563EB)',borderRadius:4,transition:'width .6s'}} />
              </div>
              <div style={{width:24,textAlign:'right',fontSize:'.85rem',color:'#00D4FF',fontWeight:600}}>{s.count}</div>
            </div>
          ))}
        </div>
      )}

      {stats.daily.length > 0 && (
        <div className="a-card" style={{marginTop:'1.5rem'}}>
          <h3 style={{fontFamily:'Orbitron,sans-serif',fontSize:'.9rem',color:'#00D4FF',marginBottom:'1.2rem'}}>
            Last 30 Days — Daily Enquiries
          </h3>
          <div style={{display:'flex',alignItems:'flex-end',gap:3,height:80,marginBottom:8}}>
            {stats.daily.map(d => (
              <div key={d.date}
                title={`${new Date(d.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}: ${d.count} enquiries`}
                style={{flex:1,height:Math.max(4,Math.round((d.count/maxDay)*80)),
                  background:'linear-gradient(180deg,#00D4FF,#2563EB)',
                  borderRadius:'2px 2px 0 0',cursor:'default',transition:'opacity .2s'}}
                onMouseEnter={e=>e.currentTarget.style.opacity='.65'}
                onMouseLeave={e=>e.currentTarget.style.opacity='1'} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ENQUIRIES */
function EnquiriesPage({ addToast }) {
  const [rows, setRows]   = useState([]);
  const [pg, setPg]       = useState({});
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters]   = useState({ page:1, limit:15, status:'', search:'', source:'' });
  const debRef = useRef(null);

  const fetchData = useCallback(async (f) => {
    setLoading(true);
    try { const r = await getEnquiries(f); setRows(r.data.data); setPg(r.data.pagination); }
    catch { addToast('Failed to load enquiries','error'); }
    finally { setLoading(false); }
  }, [addToast]);

  useEffect(() => { fetchData(filters); }, [filters, fetchData]);

  const setSearch = v => { clearTimeout(debRef.current); debRef.current = setTimeout(()=>setFilters(f=>({...f,search:v,page:1})),400); };

  const changeStatus = async (id, status, e) => {
    e.stopPropagation();
    try { await updateStatus(id,status); setRows(r=>r.map(x=>x.id===id?{...x,status}:x)); addToast('Status updated','success'); }
    catch { addToast('Failed','error'); }
  };

  const remove = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this enquiry permanently?')) return;
    try {
      await deleteEnquiry(id); setRows(r=>r.filter(x=>x.id!==id));
      addToast('Deleted','success');
      if (selected?.id===id) setSelected(null);
    } catch { addToast('Failed to delete','error'); }
  };

  return (
    <div className="a-content">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'1rem'}}>
        <h2 className="a-page-title" style={{margin:0}}>Enquiries</h2>
        <button className="btn-outline" style={{padding:'8px 16px',fontSize:'.85rem'}} onClick={()=>fetchData(filters)}>⟳ Refresh</button>
      </div>

      <div style={{display:'flex',gap:10,marginBottom:'1.2rem',flexWrap:'wrap'}}>
        <input className="a-input" placeholder="🔍  Search name, email, phone, service..."
          onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:200}} />
        <select className="a-input" style={{width:150}} value={filters.status}
          onChange={e=>setFilters(f=>({...f,status:e.target.value,page:1}))}>
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <select className="a-input" style={{width:145}} value={filters.source}
          onChange={e=>setFilters(f=>({...f,source:e.target.value,page:1}))}>
          <option value="">All Sources</option>
          <option value="popup">Popup</option>
          <option value="contact">Contact Form</option>
        </select>
      </div>

      {loading ? <p style={{color:'#9CA3AF'}}>Loading...</p> : (
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr><th>ID</th><th>Source</th><th>Name</th><th>Email</th><th>Service</th><th>Status</th><th>Date</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map(r=>(
                <tr key={r.id} onClick={()=>setSelected(r)} style={{cursor:'pointer'}}>
                  <td style={{color:'#00D4FF',fontFamily:'monospace'}}>#{r.id}</td>
                  <td><span className={`a-badge a-badge--${r.source}`}>{r.source}</span></td>
                  <td style={{fontWeight:500}}>{r.full_name}</td>
                  <td style={{color:'#9CA3AF',fontSize:'.83rem'}}>{r.email}</td>
                  <td style={{fontSize:'.8rem',color:'#D1D5DB'}}>{r.service||'—'}</td>
                  <td>
                    <select className="a-status-sel" value={r.status} style={{color:STATUS_COLOR[r.status]}}
                      onClick={e=>e.stopPropagation()} onChange={e=>changeStatus(r.id,e.target.value,e)}>
                      {Object.entries(STATUS_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}
                    </select>
                  </td>
                  <td style={{fontSize:'.8rem',color:'#9CA3AF'}}>{fmt(r.created_at)}</td>
                  <td><button className="a-del-btn" onClick={e=>remove(r.id,e)} title="Delete">🗑</button></td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan={8} style={{textAlign:'center',color:'#6B7280',padding:'2.5rem'}}>No enquiries found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {pg.totalPages > 1 && (
        <div style={{display:'flex',alignItems:'center',gap:'1rem',marginTop:'1rem',flexWrap:'wrap'}}>
          <button className="a-pg-btn" disabled={filters.page<=1} onClick={()=>setFilters(f=>({...f,page:f.page-1}))}>← Prev</button>
          <span style={{fontSize:'.85rem',color:'#9CA3AF'}}>Page {pg.page} / {pg.totalPages} · {pg.total} total</span>
          <button className="a-pg-btn" disabled={filters.page>=pg.totalPages} onClick={()=>setFilters(f=>({...f,page:f.page+1}))}>Next →</button>
        </div>
      )}

      {selected && (
        <div className="popup-overlay" onClick={()=>setSelected(null)}>
          <div className="popup-box" style={{maxWidth:560}} onClick={e=>e.stopPropagation()}>
            <button className="popup-close" onClick={()=>setSelected(null)}>✕</button>
            <div className="popup-badge">ENQUIRY #{selected.id}</div>
            <h3 style={{fontFamily:'Orbitron,sans-serif',fontSize:'1.05rem',margin:'.5rem 0 1.2rem'}}>{selected.full_name}</h3>
            {[
              ['Source',  <span className={`a-badge a-badge--${selected.source}`}>{selected.source}</span>],
              ['Email',   selected.email],
              ['Phone',   selected.phone||'—'],
              ['Service', selected.service||'—'],
              ['Budget',  selected.budget||'—'],
              ['Status',  <select className="a-status-sel" value={selected.status}
                style={{color:STATUS_COLOR[selected.status]}}
                onChange={async e=>{
                  const ns=e.target.value;
                  await updateStatus(selected.id,ns);
                  setSelected(s=>({...s,status:ns}));
                  setRows(r=>r.map(x=>x.id===selected.id?{...x,status:ns}:x));
                  addToast('Status updated','success');
                }}>
                {Object.entries(STATUS_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>],
              ['Received', fmtT(selected.created_at)],
            ].map(([l,v])=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'9px 0',borderBottom:'1px solid rgba(0,212,255,.1)'}}>
                <span style={{color:'#6B7280',width:70,flexShrink:0,fontSize:'.8rem'}}>{l}</span>
                <span style={{fontSize:'.88rem'}}>{v}</span>
              </div>
            ))}
            {selected.message && (
              <div style={{marginTop:'1rem'}}>
                <div style={{color:'#6B7280',fontSize:'.78rem',marginBottom:'.4rem'}}>Message</div>
                <p style={{color:'#D1D5DB',fontSize:'.88rem',lineHeight:1.8,whiteSpace:'pre-wrap',
                  background:'rgba(255,255,255,.04)',padding:'12px',borderRadius:8,margin:0}}>{selected.message}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* USERS */
function CreateUserModal({ onClose, onCreated, addToast }) {
  const [form, setForm] = useState({ full_name:'', username:'', email:'', phone:'', password:'', confirm_password:'', role:'admin' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));

  const strength = [
    { label:'8+ characters', ok: form.password.length >= 8 },
    { label:'Uppercase letter', ok: /[A-Z]/.test(form.password) },
    { label:'Number', ok: /\d/.test(form.password) },
    { label:'Special char (!@#$...)', ok: /[!@#$%^&*]/.test(form.password) },
  ];

  const submit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.username || !form.email || !form.password) {
      addToast('All required fields must be filled', 'error'); return;
    }
    if (form.password.length < 8) { addToast('Password must be at least 8 characters', 'error'); return; }
    if (form.password !== form.confirm_password) { addToast('Passwords do not match', 'error'); return; }

    setLoading(true);
    try {
      const { confirm_password, ...payload } = form;
      const res = await createAdminUser(payload);
      addToast(`Admin user "${form.username}" created successfully!`, 'success');
      onCreated(res.data.data);
      onClose();
    } catch(e2) {
      addToast(e2.response?.data?.message || 'Failed to create user', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" style={{maxWidth:480}} onClick={e=>e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>✕</button>
        <div className="popup-badge">➕ NEW ADMIN ACCOUNT</div>
        <h3 style={{fontFamily:'Orbitron,sans-serif',fontSize:'1.1rem',margin:'.5rem 0 1.3rem'}}>
          Create New Login
        </h3>

        <form onSubmit={submit} noValidate>
          <div className="form-group">
            <label>Full Name *</label>
            <input value={form.full_name} onChange={set('full_name')} placeholder="e.g. Priya Sharma" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Username *</label>
              <input value={form.username} onChange={set('username')} placeholder="priya.sharma" autoComplete="off" />
            </div>
            <div className="form-group">
              <label>Role *</label>
              <select value={form.role} onChange={set('role')}>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="priya@example.com" />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 xxxxx xxxxx" />
          </div>

          <div className="form-group">
            <label>Password * <span style={{color:'#6B7280',fontSize:'.75rem'}}>(min 8 chars)</span></label>
            <input type={showPw?'text':'password'} value={form.password} onChange={set('password')} placeholder="Set a password" autoComplete="new-password" />
          </div>

          {form.password && (
            <div style={{ marginBottom:'1rem', background:'rgba(255,255,255,.03)',
              borderRadius:8, padding:'10px 12px', border:'1px solid rgba(0,212,255,.1)' }}>
              {strength.map(s => (
                <div key={s.label} style={{ display:'flex', alignItems:'center', gap:6,
                  fontSize:'.78rem', color:s.ok?'#10b981':'#6B7280', marginBottom:3 }}>
                  <span>{s.ok?'✅':'⬜'}</span>{s.label}
                </div>
              ))}
            </div>
          )}

          <div className="form-group">
            <label>Confirm Password *</label>
            <input type={showPw?'text':'password'} value={form.confirm_password} onChange={set('confirm_password')} placeholder="Repeat password" />
          </div>

          <label style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1.3rem',
            fontSize:'.85rem', color:'#9CA3AF', cursor:'pointer' }}>
            <input type="checkbox" checked={showPw} onChange={e=>setShowPw(e.target.checked)} />
            Show passwords
          </label>

          <button type="submit" className="btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={loading}>
            {loading ? '⏳ Creating...' : '✅ Create Admin Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

function UsersPage({ currentAdmin, addToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    getAdminUsers().then(r=>setUsers(r.data.data)).catch(()=>addToast('Failed to load users','error')).finally(()=>setLoading(false));
  }, [addToast]);

  useEffect(()=>{ fetchUsers(); },[fetchUsers]);

  const toggle = async (id, is_active) => {
    try {
      await toggleUser(id, is_active);
      setUsers(u=>u.map(x=>x.id===id?{...x,is_active:is_active?1:0}:x));
      addToast(`User ${is_active?'activated':'deactivated'}`,'success');
    } catch(e) { addToast(e.response?.data?.message||'Failed','error'); }
  };

  const remove = async (id, username) => {
    if (!window.confirm(`Delete admin login "${username}" permanently?`)) return;
    try {
      await deleteAdminUser(id);
      setUsers(u=>u.filter(x=>x.id!==id));
      addToast('Admin user deleted','success');
    } catch(e) { addToast(e.response?.data?.message||'Failed to delete','error'); }
  };

  return (
    <div className="a-content">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'1rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <h2 className="a-page-title" style={{margin:0}}>Admin Users</h2>
          <span style={{background:'rgba(139,92,246,.15)',border:'1px solid rgba(139,92,246,.3)',
            borderRadius:8,padding:'5px 12px',fontSize:'.75rem',color:'#a78bfa'}}>Super Admin Only</span>
        </div>
        <button className="btn-primary" onClick={()=>setShowCreate(true)}>➕ New Admin Login</button>
      </div>

      {loading ? <p style={{color:'#9CA3AF'}}>Loading...</p> : (
        <div className="a-card" style={{padding:0,overflow:'hidden'}}>
          <table className="a-table">
            <thead><tr><th>User</th><th>Username</th><th>Role</th><th>Last Login</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <Avatar name={u.full_name||u.username} size={34} />
                      <div>
                        <div style={{fontWeight:500,fontSize:'.88rem'}}>{u.full_name||'—'}</div>
                        <div style={{fontSize:'.75rem',color:'#9CA3AF'}}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{fontFamily:'monospace',color:'#00D4FF',fontSize:'.88rem'}}>{u.username}</td>
                  <td>
                    <span style={{padding:'3px 10px',borderRadius:20,fontSize:'.72rem',fontWeight:600,
                      background:u.role==='super_admin'?'rgba(139,92,246,.15)':'rgba(0,212,255,.1)',
                      color:u.role==='super_admin'?'#a78bfa':'#00D4FF',
                      border:`1px solid ${u.role==='super_admin'?'rgba(139,92,246,.3)':'rgba(0,212,255,.2)'}`}}>
                      {u.role.replace('_',' ')}
                    </span>
                  </td>
                  <td style={{fontSize:'.8rem',color:'#9CA3AF'}}>{fmtT(u.last_login)}</td>
                  <td><span style={{fontSize:'.82rem',color:u.is_active?'#10b981':'#ef4444'}}>{u.is_active?'● Active':'○ Disabled'}</span></td>
                  <td>
                    {u.id!==currentAdmin.id ? (
                      <div style={{display:'flex',gap:6}}>
                        <button onClick={()=>toggle(u.id,!u.is_active)} style={{background:'none',
                          border:`1px solid ${u.is_active?'#ef444450':'#10b98150'}`,
                          color:u.is_active?'#ef4444':'#10b981',padding:'4px 10px',borderRadius:6,
                          cursor:'pointer',fontSize:'.76rem',fontFamily:'Inter,sans-serif'}}>
                          {u.is_active?'Disable':'Enable'}
                        </button>
                        <button onClick={()=>remove(u.id,u.username)} className="a-del-btn" title="Delete login">🗑</button>
                      </div>
                    ) : (
                      <span style={{fontSize:'.78rem',color:'#6B7280'}}>You</span>
                    )}
                  </td>
                </tr>
              ))}
              {!users.length && (
                <tr><td colSpan={6} style={{textAlign:'center',color:'#6B7280',padding:'2.5rem'}}>No admin users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <CreateUserModal
          onClose={()=>setShowCreate(false)}
          onCreated={(newUser)=>setUsers(u=>[newUser, ...u])}
          addToast={addToast}
        />
      )}
    </div>
  );
}

/* MAIN */
export default function Admin() {
  const [admin, setAdmin] = useState(()=>{ try { return JSON.parse(localStorage.getItem('dst_admin')); } catch { return null; } });
  const [tab, setTab]     = useState('dashboard');
  const [sideOpen, setSideOpen] = useState(false);
  const [toasts, setToasts]     = useState([]);

  useEffect(()=>{
    document.title = 'Admin | Divine Stack Technologies';
    const onLogout = () => { setAdmin(null); };
    window.addEventListener('dst_logout', onLogout);
    return ()=>window.removeEventListener('dst_logout', onLogout);
  },[]);

  useEffect(()=>{
    if (!admin) return;
    getMe().then(r=>setAdmin(r.data.data)).catch(()=>{
      localStorage.removeItem('dst_token'); localStorage.removeItem('dst_admin'); setAdmin(null);
    });
  },[]); // eslint-disable-line

  const addToast = useCallback((msg, type='success')=>{
    const id = Date.now(); setToasts(t=>[...t,{id,msg,type}]);
  },[]);
  const removeToast = useCallback((id)=>{ setToasts(t=>t.filter(x=>x.id!==id)); },[]);

  const handleLogout = async () => {
    try { await logout(); } catch {}
    localStorage.removeItem('dst_token'); localStorage.removeItem('dst_admin'); setAdmin(null);
  };

  if (!admin) return <LoginScreen onLogin={setAdmin} />;

  const NAV = [
    { id:'dashboard', icon:'📊', label:'Dashboard' },
    { id:'enquiries', icon:'📩', label:'Enquiries' },
    { id:'profile',   icon:'👤', label:'My Profile' },
    ...(admin.role==='super_admin' ? [{id:'users',icon:'👥',label:'Admin Users'}] : []),
  ];

  return (
    <div style={{display:'flex',minHeight:'100vh',paddingTop:70,position:'relative',zIndex:1}}>
      <div style={{position:'fixed',bottom:'2rem',right:'2rem',zIndex:9000,display:'flex',flexDirection:'column',gap:8}}>
        {toasts.map(t=><Toast key={t.id} msg={t.msg} type={t.type} onDone={()=>removeToast(t.id)} />)}
      </div>

      <aside className={`a-sidebar ${sideOpen?'a-sidebar--open':''}`}>
        <div style={{padding:'1.5rem 1.2rem 1rem',borderBottom:'1px solid rgba(0,212,255,.12)',
          display:'flex',alignItems:'center',gap:10}}>
          <img src="/logo.png" alt="Divine Stack Technologies" style={{width:32,height:32,objectFit:'contain'}} />
          <div>
            <div style={{fontFamily:'Orbitron,sans-serif',fontSize:'1.05rem',fontWeight:700,
              background:'linear-gradient(90deg,#00D4FF,#2563EB)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
              Divine<span style={{fontWeight:400}}>Stack</span>
            </div>
            <div style={{fontSize:'.68rem',color:'#6B7280'}}>Admin Panel</div>
          </div>
        </div>

        <div style={{padding:'1rem 1.2rem',borderBottom:'1px solid rgba(0,212,255,.08)',
          display:'flex',alignItems:'center',gap:10}}>
          <Avatar name={admin.full_name||admin.username} size={36} />
          <div style={{overflow:'hidden'}}>
            <div style={{fontSize:'.85rem',fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
              {admin.full_name||admin.username}
            </div>
            <div style={{fontSize:'.7rem',color:'#00D4FF'}}>{admin.role.replace('_',' ')}</div>
          </div>
        </div>

        <nav style={{flex:1,padding:'1rem .8rem'}}>
          {NAV.map(n=>(
            <button key={n.id} className={`a-nav-item ${tab===n.id?'a-nav-item--active':''}`}
              onClick={()=>{setTab(n.id);setSideOpen(false);}}>
              <span style={{fontSize:'1.1rem'}}>{n.icon}</span><span>{n.label}</span>
            </button>
          ))}
        </nav>

        <div style={{padding:'1rem .8rem',borderTop:'1px solid rgba(0,212,255,.08)'}}>
          <button className="a-nav-item" style={{color:'#f87171',width:'100%'}} onClick={handleLogout}>
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </aside>

      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div className="a-mobile-bar">
          <button onClick={()=>setSideOpen(v=>!v)} style={{background:'none',border:'none',
            color:'#00D4FF',fontSize:'1.4rem',cursor:'pointer',padding:'4px 8px'}}>☰</button>
          <div style={{fontFamily:'Orbitron,sans-serif',fontSize:'1rem',fontWeight:700,
            background:'linear-gradient(90deg,#00D4FF,#2563EB)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            Divine<span style={{fontWeight:400}}>Stack</span>
          </div>
          <div/>
        </div>

        {tab==='dashboard' && <Dashboard addToast={addToast} />}
        {tab==='enquiries' && <EnquiriesPage addToast={addToast} />}
        {tab==='profile'   && <ProfilePage admin={admin} onUpdate={setAdmin} addToast={addToast} />}
        {tab==='users' && admin.role==='super_admin' && <UsersPage currentAdmin={admin} addToast={addToast} />}
      </div>
    </div>
  );
}
