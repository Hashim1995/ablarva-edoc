/* eslint-disable no-lonely-if */
/* eslint-disable array-callback-return */
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

import { Button, Col, Form, Modal, RadioChangeEvent, Row, Spin } from 'antd';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { IGlobalResponse, selectOption } from '@/models/common';
import { showCloseConfirmationModal } from '@/utils/functions/functions';
import AppHandledRadio from '@/components/forms/radio/handled-radio';
import { CirculationTemplateServies } from '@/services/circulation-template-services/circulation-template-service';
import UserFieldArray from '../components/circulation-template-user-filed-array';
import {
  ICycleMemberItem,
  IGetSingleTemplateResponse,
  IGroupedCycleMemberItem,
  ITemplateAddForm
} from '../models';

interface IAddTemplateProps {
  showTemplateUpdateModal: boolean;
  setShowTemplateUpdateModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
  selectedItem: string;
  users: selectOption[];
}

function EditTemplate({
  setShowTemplateUpdateModal,
  setRefreshComponent,
  showTemplateUpdateModal,
  selectedItem,
  users
}: IAddTemplateProps) {
  const [type, setType] = useState(1);
  const {
    control,
    watch,
    handleSubmit,
    resetField,
    setValue,
    formState: { errors }
  } = useForm<ITemplateAddForm>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: 1,
      forInfos: [],
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
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [skeleton, setSkeleton] = useState<boolean>(true);

  const getTemplateItemById = async (id: string) => {
    setIsFormSubmiting(true);
    const res: IGetSingleTemplateResponse =
      await CirculationTemplateServies.getInstance().getSingleTemplate(id);

    if (res?.IsSuccess) {
      setValue('name', res?.Data?.name ?? '');
      setValue('type', res?.Data?.type ?? '');
      setValue('forInfos', res?.Data?.forInfos ?? '');
      setType(res?.Data?.type);
      const approve: ITemplateAddForm['approve'] = [];
      const sign: ITemplateAddForm['sign'] = [];
      const cycleMembers: ICycleMemberItem[] = res?.Data?.cycleMembers.sort(
        (a, b) => a.order - b.order
      );

      if (res.Data.type === 1) {
        cycleMembers.map(t => {
          if (t.memberType === 1) {
            approve.push({ userId: t.authPersonId });
          } else {
            sign.push({ userId: t.authPersonId });
          }
        });
      } else {
        const groupedCycleMembers: IGroupedCycleMemberItem[] = [];
        cycleMembers.map(t => {
          if (
            !groupedCycleMembers.some(z => z.group === t.group) ||
            t.group === null
          ) {
            groupedCycleMembers.push({
              group: t.group,
              users: [t.authPersonId],
              memberType: t.memberType
            });
          } else {
            groupedCycleMembers.map(z => {
              z.group === t.group && z.users.push(t.authPersonId);
            });
          }
        });
        groupedCycleMembers.map(y => {
          if (y.memberType === 1) {
            approve.push({ userId: y.users });
          } else {
            sign.push({ userId: y.users });
          }
        });
      }

      setValue('approve', approve);
      setValue('sign', sign);
      setSkeleton(false);
    }
    setIsFormSubmiting(false);
  };

  const onSubmit: SubmitHandler<ITemplateAddForm> = async (
    data: ITemplateAddForm
  ) => {
    setIsFormSubmiting(true);
    const cycleMembers: ICycleMemberItem[] = [];

    if (data.type === 1) {
      let order: number = 0;
      data.approve.map(t => {
        order += 1;
        t.userId !== null &&
          typeof t.userId === 'number' &&
          cycleMembers.push({
            authPersonId: t.userId,
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
            authPersonId: t.userId,
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
              authPersonId: t.userId[0],
              memberType: 1,
              order,
              group: null
            });
          } else {
            group += 1;
            t.userId.map((y: number) => {
              cycleMembers.push({
                authPersonId: y,
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
              authPersonId: t.userId[0],
              memberType: 2,
              order,
              group: null
            });
          } else {
            group += 1;
            t.userId.map((y: number) => {
              cycleMembers.push({
                authPersonId: y,
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
      forInfos: data.forInfos,
      cycleMembers
    };

    const res: IGlobalResponse =
      await CirculationTemplateServies.getInstance().updateTemplate(
        selectedItem,
        payload,
        () => setIsFormSubmiting(false)
      );

    if (res.IsSuccess) {
      toast.success(dictionary.en.successTxt);
      setShowTemplateUpdateModal(false);
      setRefreshComponent(z => !z);
    }
    setShowTemplateUpdateModal(false);
    setIsFormSubmiting(false);
  };

  const handleTypeChange = (value: number) => {
    setType(value);
    setSelectedUsers([]);
    resetField('name');
    resetField('forInfos');
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
        setShowTemplateUpdateModal(false);
      }
    });
  };

  useEffect(() => {
    const forInfos = watch('forInfos');
    if (type === 1) {
      const approve = watch('approve')?.map(t => t.userId);
      const sign = watch('sign')?.map(t => t.userId);
      setSelectedUsers([...forInfos, ...approve, ...sign]);
    } else if (type === 2) {
      const approve: number[] = [];
      watch('approve')?.map(t => {
        Array.isArray(t.userId) && t.userId?.map(f => approve?.push(f));
      });
      const sign: number[] = [];
      watch('sign')?.map(t => {
        Array.isArray(t.userId) && t.userId?.map(f => sign?.push(f));
      });
      setSelectedUsers([...forInfos, ...approve, ...sign]);
    }
  }, [
    useWatch({ control, name: 'approve' }),
    useWatch({ control, name: 'sign' }),
    watch('forInfos')
  ]);

  useEffect(() => {
    getTemplateItemById(selectedItem);
  }, []);

  return (
    <Modal
      width={700}
      destroyOnClose
      title={dictionary.en.addTemplate}
      open={showTemplateUpdateModal}
      onCancel={handleClose}
      cancelText={dictionary.en.closeBtn}
      okText={dictionary.en.save}
      footer={[
        <Button
          form="add-template-modal-form"
          type="primary"
          key="submit"
          htmlType="submit"
          disabled={isFormSubmiting}
          loading={isFormSubmiting}
        >
          {dictionary.en.save}
        </Button>
      ]}
    >
      <div>
        {!skeleton ? (
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
                  label={dictionary.en.circulationType}
                  name="type"
                  radioProps={{
                    id: 'type'
                  }}
                  rules={{
                    required: {
                      value: true,
                      message: inputValidationText(
                        dictionary.en.circulationType
                      )
                    }
                  }}
                  onChangeApp={(event: RadioChangeEvent) =>
                    handleTypeChange(event.target.value)
                  }
                  required
                  control={control}
                  errors={errors}
                >
                  <AppHandledRadio
                    name="successive"
                    val={1}
                    label={dictionary.en.successive}
                  />
                  <AppHandledRadio
                    name="parallel"
                    val={2}
                    label={dictionary.en.parallel}
                  />
                </AppHandledRadio>
                <AppHandledInput
                  label={dictionary.en.templateName}
                  name="name"
                  inputProps={{
                    id: 'name'
                  }}
                  rules={{
                    required: {
                      value: true,
                      message: inputValidationText(dictionary.en.templateName)
                    },
                    minLength: {
                      value: 3,
                      message: minLengthCheck(dictionary.en.templateName, '3')
                    },
                    maxLength: {
                      value: 20,
                      message: maxLengthCheck(dictionary.en.templateName, '20')
                    }
                  }}
                  required
                  control={control}
                  inputType="text"
                  placeholder={inputPlaceholderText(dictionary.en.templateName)}
                  errors={errors}
                />
                <AppHandledSelect
                  label={dictionary.en.information}
                  name="forInfos"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: inputValidationText(dictionary.en.information)
                    }
                  }}
                  required
                  placeholder={inputPlaceholderText(dictionary.en.information)}
                  errors={errors}
                  selectProps={{
                    mode: 'multiple',
                    showSearch: true,
                    id: 'forInfos',
                    placeholder: selectPlaceholderText(
                      dictionary.en.information
                    ),
                    className: 'w-full',
                    options: users?.filter(
                      z =>
                        typeof z.value === 'number' &&
                        !selectedUsers?.includes(z.value)
                    )
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
                      users={users}
                      name="approve"
                      selectedUsers={selectedUsers}
                    />
                    <UserFieldArray
                      errors={errors}
                      control={control}
                      users={users}
                      selectedUsers={selectedUsers}
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
                      selectedUsers={selectedUsers}
                      users={users}
                      name="approve"
                    />
                    <UserFieldArray
                      multiple
                      errors={errors}
                      control={control}
                      selectedUsers={selectedUsers}
                      users={users}
                      name="sign"
                    />
                  </>
                )}
              </Col>
            </Row>
          </Form>
        ) : (
          <Row className="w-full" justify="center" align="middle">
            <Spin size="large" />
          </Row>
        )}
      </div>
    </Modal>
  );
}

export default EditTemplate;
