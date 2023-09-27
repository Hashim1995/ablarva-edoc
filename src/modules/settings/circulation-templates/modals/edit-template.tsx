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

import { Button, Col, Form, Modal, Row, Spin } from 'antd';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { IGlobalResponse, selectOption } from '@/models/common';
import { showCloseConfirmationModal } from '@/utils/functions/functions';
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
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ITemplateAddForm>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      forInfos: [],
      approve: [
        {
          userId: []
        }
      ],
      forSigns: []
    }
  });

  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [skeleton, setSkeleton] = useState<boolean>(true);

  const getTemplateItemById = async (id: string) => {
    setIsFormSubmiting(true);
    const res: IGetSingleTemplateResponse =
      await CirculationTemplateServies.getInstance().getSingleTemplate(id);

    if (res?.IsSuccess) {
      setValue('name', res?.Data?.name ?? '');
      setValue('forInfos', res?.Data?.forInfos ?? '');
      setValue('forSigns', res?.Data?.forSigns ?? '');
      const approve: ITemplateAddForm['approve'] = [];
      const cycleMembers: ICycleMemberItem[] = res?.Data?.cycleMembers.sort(
        (a, b) => a.order - b.order
      );

      const groupedCycleMembers: IGroupedCycleMemberItem[] = [];
      cycleMembers.map(t => {
        if (
          !groupedCycleMembers.some(z => z.group === t.group) ||
          t.group === null
        ) {
          groupedCycleMembers.push({
            group: t.group,
            users: [t.authPersonId]
          });
        } else {
          groupedCycleMembers.map(z => {
            z.group === t.group && z.users.push(t.authPersonId);
          });
        }
      });
      groupedCycleMembers.map(y => {
        approve.push({ userId: y.users });
      });

      setValue('approve', approve);
      setSkeleton(false);
    }
    setIsFormSubmiting(false);
  };

  const onSubmit: SubmitHandler<ITemplateAddForm> = async (
    data: ITemplateAddForm
  ) => {
    setIsFormSubmiting(true);
    const cycleMembers: ICycleMemberItem[] = [];

    let group: number = 0;
    let order: number = 0;
    data.approve.map(t => {
      if (t.userId !== null && Array.isArray(t.userId)) {
        order += 1;
        if (t.userId.length === 1) {
          cycleMembers.push({
            authPersonId: t.userId[0],
            order,
            group: null
          });
        } else {
          group += 1;
          t.userId.map((y: number) => {
            cycleMembers.push({
              authPersonId: y,
              order,
              group
            });
          });
        }
      }
    });

    const payload = {
      name: data.name,
      forInfos: data.forInfos,
      forSigns: data.forSigns,
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

  const handleClose = () => {
    showCloseConfirmationModal({
      onClose: () => {
        setShowTemplateUpdateModal(false);
      }
    });
  };

  useEffect(() => {
    const forInfos = watch('forInfos');
    const forSigns = watch('forSigns');
    const approve = watch('approve')
      .map(t => t.userId)
      .flat();

    setSelectedUsers([...forInfos, ...approve, ...forSigns]);
  }, [
    useWatch({ control, name: 'approve' }),
    watch('forSigns'),
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

                <UserFieldArray
                  errors={errors}
                  control={control}
                  selectedUsers={selectedUsers}
                  users={users}
                  name="approve"
                />
                <AppHandledSelect
                  label={dictionary.en.sign}
                  name="forSigns"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: inputValidationText(dictionary.en.sign)
                    }
                  }}
                  required
                  placeholder={inputPlaceholderText(dictionary.en.sign)}
                  errors={errors}
                  selectProps={{
                    mode: 'multiple',
                    showSearch: true,
                    id: 'forSigns',
                    placeholder: selectPlaceholderText(dictionary.en.sign),
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
