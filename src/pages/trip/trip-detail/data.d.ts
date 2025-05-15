export interface Trip {
  tripId: number;
  tripDate: string;
  tripStatus: string;
  basePrice: number;
  train: {
    trainId: number;
    trainName: string;
    route: {
      routeId: number;
      routeName: string;
    };
    trainSchedules: {
      trainScheduleId: number;
      day: number;
      arrivalTime: string;
      departureTime: string;
      distance: number;
      station: {
        stationId: number;
        stationName: string;
        location: string;
      };
    }[];
  };
  carriageLists: {
    carriageListId: number;
    compartment: {
      compartmentId: number;
      compartmentName: string;
      seatCount: number;
      classFactor: number;
    };
    seats: {
      seatId: number;
      seatNumber: string;
      floor: number;
      seatFactor: number;
      seatStatus: string;
    }[];
    stt: number;
  }[];
}
