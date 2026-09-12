var C=Object.defineProperty;var A=(o,e,t)=>e in o?C(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var d=(o,e,t)=>A(o,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();function k(o,e){if(!o)return 1;if(!e)return-1;const t=o.toLowerCase(),n=e.toLowerCase();if(n===t)return 1e3;if(n.startsWith(t))return 800-(n.length-t.length);const r=n.indexOf(t);if(r!==-1){const a=r===0||/\s|[._\-/]/.test(n[r-1]);return 600-r*5+(a?100:0)}let i=0,l=0,s=-2,h=0;for(let a=0;a<n.length;a++)if(n[a]===t[l]){i+=10,a===s+1?(h++,i+=h*15):h=0;const f=a===0||/\s|[._\-/]/.test(n[a-1]),v=e[a]!==e[a].toLowerCase()&&a>0&&e[a-1]===e[a-1].toLowerCase();if(f?i+=50:v&&(i+=35),s=a,l++,l===t.length)return i-=(n.length-t.length)*2,Math.max(i,1)}return-1}function S(o,e){const t=o.trim();if(!t)return e;const n=[];for(const r of e){if(r.disabled)continue;let i=-1;const l=k(t,r.label);if(l>0&&(i=Math.max(i,l*3)),r.keywords&&r.keywords.length>0)for(const s of r.keywords){const h=k(t,s);h>0&&(i=Math.max(i,h*2.5))}if(r.description){const s=k(t,r.description);s>0&&(i=Math.max(i,s*1.5))}if(r.group){const s=k(t,r.group);s>0&&(i=Math.max(i,s))}i>0&&n.push({item:r,score:i})}return n.sort((r,i)=>i.score-r.score),n.map(r=>r.item)}class I{constructor(e,t){d(this,"items",new Map);d(this,"groupConfigs",new Map);t&&this.setGroupConfigs(t),e&&this.register(e)}setGroupConfigs(e){for(const[t,n]of Object.entries(e))this.groupConfigs.set(t,n)}register(e){const t=Array.isArray(e)?e:[e];for(const n of t)this.items.set(n.id,n)}unregister(e){return this.items.delete(e)}clear(){this.items.clear()}setItems(e){this.clear(),this.register(e)}getItem(e){return this.items.get(e)}getAll(){return Array.from(this.items.values())}search(e){return S(e,this.getAll())}groupItems(e){const t=new Map,n="__default__";for(const i of e){const l=i.group||n;t.has(l)||t.set(l,[]),t.get(l).push(i)}const r=[];for(const[i,l]of t.entries())if(i===n)r.push({key:i,label:"",order:9999,items:l});else{const s=this.groupConfigs.get(i);r.push({key:i,label:(s==null?void 0:s.label)||i,order:(s==null?void 0:s.order)??0,items:l})}return r.sort((i,l)=>i.order!==l.order?i.order-l.order:i.label.localeCompare(l.label)),r}}const L=typeof navigator<"u"&&/Mac|iPod|iPhone|iPad/.test(navigator.platform||navigator.userAgent);function T(o){const e=o.toLowerCase().split("+").map(s=>s.trim());let t=!1,n=!1,r=!1,i=!1,l="";for(const s of e)s==="ctrl"||s==="control"?t=!0:s==="meta"||s==="cmd"||s==="command"?n=!0:s==="mod"?L?n=!0:t=!0:s==="shift"?r=!0:s==="alt"||s==="opt"||s==="option"?i=!0:l=s;return{ctrl:t,meta:n,shift:r,alt:i,key:l}}function N(o,e){return e.ctrl!==o.ctrlKey||e.meta!==o.metaKey||e.shift!==o.shiftKey||e.alt!==o.altKey?!1:o.key.toLowerCase()===e.key}function O(o){if(!o||!(o instanceof HTMLElement))return!1;const e=o.tagName;return e==="INPUT"||e==="TEXTAREA"||e==="SELECT"||o.isContentEditable}function M(o,e,t={}){const r=(Array.isArray(o)?o:[o]).map(T),i=l=>{if(!t.allowInInputs&&O(l.target))return;r.some(h=>N(l,h))&&(l.preventDefault(),e(l))};return window.addEventListener("keydown",i,!0),()=>{window.removeEventListener("keydown",i,!0)}}const D=`
:root,
[data-ctrlk-theme="light"] {
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
`,w="ctrlk-default-styles";function H(){if(typeof document>"u"||document.getElementById(w))return;const o=document.createElement("style");o.id=w,o.textContent=D,document.head.appendChild(o)}class _{constructor(e){d(this,"previousActiveElement",null);d(this,"container");d(this,"keydownHandler",null);d(this,"originalOverflow","");this.container=e}activate(e){if(!(typeof document>"u")){if(this.previousActiveElement=document.activeElement,this.originalOverflow=document.body.style.overflow,document.body.style.overflow="hidden",e)e.focus();else{const t=this.getFocusableElements();t.length>0&&t[0].focus()}this.keydownHandler=t=>{if(t.key!=="Tab")return;const n=this.getFocusableElements();if(n.length===0){t.preventDefault();return}const r=n[0],i=n[n.length-1];t.shiftKey?document.activeElement===r&&(t.preventDefault(),i.focus()):document.activeElement===i&&(t.preventDefault(),r.focus())},this.container.addEventListener("keydown",this.keydownHandler)}}deactivate(){typeof document>"u"||(this.keydownHandler&&(this.container.removeEventListener("keydown",this.keydownHandler),this.keydownHandler=null),document.body.style.overflow=this.originalOverflow,this.previousActiveElement&&typeof this.previousActiveElement.focus=="function"&&this.previousActiveElement.focus())}getFocusableElements(){const e=['input:not([disabled]):not([data-visible="false"])','button:not([disabled]):not([data-visible="false"])','a[href]:not([data-visible="false"])','select:not([disabled]):not([data-visible="false"])','textarea:not([disabled]):not([data-visible="false"])','[tabindex]:not([tabindex="-1"]):not([data-visible="false"])'].join(", ");return Array.from(this.container.querySelectorAll(e))}}const P=`
<svg class="ctrlk-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8"></circle>
  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
</svg>
`,B=`
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
`;function z(o){const e=document.createElement("div");e.className="ctrlk-overlay",e.setAttribute("data-state","closed"),o.theme&&o.theme!=="auto"&&e.setAttribute("data-ctrlk-theme",o.theme);const t=document.createElement("div");t.className="ctrlk-dialog",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label","Command Palette");const n=document.createElement("div");n.className="ctrlk-header",n.innerHTML=P;const r=document.createElement("input");r.type="text",r.className="ctrlk-input",r.placeholder=o.placeholder||"Type a command or search...",r.setAttribute("role","combobox"),r.setAttribute("aria-autocomplete","list"),r.setAttribute("aria-expanded","true"),r.setAttribute("aria-controls","ctrlk-listbox"),r.setAttribute("aria-haspopup","listbox"),r.setAttribute("autocomplete","off"),r.setAttribute("autocorrect","off"),r.setAttribute("spellcheck","false");const i=document.createElement("button");i.type="button",i.className="ctrlk-clear-btn",i.setAttribute("aria-label","Clear search query"),i.innerHTML=B,n.appendChild(r),n.appendChild(i);const l=document.createElement("div");l.className="ctrlk-list-container",l.id="ctrlk-listbox",l.setAttribute("role","listbox");const s=document.createElement("div");return s.className="ctrlk-footer",s.innerHTML=`
    <div class="ctrlk-footer-hints">
      <span class="ctrlk-hint"><kbd class="ctrlk-kbd">↑</kbd><kbd class="ctrlk-kbd">↓</kbd> navigate</span>
      <span class="ctrlk-hint"><kbd class="ctrlk-kbd">↵</kbd> select</span>
      <span class="ctrlk-hint"><kbd class="ctrlk-kbd">esc</kbd> close</span>
    </div>
    <span>Ctrl+K</span>
  `,t.appendChild(n),t.appendChild(l),t.appendChild(s),e.appendChild(t),{overlay:e,dialog:t,input:r,clearBtn:i,listContainer:l}}function j(o,e,t,n,r){o.innerHTML="";const i=[];let l=0;for(const s of e){if(s.items.length===0)continue;const h=document.createElement("div");if(h.className="ctrlk-group",s.label){const a=document.createElement("div");a.className="ctrlk-group-label",a.textContent=s.label,h.appendChild(a)}for(const a of s.items){i.push(a);const f=l===t,v=l,m=document.createElement("div");if(m.className="ctrlk-item",m.id=`ctrlk-item-${a.id}`,m.setAttribute("role","option"),m.setAttribute("aria-selected",f?"true":"false"),m.setAttribute("data-selected",f?"true":"false"),m.setAttribute("data-disabled",a.disabled?"true":"false"),m.setAttribute("data-index",String(v)),a.icon){const c=document.createElement("div");c.className="ctrlk-item-icon",typeof a.icon=="string"?a.icon.trim().startsWith("<svg")?c.innerHTML=a.icon:c.textContent=a.icon:a.icon instanceof HTMLElement&&c.appendChild(a.icon.cloneNode(!0)),m.appendChild(c)}const b=document.createElement("div");b.className="ctrlk-item-content";const y=document.createElement("div");if(y.className="ctrlk-item-title",y.textContent=a.label,b.appendChild(y),a.description){const c=document.createElement("div");c.className="ctrlk-item-desc",c.textContent=a.description,b.appendChild(c)}if(m.appendChild(b),a.shortcut&&a.shortcut.length>0){const c=document.createElement("div");c.className="ctrlk-item-shortcut";for(const E of a.shortcut){const x=document.createElement("kbd");x.className="ctrlk-kbd",x.textContent=E,c.appendChild(x)}m.appendChild(c)}m.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation(),a.disabled||r(a)}),h.appendChild(m),l++}o.appendChild(h)}if(i.length===0){const s=document.createElement("div");s.className="ctrlk-empty",s.textContent=n||"No results found.",o.appendChild(s)}else{const s=o.querySelector('[data-selected="true"]');s&&typeof s.scrollIntoView=="function"&&s.scrollIntoView({block:"nearest"})}return i}class K{constructor(e={}){d(this,"options");d(this,"registry");d(this,"dom",null);d(this,"focusTrap",null);d(this,"unbindHotkeys",null);d(this,"_isOpen",!1);d(this,"selectedIndex",0);d(this,"currentSelectableItems",[]);d(this,"searchCounter",0);this.options={items:e.items||[],placeholder:e.placeholder||"Type a command or search...",emptyText:e.emptyText||"No results found.",hotkey:e.hotkey||["ctrl+k","meta+k"],allowInInputs:e.allowInInputs??!1,theme:e.theme||"auto",injectStyles:e.injectStyles??!0,closeOnSelect:e.closeOnSelect??!0,onOpen:e.onOpen,onClose:e.onClose,onSelect:e.onSelect,onSearch:e.onSearch},this.registry=new I(this.options.items,e.groups),this.init()}init(){typeof window>"u"||typeof document>"u"||(this.options.injectStyles&&H(),this.setupDOM(),this.setupListeners())}setupDOM(){this.dom=z({placeholder:this.options.placeholder,theme:this.options.theme}),document.body.appendChild(this.dom.overlay),this.focusTrap=new _(this.dom.overlay)}setupListeners(){this.dom&&(this.unbindHotkeys=M(this.options.hotkey,()=>{this.toggle()},{allowInInputs:this.options.allowInInputs}),this.dom.overlay.addEventListener("click",e=>{var t;e.target===((t=this.dom)==null?void 0:t.overlay)&&this.close()}),this.dom.clearBtn.addEventListener("click",()=>{this.dom&&(this.dom.input.value="",this.dom.input.focus(),this.handleSearch(""))}),this.dom.input.addEventListener("input",()=>{const e=this.dom?this.dom.input.value:"";this.handleSearch(e)}),this.dom.dialog.addEventListener("keydown",e=>{switch(e.key){case"ArrowDown":e.preventDefault(),this.navigate(1);break;case"ArrowUp":e.preventDefault(),this.navigate(-1);break;case"Enter":e.preventDefault(),this.executeSelected();break;case"Escape":e.preventDefault(),this.close();break}}))}open(){var e,t,n;this._isOpen||!this.dom||(this._isOpen=!0,this.dom.overlay.setAttribute("data-state","open"),this.dom.input.value="",this.dom.clearBtn.setAttribute("data-visible","false"),this.updateList(this.registry.getAll()),this.selectedIndex=0,this.updateSelection(),(e=this.focusTrap)==null||e.activate(this.dom.input),(n=(t=this.options).onOpen)==null||n.call(t))}close(){var e,t,n;!this._isOpen||!this.dom||(this._isOpen=!1,this.dom.overlay.setAttribute("data-state","closed"),(e=this.focusTrap)==null||e.deactivate(),(n=(t=this.options).onClose)==null||n.call(t))}toggle(){this._isOpen?this.close():this.open()}isOpen(){return this._isOpen}register(e){this.registry.register(e),this._isOpen&&this.dom&&this.handleSearch(this.dom.input.value)}unregister(e){const t=this.registry.unregister(e);return t&&this._isOpen&&this.dom&&this.handleSearch(this.dom.input.value),t}setItems(e){this.registry.setItems(e),this._isOpen&&this.dom&&this.handleSearch(this.dom.input.value)}getItems(){return this.registry.getAll()}setTheme(e){this.options.theme=e,this.dom&&(e==="auto"?this.dom.overlay.removeAttribute("data-ctrlk-theme"):this.dom.overlay.setAttribute("data-ctrlk-theme",e))}select(e){var t,n;e.disabled||(this.options.closeOnSelect&&this.close(),(n=(t=this.options).onSelect)==null||n.call(t,e),e.handler&&e.handler(e),e.href&&(e.target==="_blank"?window.open(e.href,"_blank","noopener,noreferrer"):window.location.href=e.href))}handleSearch(e){if(!this.dom)return;if(this.dom.clearBtn.setAttribute("data-visible",e.length>0?"true":"false"),this.options.onSearch){const n=++this.searchCounter,r=this.options.onSearch(e);if(r instanceof Promise){r.then(i=>{n===this.searchCounter&&Array.isArray(i)&&this.updateList(i)});return}else if(Array.isArray(r)){this.updateList(r);return}}const t=this.registry.search(e);this.updateList(t)}updateList(e){if(!this.dom)return;const t=this.registry.groupItems(e);this.currentSelectableItems=j(this.dom.listContainer,t,this.selectedIndex,this.options.emptyText,n=>this.select(n)),this.selectedIndex>=this.currentSelectableItems.length&&(this.selectedIndex=Math.max(0,this.currentSelectableItems.length-1)),this.updateSelection()}navigate(e){var r;if(this.currentSelectableItems.length===0)return;const t=this.currentSelectableItems.length;let n=this.selectedIndex;for(let i=0;i<t;i++)if(n=(n+e+t)%t,!((r=this.currentSelectableItems[n])!=null&&r.disabled)){this.selectedIndex=n,this.updateSelection();break}}updateSelection(){if(!this.dom)return;this.dom.listContainer.querySelectorAll(".ctrlk-item").forEach((t,n)=>{var i;const r=n===this.selectedIndex;t.setAttribute("data-selected",r?"true":"false"),t.setAttribute("aria-selected",r?"true":"false"),r&&((i=this.dom)==null||i.input.setAttribute("aria-activedescendant",t.id),typeof t.scrollIntoView=="function"&&t.scrollIntoView({block:"nearest"}))}),this.currentSelectableItems.length===0&&this.dom.input.removeAttribute("aria-activedescendant")}executeSelected(){const e=this.currentSelectableItems[this.selectedIndex];e&&!e.disabled&&this.select(e)}destroy(){this.close(),this.unbindHotkeys&&(this.unbindHotkeys(),this.unbindHotkeys=null),this.dom&&(this.dom.overlay.remove(),this.dom=null),this.registry.clear()}}const G=document.getElementById("log-box"),R=/Mac|iPod|iPhone|iPad/.test(navigator.platform||navigator.userAgent);R&&(document.getElementById("mod-key").textContent="⌘");function u(o){const e=new Date().toLocaleTimeString(),t=document.createElement("div");t.className="log-item",t.innerHTML=`<span class="log-time">[${e}]</span> <span>${o}</span>`,G.prepend(t)}const p=new K({groups:{nav:{label:"Navigation",order:0},actions:{label:"Quick Actions",order:1},theme:{label:"Appearance",order:2}},items:[{id:"home",label:"Go to Homepage",description:"Return to root overview",group:"nav",icon:"🏠",shortcut:["G","H"],handler:()=>u("Navigated to Homepage")},{id:"docs",label:"Documentation",description:"Explore the API reference and guides",group:"nav",icon:"📖",shortcut:["G","D"],handler:()=>u("Opened Documentation")},{id:"github",label:"GitHub Repository",description:"View source code on GitHub",group:"nav",icon:"🐙",href:"https://github.com/dmitrij-borchuk/ctrl-k",target:"_blank"},{id:"copy-link",label:"Copy Page Link",description:"Copy current URL to clipboard",group:"actions",icon:"🔗",shortcut:["Ctrl","C"],handler:()=>{var o;(o=navigator.clipboard)==null||o.writeText(window.location.href),u("Copied URL to clipboard!")}},{id:"create-file",label:"Create New Document",description:"Initialize a fresh document in workspace",group:"actions",icon:"📄",shortcut:["N"],handler:()=>u("Triggered New Document creation")},{id:"theme-dark-cmd",label:"Switch to Dark Mode",description:"Set palette and application to dark theme",group:"theme",icon:"🌙",handler:()=>{p.setTheme("dark"),u("Palette theme set to Dark")}},{id:"theme-light-cmd",label:"Switch to Light Mode",description:"Set palette and application to light theme",group:"theme",icon:"☀️",handler:()=>{p.setTheme("light"),u("Palette theme set to Light")}}],onOpen:()=>u("Palette opened"),onClose:()=>u("Palette closed"),onSelect:o=>u(`Selected: "${o.label}"`)});document.getElementById("open-btn").addEventListener("click",()=>p.open());document.getElementById("theme-dark").addEventListener("click",()=>{p.setTheme("dark"),u("Theme: Dark")});document.getElementById("theme-light").addEventListener("click",()=>{p.setTheme("light"),u("Theme: Light")});document.getElementById("theme-auto").addEventListener("click",()=>{p.setTheme("auto"),u("Theme: Auto")});let g=1;document.getElementById("add-dynamic").addEventListener("click",()=>{const o=`dynamic-${g}`;p.register({id:o,label:`Dynamic Action #${g}`,description:"Dynamically registered command",group:"actions",icon:"✨",handler:()=>u(`Executed Dynamic Action #${o}`)}),u(`Registered: Dynamic Action #${g}`),g++});
