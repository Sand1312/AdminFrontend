import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Button, DatePicker, Form, InputNumber, AutoComplete, message } from 'antd';
import moment from 'moment';
import { addTrip } from  '@/services/my-api/tripApi';
import { getAllTrain } from '@/services/my-api/trainApi';  
// import { TripApi } from '@/pages/trip/add-trip/data';
import { TrainResponse } from '@/pages/trip/add-trip/data';
import {AddTripRequest} from '@/pages/trip/add-trip/data'

interface TripForm {
  trainId: string | null;
  tripDate: moment.Moment | null;
  basePrice: number;
  numSoftSeatCarriages: number;
  numSixBerthCarriages: number;
  numFourBerthCarriages: number;
}

const AddTrip: FC = () => {
  const [form] = Form.useForm();
  const [trains, setTrains] = useState<TrainResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  // Lấy danh sách tàu khi component mount
  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await getAllTrain();
        setTrains(response); // Giả sử response là mảng trainResponse
        // Khởi tạo options cho AutoComplete
        setOptions(
          response.map((train) => ({
            value: train.trainId || `fallback-${train.trainName}`,
            label: `${train.trainName} - ${train.route}`,
          })),
        );
      } catch (error) {
        message.error('Failed to load trains');
      }
    };
    fetchTrains();
  }, []);

  // Xử lý tìm kiếm và gợi ý tàu
  const handleSearch = (searchText: string) => {
    if (!searchText) {
      setOptions(
        trains.map((train) => ({
          value: train.trainId || `fallback-${train.trainName}`,
          label: `${train.trainName} - ${train.route}`,
        })),
      );
    } else {
      const filteredOptions = trains
        .filter(
          (train) =>
            train.trainName.toLowerCase().includes(searchText.toLowerCase()) ||
            train.route.toLowerCase().includes(searchText.toLowerCase()),
        )
        .map((train) => ({
          value: train.trainId || `fallback-${train.trainName}`,
          label: `${train.trainName} - ${train.route}`,
        }));
      setOptions(filteredOptions);
    }
  };

  // Xử lý khi chọn một gợi ý
  const handleSelect = (value: string) => {
    form.setFieldsValue({ trainId: value });
  };

  // Xử lý submit form
  const handleSubmit = async (values: TripForm) => {
    setLoading(true);
    try {
      // Kiểm tra trainId hợp lệ
      const selectedTrain = trains.find(
        (train) => (train.trainId || `fallback-${train.trainName}`) === values.trainId,
      );
      if (!selectedTrain) {
        form.setFields([
          {
            name: 'trainId',
            // errors: ['Please select a valid train from the list'],
            errors: ['Hãy chọn tàu trong danh sách'],
            value: undefined,
          },
        ]);
        setLoading(false);
        return;
      }

      // Kiểm tra tripDate không được là quá khứ hoặc hiện tại
      if (values.tripDate && values.tripDate.isSameOrBefore(moment().startOf('day'))) {
        form.setFields([
          {
            name: 'tripDate',
            errors: ['Ngày chuyến tàu phải là ngày trong tương lai'],
            value: values.tripDate,
          },
        ]);
        setLoading(false);
        return;
      }

      const payload: AddTripRequest = {
        trainId: values.trainId || '',
        basePrice: values.basePrice,
        tripDate: values.tripDate ? values.tripDate.format('YYYY-MM-DD') : '',
        numSoftSeatCarriages: values.numSoftSeatCarriages,
        numSixBerthCarriages: values.numSixBerthCarriages,
        numFourBerthCarriages: values.numFourBerthCarriages,
      };

      const response = await addTrip(payload);
      if (response.success) {
        // Trường hợp 200: Thêm thành công
        message.success('Thêm chuyến tàu thành công');
        form.resetFields(); // Reset form sau khi thêm thành công
      } else {
        // Trường hợp 409: Chuyến tàu đã tồn tại (dựa vào message hoặc logic API)
        if (response.message.toLowerCase().includes('already exists')) {
          message.error('Chuyến tàu đã tồn tại'); // Giữ nguyên form
        } else {
          // Các lỗi khác (400, 500, ...)
          message.error(response.message || 'Failed to add trip');
        }
      }
    } catch (error: any) {
      // Xử lý lỗi HTTP
      if (error.response?.status === 409) {
        message.error('Trip already exists'); // Giữ nguyên form
      } else {
        message.error(error.response?.data?.message || 'An error occurred while adding the trip');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ width: 400 }}>
        <h1 style={{ textAlign: 'center' }}>Thêm chuyến tàu</h1>

        <Form.Item
          name="trainId"
          label="Chọn tàu"
          rules={[
            { required: true, message: 'Tàu không được bỏ trống' },
            {
              validator: (_, value) =>
                value &&
                trains.some((train) => (train.trainId || `fallback-${train.trainName}`) === value)
                  ? Promise.resolve()
                  : Promise.reject('Hãy chọn tàu trong danh sách'),
            },
          ]}
        >
          <AutoComplete
            options={options}
            onSearch={handleSearch}
            onSelect={handleSelect}
            placeholder="Nhập tên tàu"
            allowClear
            onChange={(value) => {
              if (!value) {
                form.setFieldsValue({ trainId: undefined });
              }
            }}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="tripDate"
          label="Ngày khởi hành"
          rules={[{ required: true, message: 'Ngày khởi hành không được bỏ trống' }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
            placeholder="Chọn ngày khởi hành"
          />
        </Form.Item>

        <Form.Item
          name="basePrice"
          label="Đơn giá cơ bản"
          rules={[{ required: true, message: 'Đơn giá cơ bản không được bỏ trống' }]}
        >
          <InputNumber
            min={1}
            step={1000}
            style={{ width: '100%' }}
            placeholder="Nhập giá cơ bản"
          />
        </Form.Item>

        <Form.Item
          name="numSoftSeatCarriages"
          label="Toa ngồi mềm điều hòa"
          rules={[{ required: true, message: 'Số toa ngồi mềm điều hòa không được bỏ trống' }]}
        >
          <InputNumber
            min={1}
            max={10}
            step={1}
            style={{ width: '100%' }}
            placeholder="Nhập số toa ngồi mềm điều hòa"
          />
        </Form.Item>

        <Form.Item
          name="numSixBerthCarriages"
          label="Toa giường nằm 6"
          rules={[{ required: true, message: 'Số toa giường nằm 6 không được bỏ trống' }]}
        >
          <InputNumber
            min={1}
            max={10}
            step={1}
            style={{ width: '100%' }}
            placeholder="Nhập số toa giường nằm 6"
          />
        </Form.Item>

        <Form.Item
          name="numFourBerthCarriages"
          label="Toa giường nằm 4"
          rules={[{ required: true, message: 'Số toa giường nằm 4 không được bỏ trống' }]}
        >
          <InputNumber
            min={1}
            max={10}
            step={1}
            style={{ width: '100%' }}
            placeholder="Nhập số toa giường nằm 4"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Thêm chuyến tàu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTrip;

// import type { FC } from 'react';
// import { useState, useEffect } from 'react';
// import { DownOutlined } from '@ant-design/icons';
// import { Button, DatePicker, Dropdown, Form, Input, InputNumber, message, Space } from 'antd';
// import type { MenuProps } from 'antd';
// import moment from 'moment';
// import { addTrip } from '@/services/my-api/tripApi';
// import { getAllTrain } from '@/services/my-api/trainApi';
// import { TripApi } from '@/pages/trip/add-trip/data'
// interface Train {
//     id: string;
//     name: string;
//     // Thêm các thuộc tính khác của train nếu cần
// }

// interface TripForm {
//     trainId: string | null;
//     tripDate: moment.Moment | null;
//     basePrice: number;
//     numSoftSeatCarriages: number;
//     numSixBerthCarriages: number;
//     numFourBerthCarriages: number;
// }

// const AddTrip: FC = () => {
//     const [form] = Form.useForm();
//     const [trains, setTrains] = useState<TripApi.trainResponse[]>([]);
//     const [loading, setLoading] = useState(false);

//     // Lấy danh sách tàu khi component mount
//     useEffect(() => {
//         const fetchTrains = async () => {
//             try {
//                 const response = await getAllTrain();
//                 setTrains(response); // Giả sử response là mảng Train
//             } catch (error) {
//                 message.error('Failed to load trains');
//             }
//         };
//         fetchTrains();
//     }, []);

//     // Tạo items cho Dropdown từ danh sách tàu
//     const trainItems: MenuProps['items'] = trains.map((train) => ({
//         key: train.trainId || `fallback-${train.trainName}`, // Sử dụng trainName làm fallback nếu trainId undefined
//         label: `${train.trainName} - ${train.route}`,
//     }));

//     // Xử lý khi chọn tàu từ Dropdown
//     const handleTrainSelect = ({ key }: { key: string }) => {
//         form.setFieldsValue({ trainId: key });
//     };

//     // Xử lý submit form
//     const handleSubmit = async (values: TripForm) => {
//         setLoading(true);
//         try {
//             const payload: TripApi.addTripRequest = {
//                 trainId: values.trainId === null ? "" : values.trainId,  // Chuyển null thành chuỗi rỗng
//                 basePrice: values.basePrice,
//                 tripDate: values.tripDate ? values.tripDate.toISOString() : "",
//                 numSoftSeatCarriages: values.numSoftSeatCarriages,
//                 numSixBerthCarriages: values.numSixBerthCarriages,
//                 numFourBerthCarriages: values.numFourBerthCarriages,
//             };

//             const response = await addTrip(payload);
//             if (response.success) {
//                 message.success('Trip added successfully');
//                 form.resetFields(); // Reset form sau khi thêm thành công
//             } else {
//                 message.error(response.message || 'Failed to add trip');
//             }
//         } catch (error) {
//             message.error('An error occurred while adding the trip');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             height: '100vh',
//           }}
//         >
//           <Form
//             form={form}
//             onFinish={handleSubmit}
//             layout="vertical"
//             style={{ width: 400 }}
//           >
//             <h1 style={{ textAlign: 'center' }}>Add New Trip</h1>

//             <Form.Item
//               name="trainId"
//               label="Select Train"
//               rules={[{ required: true, message: 'Please select a train' }]}
//             >
//               <Dropdown
//                 menu={{ items: trainItems, onClick: handleTrainSelect }}
//                 trigger={['click']}
//               >
//                 <a onClick={(e) => e.preventDefault()}>
//                   <Space>
//                     {form.getFieldValue('trainId')
//                       ? trains.find((train) => (train.trainId || `fallback-${train.trainName}`) === form.getFieldValue('trainId'))?.trainName +
//                         ' - ' +
//                         trains.find((train) => (train.trainId || `fallback-${train.trainName}`) === form.getFieldValue('trainId'))?.route
//                       : 'Select a train'}
//                     <DownOutlined />
//                   </Space>
//                 </a>
//               </Dropdown>
//             </Form.Item>

//             <Form.Item
//               name="tripDate"
//               label="Trip Date"
//               rules={[{ required: true, message: 'Please select trip date' }]}
//             >
//               <DatePicker showTime style={{ width: '100%' }} />
//             </Form.Item>

//             <Form.Item
//               name="basePrice"
//               label="Base Price"
//               rules={[{ required: true, message: 'Please enter base price' }]}
//             >
//               <InputNumber min={0} step={1000} style={{ width: '100%' }} placeholder="Enter base price" />
//             </Form.Item>

//             <Form.Item
//               name="numSoftSeatCarriages"
//               label="Number of Soft Seat Carriages"
//               rules={[{ required: true, message: 'Please enter number of soft seat carriages' }]}
//             >
//               <InputNumber min={0} step={1} style={{ width: '100%' }} placeholder="Enter number" />
//             </Form.Item>

//             <Form.Item
//               name="numSixBerthCarriages"
//               label="Number of Six Berth Carriages"
//               rules={[{ required: true, message: 'Please enter number of six berth carriages' }]}
//             >
//               <InputNumber min={0} step={1} style={{ width: '100%' }} placeholder="Enter number" />
//             </Form.Item>

//             <Form.Item
//               name="numFourBerthCarriages"
//               label="Number of Four Berth Carriages"
//               rules={[{ required: true, message: 'Please enter number of four berth carriages' }]}
//             >
//               <InputNumber min={0} step={1} style={{ width: '100%' }} placeholder="Enter number" />
//             </Form.Item>

//             <Form.Item>
//               <Button type="primary" htmlType="submit" loading={loading} block>
//                 Add Trip
//               </Button>
//             </Form.Item>
//           </Form>
//         </div>
//       );
// };

// export default AddTrip;

// // import type { FC } from 'react';
// // import { DownOutlined, SmileOutlined } from '@ant-design/icons';
// // import type { MenuProps } from 'antd';
// // import { Dropdown, Space } from 'antd';

// // const items: MenuProps['items'] = [
// //   {
// //     key: '1',
// //     label: (
// //       <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
// //         1st menu item
// //       </a>
// //     ),
// //   },
// //   {
// //     key: '2',
// //     label: (
// //       <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
// //         2nd menu item (disabled)
// //       </a>
// //     ),
// //     icon: <SmileOutlined />,
// //     disabled: true,
// //   },
// //   {
// //     key: '3',
// //     label: (
// //       <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
// //         3rd menu item (disabled)
// //       </a>
// //     ),
// //     disabled: true,
// //   },
// //   {
// //     key: '4',
// //     danger: true,
// //     label: 'a danger item',
// //   },
// // ];

// // type AddTripProps = {};

// // const AddTrip: FC<AddTripProps> = () => {
// //   return (
// //     <div style={{
// //       display: 'flex',
// //       justifyContent: 'center',
// //       alignItems: 'center',
// //       height: '100vh', // chiếm toàn bộ chiều cao màn hình
// //     }}>
// //       <h1>hello</h1>
// //     </div>
// //   );
// // };

// // export default AddTrip;
