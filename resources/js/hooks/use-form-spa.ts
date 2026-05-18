import { useState } from 'react';
import axios from 'axios';

export function useFormSpa<T extends Record<string, any>>(initialData: T) {
    const [data, setData] = useState<T>(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const submit = async (method: 'post' | 'patch' | 'put' | 'delete', url: string, options: any = {}) => {
        setProcessing(true);
        setErrors({});
        setRecentlySuccessful(false);
        try {
            const response = await axios({
                method,
                url,
                data: method === 'delete' ? undefined : data,
                ...options,
            });
            setRecentlySuccessful(true);
            setTimeout(() => setRecentlySuccessful(false), 2000);
            if (options.onSuccess) options.onSuccess(response);
            return response;
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const formattedErrors: Record<string, string> = {};
                Object.keys(error.response.data.errors).forEach((key) => {
                    formattedErrors[key] = error.response.data.errors[key][0];
                });
                setErrors(formattedErrors);
            }
            if (options.onError) options.onError(error);
        } finally {
            setProcessing(false);
            if (options.onFinish) options.onFinish();
        }
    };

    const post = (url: string, options: any = {}) => submit('post', url, options);
    const patch = (url: string, options: any = {}) => submit('patch', url, options);
    const put = (url: string, options: any = {}) => submit('put', url, options);
    const deleteMethod = (url: string, options: any = {}) => submit('delete', url, options);

    const reset = (...keys: (keyof T)[]) => {
        if (keys.length === 0) {
            setData(initialData);
        } else {
            const newData = { ...data };
            keys.forEach((key) => {
                newData[key] = initialData[key];
            });
            setData(newData);
        }
    };

    const setFieldValue = (keyOrObject: keyof T | Partial<T> | ((prev: T) => T), value?: any) => {
        if (typeof keyOrObject === 'function') {
            setData(keyOrObject as (prev: T) => T);
        } else if (typeof keyOrObject === 'object' && keyOrObject !== null) {
            setData((prev) => ({ ...prev, ...keyOrObject }));
        } else {
            setData((prev) => ({ ...prev, [keyOrObject as keyof T]: value }));
        }
    };

    return {
        data,
        setData: setFieldValue,
        post,
        patch,
        put,
        delete: deleteMethod,
        processing,
        errors,
        recentlySuccessful,
        reset,
    };
}
