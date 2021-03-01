import React from "react";
import { useHistory } from "react-router-dom";
import { Card, Button, Form } from "antd";
import pluralize from "pluralize";
import { SaveOutlined } from "@ant-design/icons";

import { useCreate, useTranslate } from "@hooks";
import { BaseRecord } from "@interfaces";

export interface CreateProps {
    resourceName: string;
    canEdit?: boolean;
    title?: string;
}

export const Create: React.FC<CreateProps> = ({
    resourceName,
    canEdit,
    title,
    children,
}) => {
    const history = useHistory();
    const [form] = Form.useForm();

    const { mutate, isLoading } = useCreate(resourceName);

    const translate = useTranslate();

    const onFinish = async (values: BaseRecord): Promise<void> => {
        mutate(
            { values },
            {
                onSuccess: (data) => {
                    if (canEdit) {
                        return history.push(
                            `/resources/${resourceName}/edit/${data.data.id}`,
                        );
                    }

                    return history.push(`/resources/${resourceName}`);
                },
            },
        );
    };

    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                resourceName,
                onFinish,
                form,
            });
        }
        return child;
    });

    return (
        <Card
            title={title ?? `Create ${pluralize.singular(resourceName)}`}
            extra={
                <Button
                    htmlType="submit"
                    disabled={isLoading}
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={(): void => form.submit()}
                >
                    {translate("common:buttons.save", "Save")}
                </Button>
            }
        >
            {childrenWithProps}
        </Card>
    );
};
