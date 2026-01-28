'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Loader2, RefreshCcw } from 'lucide-react';

export default function AdminPage() {
  const [config, setConfig] = useState({ xpPerTrade: 10, initialBalance: 10000 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/config');
      if (res.ok) {
        const data = await res.json();
        setConfig({
          xpPerTrade: data.xpPerTrade,
          initialBalance: Number(data.initialBalance)
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings updated successfully' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update settings' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-gray-400">Manage platform-wide configurations</p>
        </div>
        <button onClick={fetchConfig} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <RefreshCcw className="h-5 w-5" />
        </button>
      </header>

      <form onSubmit={handleSave} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">XP per Trade</label>
            <input
              type="number"
              value={config.xpPerTrade}
              onChange={(e) => setConfig({ ...config, xpPerTrade: parseInt(e.target.value) })}
              className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Initial Virtual Balance ($)</label>
            <input
              type="number"
              value={config.initialBalance}
              onChange={(e) => setConfig({ ...config, initialBalance: parseFloat(e.target.value) })}
              className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-xl font-bold transition-all"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5" /> <span>Save Changes</span></>}
          </button>
        </div>
      </form>
    </div>
  );
}
