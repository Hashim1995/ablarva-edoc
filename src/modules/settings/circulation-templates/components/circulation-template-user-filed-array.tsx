/* eslint-disable array-callback-return */
import { useFieldArray } from 'react-hook-form';
import {
  DeleteOutlined,
  PlusOutlined,
  InfoCircleFilled
} from '@ant-design/icons';

import { Button, Col, Row, Tooltip, theme } from 'antd';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { dictionary } from '@/utils/constants/dictionary';
import {
  inputPlaceholderText,
  selectPlaceholderText
} from '@/utils/constants/texts';
import { inputValidationText } from '@/utils/constants/validations';
import { selectOption } from '@/models/common';
import { ITemplateAddForm } from '../models';

interface UserFieldArrayProps {
  control: any;
  name: any;
  errors: any;
  users: selectOption[];
  selectedUsers: any[];
}

function UserFieldArray({
  control,
  errors,
  name,
  users,
  selectedUsers
}: UserFieldArrayProps) {
  const { fields, append, remove } = useFieldArray<ITemplateAddForm>({
    control,
    name
  });

  const { useToken } = theme;
  const { token } = useToken();
  return (
    <Row align="top" justify="space-between">
      <Col span={24}>
        <Row>
          {fields.map((item, index) => (
            <Col key={item.id} span={24}>
              <Row align="bottom" justify="space-between">
                <Col span={22}>
                  <AppHandledSelect
                    label={
                      <>
                        {dictionary.en.approve} {index + 1}
                        {index === 0 && (
                          <Tooltip title={dictionary.en.successive}>
                            <InfoCircleFilled
                              style={{
                                marginInline: token.marginXS,
                                color: token.colorPrimary
                              }}
                            />
                          </Tooltip>
                        )}
                      </>
                    }
                    required
                    rules={{
                      required: {
                        value: true,
                        message: inputValidationText(dictionary.en.approve)
                      }
                    }}
                    name={`${name}.${index}.userId` as keyof ITemplateAddForm}
                    IsDynamic
                    control={control}
                    placeholder={inputPlaceholderText(dictionary.en.approve)}
                    errors={errors}
                    selectProps={{
                      allowClear: true,
                      showSearch: true,
                      mode: 'multiple',
                      id: `${name}.${index}.userId`,
                      placeholder: selectPlaceholderText(dictionary.en.approve),
                      className: 'w-full',
                      options: users?.filter(
                        z =>
                          typeof z.value === 'number' &&
                          !selectedUsers?.includes(z.value)
                      )
                    }}
                  />
                </Col>
                {index > 0 && (
                  <Col>
                    <Button
                      style={{ marginBottom: 8 }}
                      type="primary"
                      shape="circle"
                      onClick={() => remove(index)}
                      icon={<DeleteOutlined />}
                    />
                  </Col>
                )}
                {index === 0 && (
                  <Col>
                    <Button
                      type="primary"
                      shape="circle"
                      style={{ marginBottom: 8 }}
                      onClick={() => append({ userId: [] })}
                      icon={<PlusOutlined />}
                    />
                  </Col>
                )}
              </Row>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}

export default UserFieldArray;
