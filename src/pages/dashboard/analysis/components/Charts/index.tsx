import numeral from 'numeral';
import ChartCard from './ChartCard';
import Field from './Field';

const yuan = (val: number | string) => `¥ ${numeral(val).format('0,0')}`;
const dong = (val: number | string) => `${numeral(val).format('0,0')} ₫`;

const Charts = {
  yuan,
  dong,
  ChartCard,
  Field,
};

export { Charts as default, yuan, dong, ChartCard, Field };
