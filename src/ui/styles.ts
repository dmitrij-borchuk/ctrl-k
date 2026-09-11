export const DEFAULT_STYLES = `
:root {
  --ctrlk-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --ctrlk-backdrop: rgba(15, 23, 42, 0.65);
  --ctrlk-bg: #ffffff;
  --ctrlk-card-border: rgba(226, 232, 240, 0.8);
  --ctrlk-text: #0f172a;
  --ctrlk-text-muted: #64748b;
  --ctrlk-input-bg: transparent;
  --ctrlk-accent: #3b82f6;
  --ctrlk-item-hover: #f1f5f9;
  --ctrlk-item-active: #e2e8f0;
  --ctrlk-group-label: #94a3b8;
  --ctrlk-kbd-bg: #f8fafc;
  --ctrlk-kbd-border: #cbd5e1;
  --ctrlk-kbd-text: #475569;
  --ctrlk-radius: 14px;
  --ctrlk-item-radius: 8px;
  --ctrlk-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-ctrlk-theme="light"]) {
    --ctrlk-backdrop: rgba(0, 0, 0, 0.75);
    --ctrlk-bg: #1e293b;
    --ctrlk-card-border: rgba(51, 65, 85, 0.8);
    --ctrlk-text: #f8fafc;
    --ctrlk-text-muted: #94a3b8;
    --ctrlk-input-bg: transparent;
    --ctrlk-accent: #60a5fa;
    --ctrlk-item-hover: #334155;
    --ctrlk-item-active: #475569;
    --ctrlk-group-label: #64748b;
    --ctrlk-kbd-bg: #0f172a;
    --ctrlk-kbd-border: #334155;
    --ctrlk-kbd-text: #94a3b8;
    --ctrlk-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
}

[data-ctrlk-theme="dark"] {
  --ctrlk-backdrop: rgba(0, 0, 0, 0.75);
  --ctrlk-bg: #1e293b;
  --ctrlk-card-border: rgba(51, 65, 85, 0.8);
  --ctrlk-text: #f8fafc;
  --ctrlk-text-muted: #94a3b8;
  --ctrlk-input-bg: transparent;
  --ctrlk-accent: #60a5fa;
  --ctrlk-item-hover: #334155;
  --ctrlk-item-active: #475569;
  --ctrlk-group-label: #64748b;
  --ctrlk-kbd-bg: #0f172a;
  --ctrlk-kbd-border: #334155;
  --ctrlk-kbd-text: #94a3b8;
  --ctrlk-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
}

[data-ctrlk-theme="light"] {
  --ctrlk-backdrop: rgba(15, 23, 42, 0.65);
  --ctrlk-bg: #ffffff;
  --ctrlk-card-border: rgba(226, 232, 240, 0.8);
  --ctrlk-text: #0f172a;
  --ctrlk-text-muted: #64748b;
  --ctrlk-input-bg: transparent;
  --ctrlk-accent: #3b82f6;
  --ctrlk-item-hover: #f1f5f9;
  --ctrlk-item-active: #e2e8f0;
  --ctrlk-group-label: #94a3b8;
  --ctrlk-kbd-bg: #f8fafc;
  --ctrlk-kbd-border: #cbd5e1;
  --ctrlk-kbd-text: #475569;
  --ctrlk-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.ctrlk-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: clamp(40px, 14vh, 140px);
  padding-left: 1rem;
  padding-right: 1rem;
  background: var(--ctrlk-backdrop);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms cubic-bezier(0.16, 1, 0.3, 1);
  font-family: var(--ctrlk-font);
  box-sizing: border-box;
}

.ctrlk-overlay * {
  box-sizing: border-box;
}

.ctrlk-overlay[data-state="open"] {
  opacity: 1;
  pointer-events: auto;
}

.ctrlk-dialog {
  width: 100%;
  max-width: 640px;
  background: var(--ctrlk-bg);
  border: 1px solid var(--ctrlk-card-border);
  border-radius: var(--ctrlk-radius);
  box-shadow: var(--ctrlk-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: scale(0.97) translateY(-8px);
  transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

.ctrlk-overlay[data-state="open"] .ctrlk-dialog {
  transform: scale(1) translateY(0);
}

.ctrlk-header {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.875rem 1.125rem;
  border-bottom: 1px solid var(--ctrlk-card-border);
  gap: 0.75rem;
}

.ctrlk-search-icon {
  width: 20px;
  height: 20px;
  color: var(--ctrlk-text-muted);
  flex-shrink: 0;
}

.ctrlk-input {
  flex: 1;
  background: var(--ctrlk-input-bg);
  border: none;
  outline: none;
  font-size: 1.05rem;
  font-family: inherit;
  color: var(--ctrlk-text);
  padding: 0;
}

.ctrlk-input::placeholder {
  color: var(--ctrlk-text-muted);
}

.ctrlk-clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: none;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--ctrlk-text-muted);
}

.ctrlk-clear-btn:hover {
  color: var(--ctrlk-text);
  background: var(--ctrlk-item-hover);
}

.ctrlk-clear-btn[data-visible="true"] {
  display: flex;
}

.ctrlk-list-container {
  max-height: min(380px, 50vh);
  overflow-y: auto;
  padding: 0.5rem;
  overscroll-behavior: contain;
}

.ctrlk-list-container::-webkit-scrollbar {
  width: 6px;
}
.ctrlk-list-container::-webkit-scrollbar-track {
  background: transparent;
}
.ctrlk-list-container::-webkit-scrollbar-thumb {
  background: var(--ctrlk-kbd-border);
  border-radius: 3px;
}

.ctrlk-group {
  margin-bottom: 0.5rem;
}

.ctrlk-group:last-child {
  margin-bottom: 0;
}

.ctrlk-group-label {
  padding: 0.375rem 0.625rem 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ctrlk-group-label);
}

.ctrlk-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.625rem 0.75rem;
  border-radius: var(--ctrlk-item-radius);
  font-size: 0.925rem;
  color: var(--ctrlk-text);
  cursor: pointer;
  user-select: none;
  gap: 0.75rem;
  transition: background-color 80ms ease, color 80ms ease;
}

.ctrlk-item[data-selected="true"] {
  background-color: var(--ctrlk-item-hover);
}

.ctrlk-item[data-disabled="true"] {
  opacity: 0.45;
  cursor: not-allowed;
}

.ctrlk-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: var(--ctrlk-text-muted);
  flex-shrink: 0;
}

.ctrlk-item[data-selected="true"] .ctrlk-item-icon {
  color: var(--ctrlk-accent);
}

.ctrlk-item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ctrlk-item-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ctrlk-item-desc {
  font-size: 0.775rem;
  color: var(--ctrlk-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ctrlk-item-shortcut {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  flex-shrink: 0;
}

.ctrlk-kbd {
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--ctrlk-kbd-text);
  background: var(--ctrlk-kbd-bg);
  border: 1px solid var(--ctrlk-kbd-border);
  border-radius: 4px;
  padding: 2px 5px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ctrlk-empty {
  padding: 2.5rem 1rem;
  text-align: center;
  color: var(--ctrlk-text-muted);
  font-size: 0.9rem;
}

.ctrlk-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-top: 1px solid var(--ctrlk-card-border);
  background: rgba(0, 0, 0, 0.02);
  font-size: 0.75rem;
  color: var(--ctrlk-text-muted);
}

.ctrlk-footer-hints {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ctrlk-hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
`;

const STYLE_TAG_ID = 'ctrlk-default-styles';

export function injectDefaultStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_TAG_ID)) return;

  const styleEl = document.createElement('style');
  styleEl.id = STYLE_TAG_ID;
  styleEl.textContent = DEFAULT_STYLES;
  document.head.appendChild(styleEl);
}

export function removeDefaultStyles(): void {
  if (typeof document === 'undefined') return;
  const styleEl = document.getElementById(STYLE_TAG_ID);
  if (styleEl) {
    styleEl.remove();
  }
}
