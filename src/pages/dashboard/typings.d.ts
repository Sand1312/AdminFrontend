// import { DataItem } from '@antv/g2plot/esm/interface/config';

// export { DataItem };

declare namespace API {
  type DateRangeParam = {
    startDate: String;
    endDate: String;
    type: String;
  };

  interface VisitDataType {
    date: string;
    totalAmount: number;
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
}
