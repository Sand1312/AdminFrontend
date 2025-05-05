import React, { FC, useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, AutoComplete, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import 'antd/dist/reset.css';
import { getAllRoute } from '@/services/my-api/routeApi';
import { getAllTrain, addTrain, updateTrain, addTrainAxios } from '@/services/my-api/trainApi';

interface Train {
  trainId: string;
  trainName: string;
  route: string;
}

interface RouteResponse {
  routeId: string;
  routeName: string;
}

interface FormValues {
  trainName: string;
  route: string;
}

const QuanLyChuyenTau: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Train | null>(null);
  const [form] = Form.useForm();
  const [routes, setRoutes] = useState<RouteResponse[]>([]);
  const [dataSource, setDataSource] = useState<Train[]>([]);

  // Lấy danh sách train từ API
  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await getAllTrain();
        setDataSource(response);
      } catch (error) {
        message.error('Không thể tải danh sách tàu');
      }
    };
    fetchTrains();
  }, []);

  // Lấy danh sách route từ API
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await getAllRoute();
        setRoutes(response);
      } catch (error) {
        message.error('Không thể tải danh sách tuyến');
      }
    };
    fetchRoutes();
  }, []);

  // Làm mới danh sách tàu sau khi thao tác
  const refreshTrains = async () => {
    try {
      const response = await getAllTrain();
      setDataSource(response);
    } catch (error) {
      message.error('Không thể làm mới danh sách tàu');
    }
  };

  const validateRoute = async (_: any, value: string) => {
    if (!value || routes.some((route) => route.routeName === value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Vui lòng chọn tuyến hợp lệ từ danh sách!'));
  };

  const columns: ColumnsType<Train> = [
    {
      title: 'Tên Tàu',
      dataIndex: 'trainName',
      key: 'trainName',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Tuyến',
      dataIndex: 'route',
      key: 'route',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Train) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Chỉnh sửa</a>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setIsEditMode(false);
    setSelectedRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: Train) => {
    setIsEditMode(true);
    setSelectedRecord(record);
    form.setFieldsValue({ trainName: record.trainName, route: record.route });
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values: FormValues = await form.validateFields();
      if (isEditMode && selectedRecord) {
        // Cập nhật tàu
        const updateData = {
          trainId: selectedRecord.trainId,
          trainName: values.trainName,
          route: values.route,
        };
        // const response = await updateTrain(updateData);
        // if (response.success) {
        //   message.success('Cập nhật tàu thành công');
        //   await refreshTrains();
        // } else {
        //   message.error(response.message || 'Cập nhật tàu thất bại');
        // }
        try {
            const response = await updateTrain(updateData);
            const data = response.data;
          
            if (data.success) {
              message.success('Cập nhật tàu thành công');
              await refreshTrains();
            } else {
              message.error(data.message || 'Cập nhật tàu thất bại');
            }
          } catch (error: any) {
            if (error.response?.status === 409) {
              message.error('Tên tàu đã tồn tại');
            } else if (error.response?.status === 400) {
              message.error(error.response.data?.message || 'Dữ liệu không hợp lệ');
            } else {
              message.error('Cập nhật tàu thất bại');
            }
          }
      } else {
        const addData = {
            trainName: values.trainName,
            route: values.route,
          };
          try {
            const response = await addTrainAxios(addData); // gọi hàm API đã sửa
            const data = response.data;
          
            if (data.success) {
              message.success('Thêm tàu thành công');
              await refreshTrains();
            } else {
              message.error(data.message || 'Thêm tàu thất bại');
            }
          } catch (error: any) {
            if (error.response?.status === 409) {
              message.error('Tàu đã tồn tại');
            } else if (error.response?.status === 400) {
              message.error(error.response.data?.message || 'Dữ liệu không hợp lệ');
            } else {
              message.error('Thêm tàu thất bại');
            }
          }
        //   try {
        //     const response = await addTrain(addData);
        //     if (response.success) {
        //       message.success('Thêm tàu thành công');
        //       await refreshTrains();
        //     } else {
        //       message.error(response.message || 'Thêm tàu thất bại');
        //     }
        //   } catch (error: any) {
        //     if (error.status === 409) {
        //       message.error('Tàu đã tồn tại');
        //     } else {
        //       message.error('Thêm tàu thất bại');
        //     }
        //   }
        }
        setIsModalOpen(false);
        form.resetFields();
      } catch (error) {
        message.error('Vui lòng kiểm tra lại dữ liệu nhập');
      }
        // Thêm tàu mới
    //     const addData = {
    //       trainName: values.trainName,
    //       route: values.route,
    //     };
    //     // const response = await addTrain(addData);
    //     // if (response.success) {
    //     //   message.success('Thêm tàu thành công');
    //     //   await refreshTrains();
    //     // } else {
    //     //   message.error(response.message || 'Thêm tàu thất bại');
    //     // }
    //     try {
    //       const response = await addTrain(addData);
    //       if (response.success) {
    //         message.success('Thêm tàu thành công');
    //         await refreshTrains();
    //       } else {
    //         message.error(response.message || 'Thêm tàu thất bại');
    //       }
    //     } catch (error: any) {
    //       if (error.status === 409) {
    //         message.error('Tàu đã tồn tại');
    //       } else {
    //         message.error('Thêm tàu thất bại');
    //       }
    //   }
    //   setIsModalOpen(false);
    //   form.resetFields();
    // } catch (error) {
    //   message.error('Vui lòng kiểm tra lại dữ liệu nhập');
    // }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <Button
          type="primary"
          onClick={handleAdd}
          style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
        >
          Thêm
        </Button>
      </div>
      <Table columns={columns} dataSource={dataSource} rowKey="trainId" />

      <Modal
        title={isEditMode ? 'Chỉnh sửa Chuyến Tàu' : 'Thêm Chuyến Tàu'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isEditMode ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="trainName"
            label="Tên Tàu"
            rules={[{ required: true, message: 'Vui lòng nhập tên tàu!' }]}
          >
            <Input placeholder="Nhập tên tàu" />
          </Form.Item>
          <Form.Item
            name="route"
            label="Tuyến"
            rules={[
              { required: true, message: 'Vui lòng chọn tuyến!' },
              { validator: validateRoute },
            ]}
          >
            <AutoComplete
              options={routes.map((route) => ({
                value: route.routeName,
                label: `${route.routeName} (${route.routeId})`,
              }))}
              placeholder="Chọn tuyến"
              filterOption={(inputValue, option) =>
                (option?.value ?? '').toLowerCase().includes(inputValue.toLowerCase())
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyChuyenTau;







