import React, { useState } from 'react';
import { history, useModel } from '@umijs/max';
import { Form, Input, Button, Card, message, Space, Alert } from 'antd';
import { sendOtp, changePassword, outLogin } from '@/services/my-api/api';
import { stringify } from 'querystring';

const ChangePasswordForm: React.FC = () => {
  const [form] = Form.useForm();
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [changePasswordState, setChangePasswordState] = useState<API.ChangePasswordResult>({});
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const handleSendOtp = async () => {
    const email = currentUser?.email;
    if (!email) {
      message.warning('Email not found.');
      return;
    }

    try {
      setOtpLoading(true);
      const msg = await sendOtp({ email });

      if (msg.status === 'OK') {
        message.success('OTP sent successfully!');
        console.log('Sending OTP to:', email);

        setOtpCooldown(30);
        const interval = setInterval(() => {
          setOtpCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        message.error('Failed to send OTP.');
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to send OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (values: API.ChangePasswordParams & { confirmPassword?: string }) => {
    const { confirmPassword, ...apiPayload } = values;

    if (values.newPassword !== confirmPassword) {
      message.error('New password and confirm password do not match.');
      return;
    }

    try {
      const msg = await changePassword({ ...apiPayload, email: currentUser?.email });

      if (msg.status === 'OK') {
        message.success('Password changed successfully!');
        setChangePasswordState(msg);

        // Async logout and redirect
        const logoutAndRedirect = async () => {
          await outLogin();
          const { search, pathname } = window.location;
          const urlParams = new URL(window.location.href).searchParams;
          const redirect = urlParams.get('redirect');

          if (pathname !== '/user/login' && !redirect) {
            history.replace({
              pathname: '/user/login',
              search: stringify({
                redirect: pathname + search,
              }),
            });
          }
        };

        setTimeout(() => {
          logoutAndRedirect();
        }, 1500);
      } else {
        message.error(msg.status || 'Change Password failed!');
        setChangePasswordState(msg);
      }
    } catch (error) {
      console.error(error);
      message.error('Change Password failed!');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
      <Card
        title="Change Password"
        style={{ width: 400, backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}
      >
        {changePasswordState.status === 'ERROR' && (
          <Alert
            type="error"
            showIcon
            message="Failed to change password."
            style={{ marginBottom: 16 }}
          />
        )}

        {changePasswordState.status === 'OK' && (
          <Alert
            type="success"
            showIcon
            message="Password changed successfully!"
            style={{ marginBottom: 16 }}
          />
        )}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: 'Please enter your new password' }]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>

          <Form.Item label="OTP" required style={{ marginBottom: 24 }}>
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item
                name="otp"
                noStyle
                rules={[{ required: true, message: 'Please enter OTP' }]}
              >
                <Input placeholder="Enter OTP" />
              </Form.Item>
              <Button onClick={handleSendOtp} disabled={otpCooldown > 0} loading={otpLoading}>
                {otpCooldown > 0 ? `Send (${otpCooldown}s)` : 'Send OTP'}
              </Button>
            </Space.Compact>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePasswordForm;
