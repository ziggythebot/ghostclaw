import { EventEmitter } from 'events';

export interface DashboardEvent {
  type:
    | 'message'
    | 'bot_message'
    | 'task_start'
    | 'task_complete'
    | 'task_error'
    | 'channel_status';
  data: Record<string, unknown>;
  timestamp: string;
}

class DashboardEventBus extends EventEmitter {
  emit(event: 'dashboard', payload: DashboardEvent): boolean;
  emit(event: string, ...args: unknown[]): boolean {
    return super.emit(event, ...args);
  }

  on(event: 'dashboard', listener: (payload: DashboardEvent) => void): this;
  on(event: string, listener: (...args: unknown[]) => void): this {
    return super.on(event, listener);
  }
}

export const dashboardEvents = new DashboardEventBus();
