import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { mockTransitStop } from 'src/__mocks__/line.mock'
import { RootState } from 'src/store/app.store'
import { fromTransitLines } from 'src/store/transit-lines/transit-lines.selectors'
import { DetailComponent } from './detail.component'
import { TransitLinesActions } from 'src/store/transit-lines/transit-lines.actions'

describe('DetailComponent', () => {
  let component: DetailComponent
  let fixture: ComponentFixture<DetailComponent>
  let mockStore: MockStore<any>

  const mockStopId = 'cca80ef6-8948-444d-af74-580da16f0177'

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailComponent],
      providers: [provideMockStore()],
    }).compileComponents()

    mockStore = TestBed.inject(Store) as MockStore<RootState>
    mockStore.overrideSelector(fromTransitLines.selectedStop, mockTransitStop())
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  test('should create', () => {
    expect(component).toBeTruthy()
  })

  test('deleteStop should dispatch DeleteStop and SelectStop actions', () => {
    const deleteStopAction = TransitLinesActions.DeleteStop({ lineId: 'u9', selectedStopId: mockStopId })
    const selectStopAction = TransitLinesActions.SelectStop({ selectedStopId: null })

    const dispatchSpy = jest.spyOn(mockStore, 'dispatch')

    component.deleteStop()

    expect(dispatchSpy).toHaveBeenCalledWith(deleteStopAction)
    expect(dispatchSpy).toHaveBeenCalledWith(selectStopAction)
  })
})
