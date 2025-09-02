import React from "react";
import { message } from "antd";
export default function homeFormErrorHandler(error, form) {

    //这代表验证时的error
    if (error.errorFields) {
        // 验证失败，Ant Design 会自动显示错误
        console.log('验证失败:', error);
    } else {
        // API 错误处理
        console.error('Create cash item error:', error);
        // 🔑 组合处理
        const errorHandler = {
            400: () => message.error('请检查输入信息'),
            401: () => {
                console.log(error)
                message.error(error.response.data.message);
                // setTimeout(() => navigate('/login'), 1500);
            },
            409: () => {
                // message.error('项目名称已存在，请使用不同名称');
                form.setFields([{
                    name: 'itemName',
                    errors: ['该项目已建立']
                }]);
            },
            500: () => message.error('服务器错误，请稍后重试'),
            network: () => message.error('网络连接失败，请检查网络'),
            default: () => message.error('操作失败，请重试')
        };

        if (error.response) {
            const handler = errorHandler[error.response.status] || errorHandler.default;
            handler();
        } else if (error.request) {
            errorHandler.network();
        } else {
            errorHandler.default();
        }

    }
}