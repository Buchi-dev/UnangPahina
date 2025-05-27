import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Form, Input, Button, Typography, App } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { getProfile } from '../store/slices/authSlice';

const { Title } = Typography;

const Profile = () => {
    const dispatch = useDispatch();
    const { message } = App.useApp();
    const { user, loading, error } = useSelector((state) => state.auth);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            });
        }
    }, [user, form]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error, message]);

    const onFinish = (values) => {
        // TODO: Implement update profile functionality
        console.log('Update profile:', values);
    };

    return (
        <Card style={{ maxWidth: 600, margin: '0 auto' }}>
            <Title level={2}>My Profile</Title>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'Please input your first name!' }]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="First Name"
                    />
                </Form.Item>

                <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please input your last name!' }]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Last Name"
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="Email"
                        disabled
                    />
                </Form.Item>

                <Form.Item
                    name="currentPassword"
                    label="Current Password"
                    rules={[{ required: true, message: 'Please input your current password!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Current Password"
                    />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                        { min: 6, message: 'Password must be at least 6 characters!' }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="New Password (Optional)"
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirm New Password"
                    dependencies={['newPassword']}
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Confirm New Password"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                    >
                        Update Profile
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default Profile; 