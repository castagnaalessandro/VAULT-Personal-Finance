import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { userExists, registerUser, loginUser } from '../lib/auth';
import { cn } from '../lib/utils';

interface Props {
  onLoginSuccess: (userId: string) => void;
}

type Step = 'name' | 'pin_login' | 'pin_register' | 'pin_confirm';

export function WelcomeScreen({ onLoginSuccess }: Props) {
  const [step, setStep] = useState<Step>('name');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNameSubmit = () => {
    if (!firstName.trim() || !lastName.trim()) { setError('Inserisci nome e cognome'); return; }
    setError('');
    const returning = userExists(firstName, lastName);
    setStep(returning ? 'pin_login' : 'pin_register');
  };

  const handlePinLogin = async () => {
    if (pin.length < 4) { setError('Il PIN deve essere di almeno 4 cifre'); return; }
    setLoading(true); setError('');
    try {
      const userId = await loginUser(firstName, lastName, pin);
      onLoginSuccess(userId);
    } catch (e: any) {
      setError(e.message || 'Errore di accesso');
    } finally { setLoading(false); }
  };

  const handlePinRegister = () => {
    if (pin.length < 4) { setError('Il PIN deve essere di almeno 4 cifre'); return; }
    setError('');
    setStep('pin_confirm');
  };

  const handlePinConfirm = async () => {
    if (pin !== pinConfirm) { setError('I PIN non corrispondono'); return; }
    setLoading(true); setError('');
    try {
      const userId = await registerUser(firstName, lastName, pin);
      onLoginSuccess(userId);
    } catch (e: any) {
      setError(e.message || 'Errore durante la registrazione');
    } finally { setLoading(false); }
  };

  const reset = () => { setStep('name'); setPin(''); setPinConfirm(''); setError(''); };

  const PinInput = ({ value, onChange, onEnter }: { value: string; onChange: (v: string) => void; onEnter: () => void }) => (
    <div className="relative">
      <input
        type={showPin ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        onKeyDown={(e) => e.key === 'Enter' && onEnter()}
        autoFocus placeholder="••••" inputMode="numeric"
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-12 text-sm focus:outline-none focus:border-accent/60 text-white placeholder:text-gray-600 text-center font-mono tracking-[0.5em] text-lg"
      />
      <button type="button" onClick={() => setShowPin(!showPin)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass p-12 rounded-[50px] w-full max-w-[420px] shadow-2xl relative overflow-hidden flex flex-col items-center"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[80px] -mr-16 -mt-16 rounded-full" />

        {/* Logo */}
        <div className="flex flex-col items-center space-y-4 mb-10">
          <div className="relative">
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -inset-8 bg-accent/30 blur-3xl rounded-full" />
            <motion.div animate={{ y: [0, -12, 0], rotate: [3, -5, 3], scale: [1, 1.06, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-20 h-20 rounded-[28px] bg-white text-black flex items-center justify-center border border-white/20 shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
              <Star className="w-10 h-10 fill-black" />
            </motion.div>
          </div>
          <div className="text-center pt-2">
            <h1 className="text-5xl font-display font-black tracking-[-0.05em] italic bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent leading-none">
              VAUL<span className="text-accent">T</span>
            </h1>
            <div className="h-1.5 w-16 bg-accent mx-auto mt-3 rounded-full" />
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 1: Nome + Cognome */}
          {step === 'name' && (
            <motion.div key="name"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="w-full space-y-5"
            >
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <User className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Accesso</span>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Chi sei?</h2>
                <p className="text-xs text-gray-500">Inserisci nome e cognome per accedere o registrarti.</p>
              </div>
              <div className="space-y-3">
                <input
                  type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && document.getElementById('lastName-input')?.focus()}
                  autoFocus placeholder="Nome"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent/60 text-white placeholder:text-gray-600 font-medium"
                />
                <input
                  id="lastName-input"
                  type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                  placeholder="Cognome"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent/60 text-white placeholder:text-gray-600 font-medium"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-expense text-xs bg-expense/10 px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}
              <button onClick={handleNameSubmit} disabled={!firstName.trim() || !lastName.trim()}
                className="w-full bg-white text-black font-black py-5 rounded-[24px] flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-white/5 disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <div className="bg-accent p-1.5 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-accent/20">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] uppercase tracking-widest">Continua</span>
              </button>
            </motion.div>
          )}

          {/* STEP 2a: Login PIN */}
          {step === 'pin_login' && (
            <motion.div key="pin_login"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="w-full space-y-5"
            >
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Bentornato</span>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Ciao, {firstName}!</h2>
                <p className="text-xs text-gray-500">Inserisci il tuo PIN per accedere.</p>
              </div>
              <PinInput value={pin} onChange={setPin} onEnter={handlePinLogin} />
              {error && (
                <div className="flex items-center gap-2 text-expense text-xs bg-expense/10 px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}
              <button onClick={handlePinLogin} disabled={loading || pin.length < 4}
                className="w-full bg-white text-black font-black py-5 rounded-[24px] flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <div className="bg-accent p-1.5 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-accent/20">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] uppercase tracking-widest">{loading ? 'Accesso...' : 'Accedi'}</span>
              </button>
              <button onClick={reset} className="w-full text-center text-xs text-gray-600 hover:text-gray-400 transition-colors">
                ← Cambia utente
              </button>
            </motion.div>
          )}

          {/* STEP 2b: Nuovo PIN */}
          {step === 'pin_register' && (
            <motion.div key="pin_register"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="w-full space-y-5"
            >
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Nuovo account</span>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Crea un PIN</h2>
                <p className="text-xs text-gray-500">Scegli un PIN di 4–6 cifre per proteggere il tuo account.</p>
              </div>
              <PinInput value={pin} onChange={setPin} onEnter={handlePinRegister} />
              {error && (
                <div className="flex items-center gap-2 text-expense text-xs bg-expense/10 px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}
              <button onClick={handlePinRegister} disabled={pin.length < 4}
                className="w-full bg-white text-black font-black py-5 rounded-[24px] flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <div className="bg-accent p-1.5 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-accent/20">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] uppercase tracking-widest">Avanti</span>
              </button>
              <button onClick={reset} className="w-full text-center text-xs text-gray-600 hover:text-gray-400 transition-colors">
                ← Cambia nome
              </button>
            </motion.div>
          )}

          {/* STEP 3: Conferma PIN */}
          {step === 'pin_confirm' && (
            <motion.div key="pin_confirm"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="w-full space-y-5"
            >
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Conferma PIN</span>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Ripeti il PIN</h2>
                <p className="text-xs text-gray-500">Inserisci di nuovo il PIN per confermare.</p>
              </div>
              <PinInput value={pinConfirm} onChange={setPinConfirm} onEnter={handlePinConfirm} />
              {error && (
                <div className="flex items-center gap-2 text-expense text-xs bg-expense/10 px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}
              <button onClick={handlePinConfirm} disabled={loading || pinConfirm.length < 4}
                className="w-full bg-white text-black font-black py-5 rounded-[24px] flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <div className="bg-accent p-1.5 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-accent/20">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] uppercase tracking-widest">{loading ? 'Creazione...' : 'Crea account'}</span>
              </button>
              <button onClick={() => { setStep('pin_register'); setPinConfirm(''); setError(''); }}
                className="w-full text-center text-xs text-gray-600 hover:text-gray-400 transition-colors">
                ← Cambia PIN
              </button>
            </motion.div>
          )}

        </AnimatePresence>

        <p className="text-[10px] text-accent font-bold uppercase tracking-[0.4em] opacity-40 mt-10">
          Created by Alessandro Castagna
        </p>
      </motion.div>
    </div>
  );
}
