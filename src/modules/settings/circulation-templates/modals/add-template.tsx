/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import AppHandledInput from '@/components/forms/input/handled-input';
import AppHandledSelect from '@/components/forms/select/handled-select';

import {
  inputValidationText,
  minLengthCheck,
  maxLengthCheck
} from '@/utils/constants/validations';
import { dictionary } from '@/utils/constants/dictionary';
import {
  inputPlaceholderText,
  selectPlaceholderText
} from '@/utils/constants/texts';

import { Button, Col, Form, Modal, RadioChangeEvent, Row } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { IGlobalResponse } from '@/models/common';
import { showCloseConfirmationModal } from '@/utils/functions/functions';
import { circulationTypeOptions } from '@/utils/constants/options';
import AppHandledRadio from '@/components/forms/radio/handled-radio';

import UserFieldArray from '../components/circulation-template-user-filed-array';

interface IAddTemplateProps {
  showAddTemplateModal: boolean;
  setShowTemplateAddModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}

export interface cycleMemberItem {
  userId: number;
  memberType: number;
  order: number;
  group: number | null;
}

export interface TemplateAddModalFormData {
  name: string;
  type: number;
  cycleCompilers: number[];
  cycleMembers: cycleMemberItem[];
  approve: {
    userId: number | number[] | null;
  }[];
  sign: {
    userId: number | number[] | null;
  }[];
}

function AddTemplate({
  setShowTemplateAddModal,
  setRefreshComponent,
  showAddTemplateModal
}: IAddTemplateProps) {
  const [type, setType] = useState(1);
  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors }
  } = useForm<TemplateAddModalFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: 1,

      cycleCompilers: [],
      approve: [
        {
          userId: null
        }
      ],
      sign: [
        {
          userId: null
        }
      ]
    }
  });

  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const onSubmit: SubmitHandler<TemplateAddModalFormData> = async (
    data: TemplateAddModalFormData
  ) => {
    // setIsFormSubmiting(true);
    const cycleMembers: cycleMemberItem[] = [];

    if (data.type === 1) {
      let order: number = 0;
      data.approve.map(t => {
        order += 1;
        t.userId !== null &&
          typeof t.userId === 'number' &&
          cycleMembers.push({
            userId: t.userId,
            memberType: 1,
            order,
            group: null
          });
      });
      data.sign.map(t => {
        order += 1;
        t.userId !== null &&
          typeof t.userId === 'number' &&
          cycleMembers.push({
            userId: t.userId,
            memberType: 2,
            order,
            group: null
          });
      });
    } else {
      let group: number = 0;
      let order: number = 0;
      data.approve.map(t => {
        if (t.userId !== null && Array.isArray(t.userId)) {
          order += 1;
          if (t.userId.length === 1) {
            cycleMembers.push({
              userId: t.userId[0],
              memberType: 1,
              order,
              group: null
            });
          } else {
            group += 1;
            t.userId.map((y: number) => {
              cycleMembers.push({
                userId: y,
                memberType: 1,
                order,
                group
              });
            });
          }
        }
      });

      data.sign.map(t => {
        if (t.userId !== null && Array.isArray(t.userId)) {
          order += 1;
          if (t.userId.length === 1) {
            cycleMembers.push({
              userId: t.userId[0],
              memberType: 2,
              order,
              group: null
            });
          } else {
            group += 1;
            t.userId.map((y: number) => {
              cycleMembers.push({
                userId: y,
                memberType: 2,
                order,
                group
              });
            });
          }
        }
      });
    }

    const payload = {
      name: data.name,
      type: data.type,
      cycleCompilers: data.cycleCompilers,
      cycleMembers
    };
    console.log(payload);

    // const res: IGlobalResponse = await StaffServies.getInstance().addStaff(
    //   payload,
    //   () => setIsFormSubmiting(false)
    // );

    // if (res.IsSuccess) {
    //   toast.success(dictionary.az.successTxt);
    //   setShowTemplateAddModal(false);
    //   setRefreshComponent(z => !z);
    // }
    // setShowTemplateAddModal(false);
    // setIsFormSubmiting(false);
  };

  const handleTypeChange = (value: number) => {
    setType(value);
    resetField('name');
    resetField('cycleCompilers');
    if (value === 1) {
      resetField('approve', { defaultValue: [{ userId: null }] });
      resetField('sign', { defaultValue: [{ userId: null }] });
    } else {
      resetField('approve', { defaultValue: [{ userId: [] }] });
      resetField('sign', { defaultValue: [{ userId: [] }] });
    }
  };

  const handleClose = () => {
    showCloseConfirmationModal({
      onClose: () => {
        setShowTemplateAddModal(false);
      }
    });
  };

  return (
    <Modal
      width={700}
      destroyOnClose
      title={dictionary.az.addTemplate}
      open={showAddTemplateModal}
      onCancel={handleClose}
      cancelText={dictionary.az.closeBtn}
      okText={dictionary.az.save}
      footer={[
        <Button
          form="add-template-modal-form"
          type="primary"
          key="submit"
          htmlType="submit"
          disabled={isFormSubmiting}
          loading={isFormSubmiting}
        >
          {dictionary.az.save}
        </Button>
      ]}
    >
      <div>
        <Form
          onFinish={handleSubmit(onSubmit)}
          id="add-template-modal-form"
          layout="vertical"
        >
          <Row>
            <Col span={24}>
              <AppHandledRadio
                radioGroupProps={{ defaultValue: 1 }}
                isGroup
                label={dictionary.az.circulationType}
                name="type"
                radioProps={{
                  id: 'type'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(dictionary.az.circulationType)
                  }
                }}
                onChangeApp={(event: RadioChangeEvent) =>
                  handleTypeChange(event.target.value)
                }
                required
                control={control}
                errors={errors}
              >
                <AppHandledRadio name="successive" val={1} label="Ardıcıl" />
                <AppHandledRadio name="parallel" val={2} label="Paralel" />
              </AppHandledRadio>
              <AppHandledInput
                label={dictionary.az.templateName}
                name="name"
                inputProps={{
                  id: 'name'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(dictionary.az.templateName)
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck(dictionary.az.templateName, '3')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(dictionary.az.templateName)}
                errors={errors}
              />
              <AppHandledSelect
                label={dictionary.az.information}
                name="cycleCompilers"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(dictionary.az.information)
                  }
                }}
                required
                placeholder={inputPlaceholderText(dictionary.az.information)}
                errors={errors}
                selectProps={{
                  mode: 'multiple',
                  showSearch: true,
                  id: 'cycleCompilers',
                  placeholder: selectPlaceholderText(dictionary.az.information),
                  className: 'w-full',
                  options: circulationTypeOptions
                }}
                formItemProps={{
                  labelAlign: 'left',
                  labelCol: { span: 8, sm: 12, md: 10, lg: 8 },
                  style: { fontWeight: 'bolder' }
                }}
              />
              {type === 1 && (
                <>
                  <UserFieldArray
                    errors={errors}
                    control={control}
                    name="approve"
                  />
                  <UserFieldArray
                    errors={errors}
                    control={control}
                    name="sign"
                  />
                </>
              )}

              {type === 2 && (
                <>
                  <UserFieldArray
                    multiple
                    errors={errors}
                    control={control}
                    name="approve"
                  />
                  <UserFieldArray
                    multiple
                    errors={errors}
                    control={control}
                    name="sign"
                  />
                </>
              )}
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
}

export default AddTemplate;
