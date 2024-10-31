import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { ApiService } from './api.service'
import { TransitLine } from 'src/types/line'

describe('ApiService', () => {
  let service: ApiService
  let httpMock: HttpTestingController

  const mockTransitLine: TransitLine = {
    id: 'u9',
    stops: [
      {
        lat: 52.557107,
        lng: 13.373279,
        name: 'U Osloer Str. (Berlin)',
        id: 'cca80ef6-8948-444d-af74-580da16f0177',
        prevId: null,
        nextId: '94ff93c4-bcd5-44b2-9630-b92fb1dcdfc3',
        peopleOn: 150,
        peopleOff: 0,
        reachablePopulationWalk: 565,
        reachablePopulationBike: 6590,
      },
      {
        lat: 52.551524,
        lng: 13.367365,
        name: 'U Nauener Platz (Berlin)',
        id: '94ff93c4-bcd5-44b2-9630-b92fb1dcdfc3',
        prevId: 'cca80ef6-8948-444d-af74-580da16f0177',
        nextId: 'ed286c0f-4887-417c-a112-7f0c92ce02a6',
        peopleOn: 42,
        peopleOff: 5,
        reachablePopulationWalk: 5155,
        reachablePopulationBike: 50034,
      },
      {
        lat: 52.546493,
        lng: 13.359395,
        name: 'U Leopoldplatz (Berlin)',
        id: 'ed286c0f-4887-417c-a112-7f0c92ce02a6',
        prevId: '94ff93c4-bcd5-44b2-9630-b92fb1dcdfc3',
        nextId: 'e166d902-c2c3-41d0-b397-3b14e0a44863',
        peopleOn: 22,
        peopleOff: 10,
        reachablePopulationWalk: 5165,
        reachablePopulationBike: 51548,
      },
      {
        lat: 52.542202,
        lng: 13.349534,
        name: 'U Amrumer Str. (Berlin)',
        id: 'e166d902-c2c3-41d0-b397-3b14e0a44863',
        prevId: 'ed286c0f-4887-417c-a112-7f0c92ce02a6',
        nextId: '13a05abd-58d8-4d41-b128-28d90cbe4908',
        peopleOn: 37,
        peopleOff: 30,
        reachablePopulationWalk: 445,
        reachablePopulationBike: 247232,
      },
      {
        lat: 52.536183,
        lng: 13.343837,
        name: 'S+U Westhafen (Berlin)',
        id: '13a05abd-58d8-4d41-b128-28d90cbe4908',
        prevId: 'e166d902-c2c3-41d0-b397-3b14e0a44863',
        nextId: '85b2a22c-0227-4f64-8187-9b894faa5716',
        peopleOn: 8,
        peopleOff: 7,
        reachablePopulationWalk: 653,
        reachablePopulationBike: 15616,
      },
      {
        lat: 52.532229,
        lng: 13.341417,
        name: 'U Birkenstr. (Berlin)',
        id: '85b2a22c-0227-4f64-8187-9b894faa5716',
        prevId: '13a05abd-58d8-4d41-b128-28d90cbe4908',
        nextId: 'f18f36b4-93f4-42a0-802c-9ac58003bdda',
        peopleOn: 3,
        peopleOff: 17,
        reachablePopulationWalk: 8948,
        reachablePopulationBike: 135453,
      },
      {
        lat: 52.525938,
        lng: 13.341417,
        name: 'U Turmstr. (Berlin)',
        id: 'f18f36b4-93f4-42a0-802c-9ac58003bdda',
        prevId: '85b2a22c-0227-4f64-8187-9b894faa5716',
        nextId: '82d4f0b7-6ad3-458f-a352-6b85a3c49eb5',
        peopleOn: 32,
        peopleOff: 8,
        reachablePopulationWalk: 8754,
        reachablePopulationBike: 15658,
      },
      {
        lat: 52.518111,
        lng: 13.342165,
        name: 'U Hansaplatz (Berlin)',
        id: '82d4f0b7-6ad3-458f-a352-6b85a3c49eb5',
        prevId: 'f18f36b4-93f4-42a0-802c-9ac58003bdda',
        nextId: '6ba485d9-608f-4519-a0b3-b79f2bbf6f57',
        peopleOn: 15,
        peopleOff: 10,
        reachablePopulationWalk: 5654,
        reachablePopulationBike: 25825,
      },
      {
        lat: 52.509231,
        lng: 13.332615,
        name: 'Berlin, Hertzallee',
        id: '6ba485d9-608f-4519-a0b3-b79f2bbf6f57',
        prevId: '82d4f0b7-6ad3-458f-a352-6b85a3c49eb5',
        nextId: '102a013a-8bfd-41f7-92d0-5a0c674a0871',
        peopleOn: 20,
        peopleOff: 11,
        reachablePopulationWalk: 2536,
        reachablePopulationBike: 423517,
      },
      {
        lat: 52.506921,
        lng: 13.332707,
        name: 'S+U Zoologischer Garten Bhf (Berlin)',
        id: '102a013a-8bfd-41f7-92d0-5a0c674a0871',
        prevId: '6ba485d9-608f-4519-a0b3-b79f2bbf6f57',
        nextId: 'ab369a61-8395-4492-a70c-fe08fdc4c796',
        peopleOn: 20,
        peopleOff: 15,
        reachablePopulationWalk: 321,
        reachablePopulationBike: 684651,
      },
      {
        lat: 52.503763,
        lng: 13.331419,
        name: 'U Kurfürstendamm (Berlin)',
        id: 'ab369a61-8395-4492-a70c-fe08fdc4c796',
        prevId: '102a013a-8bfd-41f7-92d0-5a0c674a0871',
        nextId: '22945c6a-7ae0-4941-9b00-aaf87adb4985',
        peopleOn: 7,
        peopleOff: 9,
        reachablePopulationWalk: 5151,
        reachablePopulationBike: 3543,
      },
      {
        lat: 52.496582,
        lng: 13.330613,
        name: 'U Spichernstr. (Berlin)',
        id: '22945c6a-7ae0-4941-9b00-aaf87adb4985',
        prevId: 'ab369a61-8395-4492-a70c-fe08fdc4c796',
        nextId: '49b00146-5cb1-4581-8a64-96bf61ed62d3',
        peopleOn: 5,
        peopleOff: 13,
        reachablePopulationWalk: 1156,
        reachablePopulationBike: 874884,
      },
      {
        lat: 52.491992,
        lng: 13.33121,
        name: 'U Güntzelstr. (Berlin)',
        id: '49b00146-5cb1-4581-8a64-96bf61ed62d3',
        prevId: '22945c6a-7ae0-4941-9b00-aaf87adb4985',
        nextId: 'cbca828b-1d61-4c21-b7a6-b66ddecccec9',
        peopleOn: 26,
        peopleOff: 15,
        reachablePopulationWalk: 5187,
        reachablePopulationBike: 656584,
      },
      {
        lat: 52.487047,
        lng: 13.331355,
        name: 'U Berliner Str. (Berlin)',
        id: 'cbca828b-1d61-4c21-b7a6-b66ddecccec9',
        prevId: '49b00146-5cb1-4581-8a64-96bf61ed62d3',
        nextId: 'a4a66083-f054-407b-a7b4-c6f6950cc69e',
        peopleOn: 0,
        peopleOff: 10,
        reachablePopulationWalk: 4886,
        reachablePopulationBike: 66684,
      },
      {
        lat: 52.477366,
        lng: 13.329149,
        name: 'S+U Bundesplatz (Berlin)',
        id: 'a4a66083-f054-407b-a7b4-c6f6950cc69e',
        prevId: 'cbca828b-1d61-4c21-b7a6-b66ddecccec9',
        nextId: 'fed6d6ee-adb8-4b7b-9d18-c890d49b71c6',
        peopleOn: 4,
        peopleOff: 20,
        reachablePopulationWalk: 1486,
        reachablePopulationBike: 15488,
      },
      {
        lat: 52.471439,
        lng: 13.328676,
        name: 'U Friedrich-Wilhelm-Platz (Berlin)',
        id: 'fed6d6ee-adb8-4b7b-9d18-c890d49b71c6',
        prevId: 'a4a66083-f054-407b-a7b4-c6f6950cc69e',
        nextId: '23179494-9894-4ef4-88b6-1dbdc1d9ade5',
        peopleOn: 10,
        peopleOff: 35,
        reachablePopulationWalk: 11787,
        reachablePopulationBike: 486361,
      },
      {
        lat: 52.464998,
        lng: 13.328409,
        name: 'U Walther-Schreiber-Platz (Berlin)',
        id: '23179494-9894-4ef4-88b6-1dbdc1d9ade5',
        prevId: 'fed6d6ee-adb8-4b7b-9d18-c890d49b71c6',
        nextId: '0b92f7be-81c8-49f5-869d-032beecb408c',
        peopleOn: 6,
        peopleOff: 55,
        reachablePopulationWalk: 5177,
        reachablePopulationBike: 56485,
      },
      {
        lat: 52.461183,
        lng: 13.324836,
        name: 'U Schloßstr. (Berlin)',
        id: '0b92f7be-81c8-49f5-869d-032beecb408c',
        prevId: '23179494-9894-4ef4-88b6-1dbdc1d9ade5',
        nextId: 'e109524d-b6f3-4657-907f-cac3900b53aa',
        peopleOn: 13,
        peopleOff: 100,
        reachablePopulationWalk: 5184,
        reachablePopulationBike: 561468,
      },
      {
        lat: 52.456438,
        lng: 13.319986,
        name: 'S+U Rathaus Steglitz (Berlin)',
        id: 'e109524d-b6f3-4657-907f-cac3900b53aa',
        prevId: '0b92f7be-81c8-49f5-869d-032beecb408c',
        nextId: null,
        peopleOn: 0,
        peopleOff: 50,
        reachablePopulationWalk: 2848,
        reachablePopulationBike: 543345,
      },
    ],
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    })

    service = TestBed.inject(ApiService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  test('should be created', () => {
    expect(service).toBeTruthy()
  })

  test('should fetch all lines', () => {
    service.getAllLines().subscribe((data) => {
      expect(data).toEqual(mockTransitLine)
    })

    const req = httpMock.expectOne('http://localhost:9000/transit-lines/u9')
    expect(req.request.method).toBe('GET')

    req.flush(mockTransitLine)
  })
})
