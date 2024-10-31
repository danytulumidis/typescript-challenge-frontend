import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core'
import { MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { Store } from '@ngrx/store'
import { RootState } from 'src/store/app.store'
import { TransitLinesActions } from 'src/store/transit-lines/transit-lines.actions'
import { fromTransitLines } from 'src/store/transit-lines/transit-lines.selectors'
import { TransitStop } from 'src/types/line'

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIconButton, MatIcon],
})
export class DetailComponent {
  readonly stopName: Signal<string>
  protected selectedStop: Signal<TransitStop>

  constructor(private store: Store<RootState>) {
    this.selectedStop = this.store.selectSignal(fromTransitLines.selectedStop)
    this.stopName = computed(() => this.selectedStop()?.name || 'No selection')
  }

  clearSelection(): void {
    this.store.dispatch(TransitLinesActions.SelectStop({ selectedStopId: null }))
  }

  deleteStop(): void {
    this.store.dispatch(TransitLinesActions.DeleteStop({ lineId: 'u9', selectedStopId: this.selectedStop().id }))
    this.store.dispatch(TransitLinesActions.SelectStop({ selectedStopId: null }))
  }
}
