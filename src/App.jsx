import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Activity,
  Users,
  Radio,
  Shield,
  LogOut,
  RefreshCw,
  BarChart3,
  Smartphone,
  AlertTriangle,
  Layers,
  Clock,
  Zap,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  UserPlus,
  Server,
  Lock,
  ArrowUpRight,
  Terminal,
  Eye,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { api } from './services/api.js';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(api.isAuthenticated());
  const [adminUser, setAdminUser] = useState(api.getAdminUser());
  const [activeTab, setActiveTab] = useState('overview'); // overview, activity, features, versions, platforms, errors, live
  const [refreshInterval, setRefreshInterval] = useState(15); // seconds, 0 = off
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date());

  // Data states
  const [overview, setOverview] = useState(null);
  const [activity, setActivity] = useState(null);
  const [activityDays, setActivityDays] = useState(30);
  const [versions, setVersions] = useState(null);
  const [features, setFeatures] = useState(null);
  const [platforms, setPlatforms] = useState(null);
  const [errors, setErrors] = useState(null);
  const [liveEvents, setLiveEvents] = useState([]);
  const [loadError, setLoadError] = useState(null);

  // Login form states
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('AmarHishabAdmin2026!');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Fetch all data
  const fetchData = useCallback(async (showIndicator = true) => {
    if (!api.isAuthenticated()) return;
    if (showIndicator) setIsRefreshing(true);
    setLoadError(null);

    try {
      const [
        overviewRes,
        activityRes,
        versionsRes,
        featuresRes,
        platformsRes,
        errorsRes,
        liveRes
      ] = await Promise.all([
        api.getOverview().catch((err) => ({ error: err.message })),
        api.getActivity(activityDays).catch((err) => ({ error: err.message })),
        api.getVersions().catch((err) => ({ error: err.message })),
        api.getFeatures().catch((err) => ({ error: err.message })),
        api.getPlatforms().catch((err) => ({ error: err.message })),
        api.getErrors().catch((err) => ({ error: err.message })),
        api.getLive().catch((err) => ({ error: err.message }))
      ]);

      if (!overviewRes.error) setOverview(overviewRes.data);
      if (!activityRes.error) setActivity(activityRes.data);
      if (!versionsRes.error) setVersions(versionsRes.data);
      if (!featuresRes.error) setFeatures(featuresRes.data);
      if (!platformsRes.error) setPlatforms(platformsRes.data);
      if (!errorsRes.error) setErrors(errorsRes.data);
      if (!liveRes.error) setLiveEvents(liveRes.data || []);

      setLastRefreshedAt(new Date());
    } catch (err) {
      setLoadError(err.message || 'Failed to communicate with analytics backend');
    } finally {
      setIsRefreshing(false);
    }
  }, [activityDays]);

  // Handle unauthorized event
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setAdminUser(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      fetchData(false);
    }
  }, [isAuthenticated, fetchData]);

  // Auto refresh timer
  useEffect(() => {
    if (!isAuthenticated || refreshInterval <= 0) return;
    const intervalId = setInterval(() => {
      fetchData(false);
    }, refreshInterval * 1000);
    return () => clearInterval(intervalId);
  }, [isAuthenticated, refreshInterval, fetchData]);

  // Handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const data = await api.login(username, password);
      setIsAuthenticated(true);
      setAdminUser(data.user);
    } catch (err) {
      setLoginError(err.message || 'Login failed. Verify credentials and backend status.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  // Helper formatting
  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'Just now';
    const diffSeconds = Math.max(0, Math.floor((new Date() - new Date(isoString)) / 1000));
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return `${Math.floor(diffSeconds / 86400)}d ago`;
  };

  // ---------------- LOGIN SCREEN ----------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-400" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Amar Hishab</h1>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Developer Analytics</p>
            </div>
          </div>

          <div className="mb-6 p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Strict Privacy Guarantee:</span> Telemetry is strictly anonymous. No financial data, account numbers, or personally identifiable information is ever processed or stored.
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Admin Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-semibold py-2.5 px-4 rounded-lg text-sm shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500">
              API Base: <code className="text-teal-400 bg-slate-950 px-1.5 py-0.5 rounded">{api.getBaseUrl()}</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- DASHBOARD MAIN UI ----------------
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white tracking-tight">Amar Hishab</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  v1.2.1 Ecosystem
                </span>
              </div>
              <p className="text-xs text-slate-400">Developer Telemetry & Health</p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Ingestion</span>
            </div>

            {/* Refresh Rate Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg p-1 text-xs">
              <Clock className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="bg-transparent text-slate-200 text-xs py-0.5 px-1 focus:outline-none cursor-pointer"
              >
                <option value={0} className="bg-slate-900">Paused</option>
                <option value={5} className="bg-slate-900">5s</option>
                <option value={15} className="bg-slate-900">15s</option>
                <option value={30} className="bg-slate-900">30s</option>
                <option value={60} className="bg-slate-900">60s</option>
              </select>
            </div>

            {/* Manual Refresh Button */}
            <button
              onClick={() => fetchData(true)}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors disabled:opacity-50"
              title="Refresh now"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} />
            </button>

            {/* Admin Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden md:block text-right">
                <p className="text-xs font-medium text-white">{adminUser?.username || 'admin'}</p>
                <p className="text-[10px] text-slate-400">Authenticated</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-800/40 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Privacy Assurance Banner */}
        <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Zero Personal Financial Data (Zero-PII) Architecture</h2>
              <p className="text-xs text-slate-400">
                Amar Hishab never logs names, balances, income, expenses, accounts, or bank numbers. Only device telemetry is collected.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-xs text-slate-400">
            <span>Last synchronized:</span>
            <span className="font-mono text-teal-400">{lastRefreshedAt.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Global Error Banner */}
        {loadError && (
          <div className="p-4 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loadError}</span>
            </div>
            <button
              onClick={() => fetchData(true)}
              className="px-2.5 py-1 bg-red-900/40 hover:bg-red-800/60 text-red-200 rounded border border-red-700/60"
            >
              Retry
            </button>
          </div>
        )}

        {/* Overview Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* Card 1: Total Users */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-all col-span-2 sm:col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">Total Installs</span>
              <Users className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {overview ? overview.totalUsers.toLocaleString() : '—'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span>All-time unique anonymous IDs</span>
            </div>
          </div>

          {/* Card 2: Active Now */}
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-3.5 hover:border-emerald-500/50 transition-all col-span-2 sm:col-span-1 lg:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Now
              </span>
              <Radio className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {overview ? overview.activeNow.toLocaleString() : '—'}
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-1">
              Heartbeat &lt; 5 minutes ago
            </div>
          </div>

          {/* Card 3: DAU */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-all col-span-1 lg:col-span-1">
            <div className="text-slate-400 text-xs font-medium mb-1 flex items-center justify-between">
              <span>DAU</span>
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {overview ? overview.dau.toLocaleString() : '—'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Daily Active</div>
          </div>

          {/* Card 4: WAU */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-all col-span-1 lg:col-span-1">
            <div className="text-slate-400 text-xs font-medium mb-1 flex items-center justify-between">
              <span>WAU</span>
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {overview ? overview.wau.toLocaleString() : '—'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">7 Days Active</div>
          </div>

          {/* Card 5: MAU */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-all col-span-1 lg:col-span-1">
            <div className="text-slate-400 text-xs font-medium mb-1 flex items-center justify-between">
              <span>MAU</span>
              <Layers className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {overview ? overview.mau.toLocaleString() : '—'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">30 Days Active</div>
          </div>

          {/* Card 6: Errors */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-all col-span-1 lg:col-span-1">
            <div className="text-slate-400 text-xs font-medium mb-1 flex items-center justify-between">
              <span>Errors</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className={`text-xl font-bold ${overview?.errorCount > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
              {overview ? overview.errorCount.toLocaleString() : '—'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Total Errors</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-1 sm:space-x-4 overflow-x-auto pb-px">
          {[
            { id: 'overview', label: 'Activity Overview', icon: Activity },
            { id: 'features', label: 'Feature Telemetry', icon: Zap },
            { id: 'versions', label: 'App Versions', icon: Layers },
            { id: 'platforms', label: 'Android OS', icon: Smartphone },
            { id: 'errors', label: 'Error Diagnostics', icon: AlertTriangle },
            { id: 'live', label: 'Live Stream', icon: Terminal }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-medium rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-teal-400 text-teal-400 bg-teal-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Activity Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Activity Chart Container */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-semibold text-white">Daily Active Trends (DAU)</h3>
                  <p className="text-xs text-slate-400">Trend of unique users active on Amar Hishab per day</p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  {[7, 30, 90].map((d) => (
                    <button
                      key={d}
                      onClick={() => setActivityDays(d)}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        activityDays === d
                          ? 'bg-teal-500 text-white font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Bar / Column Chart Rendering */}
              {activity && activity.length > 0 ? (
                <div className="space-y-4">
                  <div className="h-48 flex items-end gap-1.5 pt-6 pb-2 px-1 border-b border-slate-800 overflow-x-auto">
                    {(() => {
                      const maxVal = Math.max(...activity.map((a) => a.dau), 1);
                      return activity.map((item, idx) => {
                        const heightPct = Math.max(8, Math.round((item.dau / maxVal) * 100));
                        return (
                          <div
                            key={idx}
                            className="flex-1 min-w-[12px] sm:min-w-[18px] flex flex-col items-center group relative h-full justify-end"
                          >
                            {/* Hover Tooltip */}
                            <div className="absolute -top-12 bg-slate-950 border border-slate-700 text-white text-[10px] rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-xl">
                              <p className="font-bold text-teal-400">{item.date}</p>
                              <p>DAU: {item.dau} | New: {item.newUsers}</p>
                              <p>Sessions: {item.sessions}</p>
                            </div>

                            {/* Column Bar */}
                            <div
                              style={{ height: `${heightPct}%` }}
                              className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t group-hover:from-teal-400 group-hover:to-teal-300 transition-all shadow-sm"
                            />
                          </div>
                        );
                      });
                    })()}
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 px-1">
                    <span>{activity[0]?.date}</span>
                    <span>{activity[Math.floor(activity.length / 2)]?.date}</span>
                    <span>{activity[activity.length - 1]?.date}</span>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-500 text-xs">
                  No activity history recorded for this period yet.
                </div>
              )}
            </div>

            {/* Quick Metrics Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  <span>New Users Today</span>
                </div>
                <div className="text-xl font-bold text-white">{overview?.newUsersToday ?? 0}</div>
                <p className="text-[11px] text-slate-500 mt-1">First open recorded today</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  <span>Returning Users Today</span>
                </div>
                <div className="text-xl font-bold text-white">{overview?.returningUsersToday ?? 0}</div>
                <p className="text-[11px] text-slate-500 mt-1">Active users acquired prior to today</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Total Recorded Sessions</span>
                </div>
                <div className="text-xl font-bold text-white">{overview?.sessions ?? 0}</div>
                <p className="text-[11px] text-slate-500 mt-1">App foreground launches</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Feature Usage */}
        {activeTab === 'features' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Feature Usage Telemetry</h3>
                <p className="text-xs text-slate-400">
                  Total trigger counts and unique users across Amar Hishab features
                </p>
              </div>
              <span className="text-xs text-teal-400 font-mono">
                {features?.length || 0} features logged
              </span>
            </div>

            {features && features.length > 0 ? (
              <div className="space-y-3">
                {features.map((f, i) => (
                  <div key={i} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-teal-500/10 text-teal-400 flex items-center justify-center font-mono font-bold text-[10px]">
                          {i + 1}
                        </span>
                        <span className="font-semibold text-white capitalize">
                          {f.feature.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-400 font-mono">
                        <span>{f.uniqueUsers} unique users</span>
                        <span className="font-bold text-teal-400">{f.count} events</span>
                        <span className="w-12 text-right text-slate-500">{f.percentage}%</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, Math.max(3, f.percentage))}%` }}
                        className="bg-teal-500 h-full rounded-full transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-500">
                No feature usage events have been captured yet.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: App Versions */}
        {activeTab === 'versions' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Version Distribution & Adoption</h3>
                <p className="text-xs text-slate-400">
                  Adoption rate for latest production release v1.2.1
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Latest Release Adoption: </span>
                <span className="text-sm font-bold text-teal-400 font-mono">
                  {versions?.adoptionRate ?? 0}%
                </span>
              </div>
            </div>

            {versions?.versions && versions.versions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {versions.versions.map((ver, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      ver.versionName === versions.latestVersion
                        ? 'bg-teal-950/20 border-teal-500/40'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">v{ver.versionName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          code: {ver.versionCode}
                        </span>
                        {ver.versionName === versions.latestVersion && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            Latest Target
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-mono font-bold text-teal-400">
                        {ver.percentage}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                      <div
                        style={{ width: `${ver.percentage}%` }}
                        className="bg-teal-500 h-full rounded-full transition-all"
                      />
                    </div>

                    <p className="text-xs text-slate-400">
                      {ver.users} active install{ver.users !== 1 ? 's' : ''} on this version
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-500">
                No version records found.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Android OS Platforms */}
        {activeTab === 'platforms' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-white">Android OS Version Distribution</h3>
              <p className="text-xs text-slate-400">
                Active devices grouped by Android API level and system version
              </p>
            </div>

            {platforms && platforms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {platforms.map((p, i) => (
                  <div key={i} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{p.osName}</span>
                      <span className="font-mono text-teal-400 font-bold">{p.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${p.percentage}%` }}
                        className="bg-teal-500 h-full rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>API SDK {p.androidVersion}</span>
                      <span>{p.users} devices</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-500">
                No platform telemetry records logged yet.
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Error Diagnostics */}
        {activeTab === 'errors' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div>
              <h3 className="text-base font-semibold text-white">Anonymous Error Diagnostics</h3>
              <p className="text-xs text-slate-400">
                Aggregated error categories and telemetry without sensitive stack traces
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400">Errors Today</span>
                <p className="text-2xl font-bold text-white mt-1">{errors?.today ?? 0}</p>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400">Errors This Week</span>
                <p className="text-2xl font-bold text-white mt-1">{errors?.thisWeek ?? 0}</p>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400">Errors This Month</span>
                <p className="text-2xl font-bold text-white mt-1">{errors?.thisMonth ?? 0}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Error Categories
              </h4>
              {errors?.categories && errors.categories.length > 0 ? (
                errors.categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="font-mono text-slate-200">{cat.category}</span>
                    </div>
                    <span className="font-mono font-bold text-amber-400">{cat.count} occurrences</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 py-4">No logged errors recorded. App is healthy!</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 6: Live Stream */}
        {activeTab === 'live' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="text-base font-semibold text-white">Real-Time Event Stream</h3>
                  <p className="text-xs text-slate-400">
                    Latest 30 incoming telemetry events from the Android client
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Auto-updating: {refreshInterval > 0 ? `every ${refreshInterval}s` : 'paused'}
              </span>
            </div>

            {liveEvents.length > 0 ? (
              <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/70 font-mono text-xs">
                {liveEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-500 text-[11px]">#{evt.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          evt.eventType === 'heartbeat'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                            : evt.eventType === 'first_open'
                            ? 'bg-purple-950 text-purple-400 border border-purple-800/50'
                            : evt.eventType === 'feature_used'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800/50'
                            : evt.eventType === 'anonymous_error'
                            ? 'bg-red-950 text-red-400 border border-red-800/50'
                            : 'bg-teal-950 text-teal-400 border border-teal-800/50'
                        }`}
                      >
                        {evt.eventType}
                      </span>
                      {evt.feature && (
                        <span className="text-slate-300 font-semibold">
                          feature: <span className="text-teal-400">{evt.feature}</span>
                        </span>
                      )}
                      <span className="text-slate-400 text-[11px]">
                        v{evt.appVersionName} ({evt.osName})
                      </span>
                    </div>

                    <div className="text-slate-500 text-[11px] shrink-0">
                      {formatTimeAgo(evt.serverReceivedAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-500">
                Waiting for incoming events from the Android app...
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Amar Hishab Developer Analytics &copy; 2026. All telemetry strictly anonymous.</span>
          <div className="flex items-center gap-4">
            <span>Netlify Hosted React Dashboard</span>
            <span>REST Admin API v1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
