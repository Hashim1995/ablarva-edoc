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

import { Button, Col, Form, Modal, Row } from 'antd';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { IGlobalResponse, selectOption } from '@/models/common';
import { showCloseConfirmationModal } from '@/utils/functions/functions';

import { CirculationTemplateServies } from '@/services/circulation-template-services/circulation-template-service';
import UserFieldArray from '../components/circulation-template-user-filed-array';
import { ICycleMemberItem, ITemplateAddForm } from '../models';

interface IAddTemplateProps {
  showAddTemplateModal: boolean;
  setShowTemplateAddModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
  users: selectOption[];
}

function AddTemplate({
  setShowTemplateAddModal,
  setRefreshComponent,
  showAddTemplateModal,
  users
}: IAddTemplateProps) {
  const {
    control,
    watch,
    handleSubmit,
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
  const onSubmit: SubmitHandler<ITemplateAddForm> = async (
    data: ITemplateAddForm
  ) => {
    setIsFormSubmiting(true);
    const cycleMembers: ICycleMemberItem[] = [];

    let group: number = 0;
    let order: number = 0;
    data.approve.map(t => {
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
    });

    const payload = {
      name: data.name,
      forInfos: data.forInfos,
      forSigns: data.forSigns,
      cycleMembers
    };

    const res: IGlobalResponse =
      await CirculationTemplateServies.getInstance().addTemplate(payload, () =>
        setIsFormSubmiting(false)
      );

    if (res.IsSuccess) {
      toast.success(dictionary.en.successTxt);
      setShowTemplateAddModal(false);
      setRefreshComponent(z => !z);
    }
    setShowTemplateAddModal(false);
    setIsFormSubmiting(false);
  };

  const handleClose = () => {
    showCloseConfirmationModal({
      onClose: () => {
        setShowTemplateAddModal(false);
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

  return (
    <Modal
      width={700}
      destroyOnClose
      title={dictionary.en.addTemplate}
      open={showAddTemplateModal}
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
                  placeholder: selectPlaceholderText(dictionary.en.information),
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
      </div>
    </Modal>
  );
}

export default AddTemplate;
