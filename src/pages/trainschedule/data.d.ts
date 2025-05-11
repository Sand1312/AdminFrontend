// trainschedule/data.d.ts
export interface Train {
    trainId: number;
    trainName: string;
    route: {
      routeName: string;
    };
  }
  
  export interface Station {
    stationId: number;
    stationName: string;
  }
  
  export interface TrainSchedule {
    trainScheduleId: number;
    train: Train;
    station: Station;
    departureTime: string;
    arrivalTime: string;
    day: number;
    distance: number;
  }
  