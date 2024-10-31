import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { GeoJSONSource, Map, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl'
import { MARKER_PAINT } from 'src/constants/marker-paint'
import { environment } from 'src/environments/environment'
import { RootState } from 'src/store/app.store'
import { fromTransitLines } from 'src/store/transit-lines/transit-lines.selectors'
import { ApiService } from './services/api.service'
import { TransitLine } from 'src/types/line'
import { TransitLinesActions } from 'src/store/transit-lines/transit-lines.actions'
import { filter } from 'rxjs/operators'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet, MatSnackBarModule],
})
export class AppComponent implements OnInit {
  @ViewChild('map', { static: true }) private mapRef: ElementRef<HTMLElement>

  private map: Map

  constructor(
    private store: Store<RootState>,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Issue https://github.com/targomo/typescript-challenge-frontend/issues/3
    this.apiService.getAllLines().subscribe({
      next: (line: TransitLine) => {
        this.store.dispatch(TransitLinesActions.AddLine({ line }))
      },
      error: (error) => {
        console.error('Error fetching transit lines:', error)
        this.showErrorMessage('Failed to load transit lines. Please try again later.')
      },
    })

    // Clear highlighted stop when closing the detail view
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      const isDetailView = event.url === '/detail'
      if (!isDetailView) {
        this.clearHighlight()
      }
    })
  }

  ngOnInit(): void {
    this.map = new Map({
      center: { lat: 52.52, lng: 13.4 },
      zoom: 10,
      container: this.mapRef.nativeElement,
      style: `https://api.maptiler.com/maps/dataviz-light/style.json?key=${environment.maptilerApiKey}`,
    })

    this.map.once('load', () => {
      const stopsSource$ = this.store.pipe(select(fromTransitLines.stopsPointGeoJson))
      const STOPS_SOURCE_ID = 'stops-source'
      const HIGHLIGHT_SOURCE_ID = 'highlight-source'
      const HIGHLIGHT_LAYER_ID = 'highlight-layer'

      stopsSource$.subscribe((source) => {
        const exsitingSource = this.map.getSource(STOPS_SOURCE_ID) as GeoJSONSource
        if (exsitingSource) {
          exsitingSource.setData(source.data)
        } else {
          this.map.addSource(STOPS_SOURCE_ID, source)
        }
      })

      const STOPS_LAYER_ID = 'stops-layer'
      this.map.addLayer({ type: 'circle', source: STOPS_SOURCE_ID, id: STOPS_LAYER_ID, paint: MARKER_PAINT })

      this.map.addSource(HIGHLIGHT_SOURCE_ID, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })

      this.map.addLayer({
        id: HIGHLIGHT_LAYER_ID,
        type: 'circle',
        source: HIGHLIGHT_SOURCE_ID,
        paint: {
          'circle-radius': 10,
          'circle-color': '#FF0000',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
        },
      })

      // The following issues are likely to be implemented here
      // https://github.com/targomo/typescript-challenge-frontend/issues/2
      this.map.on('click', STOPS_LAYER_ID, (e: MapMouseEvent) => {
        const lines: MapGeoJSONFeature[] = this.map.queryRenderedFeatures(e.point, { layers: [STOPS_LAYER_ID] })

        if (lines && lines.length) {
          const selectedStopId: string = lines[0].id as string

          // https://github.com/targomo/typescript-challenge-frontend/issues/6
          const highlightSource = this.map.getSource(HIGHLIGHT_SOURCE_ID) as GeoJSONSource
          highlightSource.setData({
            type: 'FeatureCollection',
            features: [lines[0]],
          })

          this.store.dispatch(TransitLinesActions.SelectStop({ selectedStopId }))
        }
      })

      this.map.on('mouseenter', STOPS_LAYER_ID, () => {
        this.map.getCanvas().style.cursor = 'pointer'
      })

      this.map.on('mouseleave', STOPS_LAYER_ID, () => {
        this.map.getCanvas().style.cursor = ''
      })
      // https://github.com/targomo/typescript-challenge-frontend/issues/8
    })
  }

  private clearHighlight(): void {
    const highlightSource = this.map.getSource('highlight-source') as GeoJSONSource

    if (highlightSource) {
      highlightSource.setData({
        type: 'FeatureCollection',
        features: [],
      })
    }
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    })
  }
}
