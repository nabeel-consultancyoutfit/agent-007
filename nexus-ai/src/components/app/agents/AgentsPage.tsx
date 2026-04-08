'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { MODELS } from '@/data/models';
import styles from './AgentsPage.module.css';

interface Task {
  id: number;
  name: string;
  done: boolean;
}

const AGENT_TEMPLATES = [
  { emoji: '📧', name: 'Email Assistant', desc: 'Drafts, summarizes and replies to emails automatically', model: 'claude-sonnet' },
  { emoji: '📊', name: 'Data Analyst', desc: 'Analyzes CSVs, generates charts and insights', model: 'gpt5' },
  { emoji: '💻', name: 'Code Reviewer', desc: 'Reviews PRs, finds bugs and suggests improvements', model: 'claude-opus' },
  { emoji: '📱', name: 'Social Media', desc: 'Creates and schedules posts across all platforms', model: 'gpt5' },
  { emoji: '🔍', name: 'Research Agent', desc: 'Searches the web and summarizes findings', model: 'gemini25-pro' },
  { emoji: '🎨', name: 'Creative Writer', desc: 'Generates copy, blogs, and marketing content', model: 'claude-sonnet' },
];

export default function AgentsPage() {
  const { myAgents, openApp, showToast, addMessage, openModelModal } = useAppStore();
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'Dashboard Layout Adjustment', done: false },
    { id: 2, name: 'Design agent system prompt', done: false },
    { id: 3, name: 'Review API integration', done: true },
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [creatingAgent, setCreatingAgent] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [agentDesc, setAgentDesc] = useState('');
  const [agentModel, setAgentModel] = useState('gpt5');

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    setTasks((prev) => [...prev, { id: Date.now(), name: newTaskText.trim(), done: false }]);
    setNewTaskText('');
    setShowTaskInput(false);
  };

  const handleCreateAgent = () => {
    if (!agentName.trim()) { showToast('Please enter an agent name'); return; }
    showToast(`✅ Agent "${agentName}" created!`);
    setCreatingAgent(false);
    setAgentName('');
    setAgentDesc('');
  };

  return (
    <div className={styles.agentsView}>
      {/* Main content */}
      <div className={styles.mainContent}>
        {/* Top row: builder + CAP panel */}
        <div className={styles.topRow}>
          {/* Left: Agent Builder Panel */}
          <div className={styles.builderPanel}>
            <div className={styles.builderHead}>
              <div className={styles.builderIcon}>🤖</div>
              <div>
                <h2 className={styles.builderTitle}>Agent Builder</h2>
                <p className={styles.builderSub}>Create powerful AI agents using any model. Pick a template or start from scratch.</p>
              </div>
            </div>

            <button className={styles.newAgentBtn} onClick={() => setCreatingAgent(!creatingAgent)}>
              + New Agent
            </button>

            {creatingAgent && (
              <div className={styles.createForm}>
                <input
                  className={styles.formInput}
                  placeholder="Agent name…"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                />
                <textarea
                  className={styles.formTextarea}
                  placeholder="What should this agent do? (system prompt)…"
                  value={agentDesc}
                  onChange={(e) => setAgentDesc(e.target.value)}
                  rows={3}
                />
                <select
                  className={styles.formSelect}
                  value={agentModel}
                  onChange={(e) => setAgentModel(e.target.value)}
                >
                  {MODELS.slice(0, 8).map((m) => (
                    <option key={m.id} value={m.id}>{m.icon || m.emoji} {m.name}</option>
                  ))}
                </select>
                <div className={styles.formBtns}>
                  <button className={styles.btnPrimary} onClick={handleCreateAgent}>Create Agent</button>
                  <button className={styles.btnGhost} onClick={() => setCreatingAgent(false)}>Cancel</button>
                </div>
              </div>
            )}

            <div className={styles.helpCard}>
              <div className={styles.helpCardHead}>
                <span>✦</span>
                <span className={styles.helpCardTitle}>Not sure where to start?</span>
              </div>
              <p className={styles.helpCardSub}>Chat with our AI guide — describe what you want your agent to do and get a personalised setup plan.</p>
              <button className={styles.askHubBtn} onClick={() => { openApp('chat'); setTimeout(() => addMessage({ role: 'user', text: 'Help me build an AI agent' }), 300); }}>
                Ask the Hub →
              </button>
            </div>

            {/* Task List */}
            <div className={styles.taskSection}>
              <button className={styles.taskNewBtn} onClick={() => setShowTaskInput(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Task
              </button>

              {showTaskInput && (
                <div className={styles.taskInputWrap}>
                  <input
                    className={styles.taskInput}
                    type="text"
                    placeholder="Task name…"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addTask(); if (e.key === 'Escape') setShowTaskInput(false); }}
                    autoFocus
                  />
                  <button className={styles.taskInputAdd} onClick={addTask}>Add</button>
                  <button className={styles.taskInputCancel} onClick={() => setShowTaskInput(false)}>Cancel</button>
                </div>
              )}

              <div className={styles.taskList}>
                {tasks.map((task) => (
                  <div key={task.id} className={`${styles.taskItem} ${task.done ? styles.taskDone : ''}`}>
                    <div className={`${styles.taskCheckbox} ${task.done ? styles.checked : ''}`} onClick={() => toggleTask(task.id)}>
                      {task.done && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" style={{ width: 10, height: 10 }}><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <span className={styles.taskText}>{task.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Templates */}
          <div className={styles.templatesPanel}>
            <div className={styles.templatesPanelHead}>
              <h3 className={styles.templatesPanelTitle}>Agent Templates</h3>
              <p className={styles.templatesPanelSub}>Start faster with a pre-built template</p>
            </div>
            <div className={styles.templatesGrid}>
              {AGENT_TEMPLATES.map((t) => (
                <div key={t.name} className={styles.templateCard} onClick={() => { setAgentName(t.name); setAgentDesc(t.desc); setAgentModel(t.model); setCreatingAgent(true); }}>
                  <div className={styles.templateEmoji}>{t.emoji}</div>
                  <div className={styles.templateName}>{t.name}</div>
                  <div className={styles.templateDesc}>{t.desc}</div>
                  <div className={styles.templateModel}>
                    {MODELS.find((m) => m.id === t.model)?.name || t.model}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Agents */}
        <div className={styles.myAgentsSection}>
          <div className={styles.sectionHead}>
            <h3 className={styles.sectionTitle}>My Agents</h3>
            <span className={styles.sectionCount}>{myAgents.length} agents</span>
          </div>
          {myAgents.length === 0 ? (
            <div className={styles.emptyAgents}>
              <div className={styles.emptyIcon}>🤖</div>
              <div className={styles.emptyTitle}>No agents yet</div>
              <div className={styles.emptyDesc}>Create your first agent using the builder above or pick a template to get started.</div>
              <button className={styles.btnPrimary} onClick={() => setCreatingAgent(true)}>+ Create Agent</button>
            </div>
          ) : (
            <div className={styles.agentsGrid}>
              {myAgents.map((agent, i) => (
                <div key={i} className={styles.agentCard}>
                  <div className={styles.agentEmoji}>{agent.emoji}</div>
                  <div className={styles.agentName}>{agent.name}</div>
                  <div className={styles.agentDesc}>{agent.systemPrompt?.substring(0, 80)}…</div>
                  <button className={styles.agentChatBtn} onClick={() => showToast(`💬 Opening ${agent.name}…`)}>
                    Open Chat
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
