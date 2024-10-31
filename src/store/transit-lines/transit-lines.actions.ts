import { createAction, props } from '@ngrx/store'
import { TransitLine } from 'src/types/line'

export namespace TransitLinesActions {
  export const AddLine = createAction(`[TRANSIT LINES] Add a line`, props<{ line: TransitLine }>())
  export const SelectStop = createAction(`[TRANSIT LINES] Select a stop`, props<{ selectedStopId: string }>())
  export const DeleteStop = createAction(
    `[TRANSIT LINES] Delete a stop`,
    props<{ lineId: string; selectedStopId: string }>()
  )
}
