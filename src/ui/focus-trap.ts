export class FocusTrap {
  private previousActiveElement: HTMLElement | null = null;
  private container: HTMLElement;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private originalOverflow: string = '';

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public activate(initialFocusEl?: HTMLElement): void {
    if (typeof document === 'undefined') return;

    this.previousActiveElement = document.activeElement as HTMLElement | null;
    this.originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (initialFocusEl) {
      initialFocusEl.focus();
    } else {
      const focusable = this.getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }

    this.keydownHandler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = this.getFocusableElements();
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    this.container.addEventListener('keydown', this.keydownHandler);
  }

  public deactivate(): void {
    if (typeof document === 'undefined') return;

    if (this.keydownHandler) {
      this.container.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }

    document.body.style.overflow = this.originalOverflow;

    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      this.previousActiveElement.focus();
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const selector = [
      'input:not([disabled])',
      'button:not([disabled])',
      'a[href]',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(this.container.querySelectorAll<HTMLElement>(selector));
  }
}
