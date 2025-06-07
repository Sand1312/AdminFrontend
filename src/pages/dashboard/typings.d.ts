// import { DataItem } from '@antv/g2plot/esm/interface/config';

// export { DataItem };

declare namespace API {
  type DateRangeParam = {
    startDate: string;
    endDate: string;
    type: string;
  };

  interface VisitDataType {
    date: string;
    totalSales: number;
  }

  type RankingRoutes = {
    departureStation: String;
    arrivalStation: String;
    ticketCount: Int;
  };

  type TicketsCountByType = {
    ticketTypeName: string;
    ticketCount: Int;
  };

  type RankingUsers = {
    customerId: number;
    email: string;
    phone: string;
    ticketCount: number;
  };

  interface TicketType {
    ticketId: number;
    tripId: number;
    departureStation: string;
    arrivalStation: string;
    seatId: number;
    trainName: string;
    routeName: string;
  }
}
