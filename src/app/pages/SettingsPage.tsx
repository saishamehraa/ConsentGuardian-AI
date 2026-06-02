import React, { useState } from 'react';
import { Save, Key, Cpu, Shield, Database, Bell } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('ai');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      window.alert('Settings saved successfully. Note: API keys are applied on the backend.');
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Platform Settings</h1>
        <p className="text-muted-foreground">Configure AI engines, scanning preferences, and integrations.</p>
      </div>

      <div className="flex gap-6">
        {/* Settings Navigation */}
        <div className="w-64 shrink-0 space-y-1">
          {[
            { id: 'ai', label: 'AI Configuration', icon: Cpu },
            { id: 'scan', label: 'Scanning Engine', icon: Shield },
            { id: 'storage', label: 'Data Retention', icon: Database },
            { id: 'alerts', label: 'Alerting & Webhooks', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl p-8 min-h-[500px]">
          {activeTab === 'ai' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">AI Engine Configuration</h3>
                <p className="text-sm text-gray-400 mb-6">Configure the primary LLM used for the Privacy Agent and Copilot.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Primary Provider</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors">
                    <option value="openrouter">OpenRouter (Recommended)</option>
                    <option value="ollama">Local Ollama</option>
                    <option value="openai">OpenAI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Model Selection</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors">
                    <option value="google/gemini-2.5-flash-lite-preview-09-2025">Gemini 2.5 Flash Lite (OpenRouter)</option>
                    <option value="meta-llama/llama-3-8b-instruct">Llama 3 8B (OpenRouter)</option>
                    <option value="gemma:2b">Gemma 2B (Ollama)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      API Key
                    </div>
                  </label>
                  <input 
                    type="password" 
                    placeholder="sk-or-v1-..."
                    defaultValue="sk-or-v1-****************************************"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">API keys are securely stored on the backend engine. Modifying here will update the active instance.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scan' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Scanning Preferences</h3>
                <p className="text-sm text-gray-400 mb-6">Adjust the strictness and scope of the autonomous scanning agents.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                  <div>
                    <h4 className="text-sm font-medium text-white">Aggressive Dependency Scanning</h4>
                    <p className="text-xs text-gray-400 mt-1">Include node_modules and vendor directories in privacy mapping.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                  <div>
                    <h4 className="text-sm font-medium text-white">Predictive Trend Analysis</h4>
                    <p className="text-xs text-gray-400 mt-1">Enable ML-based forecasting for future compliance degradation.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {['storage', 'alerts'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                {activeTab === 'storage' ? <Database className="w-8 h-8 text-gray-400" /> : <Bell className="w-8 h-8 text-gray-400" />}
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Coming Soon</h3>
                <p className="text-sm text-gray-400 mt-1">These settings are being finalized for the production release.</p>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-200",
                isSaving ? "bg-indigo-500/50 text-white/50 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
              )}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
