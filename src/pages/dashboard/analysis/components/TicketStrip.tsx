import React from 'react';

const TicketStrip = ({ ticketData }: { loading: boolean; ticketData: number[][] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      {ticketData.map((trip, tripIndex) => (
        <div
          key={tripIndex}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <span style={{ width: 60, marginRight: 8 }}>Trip {tripIndex + 1}</span>
          <div style={{ display: 'flex', flex: 1 }}>
            {trip.map((val, segIndex) => (
              <div
                key={segIndex}
                style={{
                  flex: 1,
                  aspectRatio: '1/1', // giữ hình vuông nếu thích
                  backgroundColor: val === 1 ? '#1677ff' : '#e5e5e5',
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketStrip;
