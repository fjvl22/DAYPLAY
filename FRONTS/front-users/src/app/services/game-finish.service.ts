import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class GameFinishService {
  private finishAction: (() => void) | null = null;

  setFinishAction(action: () => void) {
    this.finishAction = action;
  }

  executeFinishAction() {
    this.finishAction?.();
  }

  clear() {
    this.finishAction = null;
  }
}