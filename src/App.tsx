/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, LogOut, Shield, Mail, Lock, User, CheckCircle2, ChevronRight, LayoutDashboard, Settings, Bell, Search } from 'lucide-react';
import { cn } from './lib/utils';

type View = 'login' | 'register' | 'dashboard';

interface UserData {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export default function App() {
  const [view, setView] = useState<View>('login');
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setView('dashboard');
      }
    } catch (err) {
      console.error('Auth check failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const endpoint = view === 'login' ? '/api/login' : '/api/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Algo salió mal');
      
      setUser(data);
      setView('dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
    setView('login');
    setFormData({ email: '', password: '', name: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="step-indicator animate-pulse">CARGANDO_SISTEMA...</div>
      </div>
    );
  }

  if (view === 'dashboard' && user) {
    return (
      <div className="min-h-screen bg-black text-white flex overflow-hidden font-sans">
        {/* Sidebar */}
        <aside className="w-72 border-r border-zinc-900 flex flex-col justify-between p-10">
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#00FF00] flex items-center justify-center">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase italic">AuthSys</span>
            </div>

            <nav className="flex flex-col gap-1">
              {[
                { icon: LayoutDashboard, label: 'Resumen', active: true, id: '01' },
                { icon: User, label: 'Perfil', active: false, id: '02' },
                { icon: Bell, label: 'Alertas', active: false, id: '03' },
                { icon: Settings, label: 'Ajustes', active: false, id: '04' },
              ].map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    "flex items-center justify-between group px-4 py-3 border-l-2 transition-all duration-300",
                    item.active 
                      ? "border-[#00FF00] bg-zinc-900/50 text-white" 
                      : "border-transparent text-zinc-600 hover:text-white hover:bg-zinc-900/30"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className={cn("w-4 h-4 transition-colors", item.active ? "text-[#00FF00]" : "group-hover:text-[#00FF00]")} />
                    <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                  </div>
                  <span className="font-mono text-[10px] opacity-40">{item.id}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-6 pt-8 border-t border-zinc-900">
            <div className="flex items-center gap-4 px-2">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-xl text-[#00FF00]">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-0.5">{user.name.split(' ')[0]}</p>
                <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-tighter">Acceso: Nivel_Omega</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full btn-secondary mt-0 text-red-500 border-red-500/20 hover:bg-red-500/10 hover:border-red-500"
            >
              Desconectar
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-auto">
          {/* Top Bar */}
          <header className="h-24 border-b border-zinc-900 flex items-center justify-between px-12">
            <div className="step-indicator">USR.ACTIVE / {user.id.slice(0, 8)}</div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 border-r border-zinc-900 pr-8">
                <Search className="w-4 h-4 text-zinc-600" />
                <input 
                  type="text" 
                  placeholder="COMANDO / BUSCAR" 
                  className="bg-transparent border-none focus:outline-none font-mono text-xs text-zinc-400 placeholder:text-zinc-700 w-48 uppercase tracking-widest"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00FF00] rounded-full animate-pulse shadow-[0_0_8px_#00FF00]" />
                <span className="font-mono text-[10px] text-zinc-500 tracking-[0.2em] uppercase">SISTEMA_OK</span>
              </div>
            </div>
          </header>

          <div className="p-12 space-y-12 max-w-7xl">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="massive-text mb-4">SISTEMA<br />
                  <span className="neon-accent">NÚCLEO</span>
                </h1>
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em] ml-1">Terminal de gestión de identidad / Usuario: {user.email}</p>
              </div>
              <div className="text-right space-y-2 mb-4">
                <div className="step-indicator underline underline-offset-8 decoration-2">ST.ID: CORE_01_SEC</div>
                <p className="text-zinc-700 font-mono text-[10px]">VER: 4.0.2 // PROTOCOL: AES-256</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border border-zinc-900 bg-zinc-950/50">
              {[
                { label: 'Estado Global', value: 'AUTORIZADO', color: 'neon-accent' },
                { label: 'Sesión Activa', value: user.id.slice(-8).toUpperCase(), color: 'text-white' },
                { label: 'Ciclo Registro', value: new Date(user.createdAt).getFullYear(), color: 'text-white' },
              ].map((stat, i) => (
                <div key={stat.label} className={cn("p-10 flex flex-col gap-3", i < 2 && "md:border-r border-zinc-900")}>
                  <span className="micro-label">{stat.label}</span>
                  <p className={cn("text-3xl font-black italic tracking-tighter truncate", stat.color)}>{stat.value}</p>
                </div>
              ))}
            </div>

            <section className="border border-zinc-900">
              <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-zinc-950">
                <h2 className="text-sm font-black uppercase tracking-widest">Logs de Protocolo</h2>
                <span className="font-mono text-[10px] text-zinc-600">FILTRAR / TODOS</span>
              </div>
              <div className="divide-y divide-zinc-900">
                {[
                  { event: 'Acceso Al Sistema Reconocido', system: 'Terminal.SH / v8', date: 'AHORA', icon: CheckCircle2, color: 'text-[#00FF00]' },
                  { event: 'Integridad De Datos Verificada', system: 'Sincronizador Automático', date: 'AYER', icon: Shield, color: 'text-[#00FF00]' },
                  { event: 'Nuevas Cripto-Llaves Generadas', system: 'Protocolo de Red', date: '3 DÍAS', icon: ChevronRight, color: 'text-zinc-600' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 hover:bg-zinc-900/40 transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className={cn("p-2 border border-zinc-800", item.color)}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-xs uppercase tracking-widest mb-1">{item.event}</p>
                        <p className="font-mono text-[10px] text-zinc-600">{item.system}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-zinc-500 mb-1">{item.date}</p>
                      <ChevronRight className="w-4 h-4 ml-auto text-zinc-800 group-hover:text-[#00FF00] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex selection:bg-[#00FF00] selection:text-black font-sans">
      <div className="flex w-full overflow-hidden">
        {/* Left Side - Visuals */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-1/2 p-24 flex flex-col justify-between border-r border-zinc-900 bg-black relative"
        >
          <div className="step-indicator">SYS.INIT / 01</div>
          
          <div className="relative">
            <h1 className="massive-text">
              THE<br />
              CORE<br />
              <span className="neon-accent">VOID</span>
            </h1>
            <div className="absolute -top-10 -left-10 w-20 h-20 border-t-2 border-l-2 border-zinc-800" />
            <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b-2 border-r-2 border-zinc-800" />
          </div>

          <div className="max-w-sm">
            <p className="text-zinc-500 text-sm uppercase font-black tracking-widest leading-relaxed">
              Gestión de identidad y protocolos de red integrados. Acceso restringido al personal autorizado.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="h-0.5 w-12 bg-[#00FF00]" />
              <div className="h-0.5 w-12 bg-zinc-800" />
              <div className="h-0.5 w-12 bg-zinc-800" />
            </div>
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <div className="w-1/2 bg-zinc-950 p-24 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto w-full"
          >
            <div className="mb-16">
              <h2 className="text-4xl font-black mb-3 uppercase tracking-tighter italic">
                {view === 'login' ? 'Iniciar Sesión' : 'Nueva Cuenta'}
              </h2>
              <div className="flex items-center gap-4 text-zinc-500">
                <span className="font-mono text-xs uppercase tracking-widest text-[#00FF00]">Status: Esperando entrada</span>
                <div className="h-[1px] flex-1 bg-zinc-900" />
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-10">
              <AnimatePresence mode="wait">
                {view === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="group"
                  >
                    <span className="micro-label">Nombre Completo</span>
                    <input
                      required
                      type="text"
                      placeholder="USER_NAME_01"
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="group">
                <span className="micro-label">Identificador (Email)</span>
                <input
                  required
                  type="email"
                  placeholder="NAME@DOMAIN.SYS"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="group">
                <span className="micro-label">Clave de Acceso</span>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="input-field"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {error && (
                <div className="font-mono text-[10px] text-red-500 uppercase tracking-widest border border-red-500/20 bg-red-500/5 p-3 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-red-500 animate-pulse" />
                  ERROR: {error}
                </div>
              )}

              <div className="pt-4 flex flex-col gap-4">
                <button type="submit" className="btn-primary">
                  {view === 'login' ? 'Autenticar Sistema' : 'Vincular Usuario'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setView(view === 'login' ? 'register' : 'login');
                    setError(null);
                  }}
                  className="btn-secondary"
                >
                  {view === 'login' ? 'Cambiar a Registro' : 'Volver al Acceso'}
                </button>
              </div>
            </form>

            <div className="mt-20 flex justify-between items-center font-mono text-[10px] text-zinc-700 uppercase tracking-widest">
              <span>Build V.4.0.2</span>
              <span className="hover:text-[#00FF00] cursor-pointer transition-colors">Protocolos de Privacidad</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
