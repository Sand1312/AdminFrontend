import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Alert, TableProps, Table } from 'antd';
import { create } from '@/services/my-api/api';
import { flushSync } from 'react-dom';
import { getAllUsers } from '@/pages/account/service';
import { useRequest } from '@umijs/max';

const columns: TableProps<API.User>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'userId',
    key: 'userId',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Name',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Password',
    dataIndex: 'password',
    key: 'password',
    render: () => '••••••••',
  },
];

const Create: React.FC = () => {
  const [form] = Form.useForm();
  const [userCreateState, setUserCreateState] = useState<API.UserCreateResult>({});
  const handleSubmit = async (values: API.UserCreateParams) => {
    try {
      const msg = await create({ ...values, password: '123' });
      if (msg.status === 'OK') {
        message.success('Create User success!');
      }
      console.log(msg);
      setUserCreateState(msg);
    } catch (error) {
      console.log(error);
      message.error('Create User failed!');
    }
  };

  const { data, loading } = useRequest(getAllUsers);

  const { status } = userCreateState;
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <Card title="Create Account" style={{ width: 400, backgroundColor: 'transparent' }}>
          {status === 'ERROR' && (
            <Alert type="error" showIcon style={{ marginBottom: 16 }} message="Failed!" />
          )}

          {status === 'OK' && (
            <Alert
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
              message="User created successfully!"
            />
          )}
          <Form
            form={form}
            onFinish={async (values) => {
              await handleSubmit(values as API.UserCreateParams);
            }}
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Name"
              name="userName"
              rules={[{ required: true, message: 'Please enter username' }]}
            >
              <Input placeholder="Enter your user name" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Create
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <Table<API.User> columns={columns} dataSource={data} loading={loading} />
    </>
  );
};

export default Create;
