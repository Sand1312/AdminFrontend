// import { DataItem } from '@antv/g2plot/esm/interface/config';

// export { DataItem };

// export interface TrainResponse {
//     trainId: string ;
//     trainName: string;
//     route: string
//   }

//   export interface addTripRequest {
//     trainId: number;
//     basePrice: string;
//     tripDate: string;
//     numSoftSeatCarriages: number;
//     numSixBerthCarriages: number;
//     numFourBerthCarriages: number;
//   }

// declare namespace TripAPI{
//     type trainResponse= {
//         trainId: string ;
//         trainName: string;
//         route: string
//       }
    
//     type addTripRequest= {
//         trainId: number;
//         basePrice: string;
//         tripDate: string;
//         numSoftSeatCarriages: number;
//         numSixBerthCarriages: number;
//         numFourBerthCarriages: number;
//       }
//   }

// data.d.ts (hoặc tốt hơn: data.ts)

export type TrainResponse = {
    trainId: string;
    trainName: string;
    route: string;
  };
  
export type AddTripRequest = {
    trainId: string;
    basePrice: number;
    tripDate: string;
    numSoftSeatCarriages: number;
    numSixBerthCarriages: number;
    numFourBerthCarriages: number;
  };
  