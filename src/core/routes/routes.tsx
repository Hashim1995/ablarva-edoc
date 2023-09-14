import FallbackSpinner from '@/components/display/FallbackSpinner';
import UpdateAdditionPage from '@/modules/edc/pages/update-addition-page';
import { ViewAdditionPage } from '@/modules/edc/pages/view-addition-page';
import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';

const LoginPage = React.lazy(() => import('@core/static-pages/login-page'));
const HomePage = React.lazy(() => import('@/modules/home/pages/index'));
const CreateContractPage = React.lazy(
  () => import('@/modules/edc/pages/create-contract-page')
);
const LayoutPage = React.lazy(() => import('@core/layout/layout'));
const StaffPage = React.lazy(() => import('@/modules/settings/staff/pages'));
const EdcListPage = React.lazy(() => import('@/modules/edc/pages'));
const ReportsPage = React.lazy(() => import('@/modules/reports/pages'));
const ReportsByStatusPage = React.lazy(
  () => import('@/modules/reports/pages/reports-by-status-page')
);
const GeneralCountsPage = React.lazy(
  () => import('@/modules/reports/pages/general-counts-page')
);
const DocumentTypesPage = React.lazy(
  () => import('@/modules/reports/pages/document-types-page')
);
const UpdateContractPage = React.lazy(
  () => import('@/modules/edc/pages/update-contract-page')
);
const ViewContractPage = React.lazy(
  () => import('@/modules/edc/pages/view-contract-page')
);
const CreateAdditionPage = React.lazy(
  () => import('@/modules/edc/pages/create-addition-page')
);
const NotificationsListPage = React.lazy(
  () => import('@/modules/notifications/pages')
);
const LegalEnitiesPage = React.lazy(
  () => import('@core/static-pages/legal-entities-page')
);
const CreateActPage = React.lazy(
  () => import('@/modules/edc/pages/create-act-page')
);
const ViewActPage = React.lazy(
  () => import('@/modules/edc/pages/view-act-page')
);
const UpdateActPage = React.lazy(
  () => import('@/modules/edc/pages/update-act-page')
);
const CreateInvoicePage = React.lazy(
  () => import('@/modules/edc/pages/create-invoice-page')
);
const ViewInvoicePage = React.lazy(
  () => import('@/modules/edc/pages/view-invoice-page')
);
const UpdateInvoicePage = React.lazy(
  () => import('@/modules/edc/pages/update-invoice-page')
);
const LegalCabinet = React.lazy(() => import('@/modules/legal-cabinet/pages'));

const PersonalCabinet = React.lazy(
  () => import('@/modules/personal-cabinet/components/personal-cabinet')
);

const routes = [
  {
    path: '/',
    element: <LayoutPage />,
    children: [
      { path: '', element: <Navigate to="/home" /> },
      {
        path: '/home',
        index: true,
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <HomePage />{' '}
          </Suspense>
        )
      },
      {
        path: '/legal-cabinet',
        index: true,
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <LegalCabinet />
          </Suspense>
        )
      },
      {
        path: '/personal-cabinet',
        index: true,
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <PersonalCabinet />
          </Suspense>
        )
      },
      {
        path: '/document-circulaion',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            {' '}
            <h1>Document circulation</h1>
          </Suspense>
        )
      },
      {
        path: '/edc',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <EdcListPage />
          </Suspense>
        )
      },
      {
        path: '/edc/create-contract',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <CreateContractPage />
          </Suspense>
        )
      },
      {
        path: '/edc/create-addition',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <CreateAdditionPage />
          </Suspense>
        )
      },
      {
        path: '/edc/create-act',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <CreateActPage />
          </Suspense>
        )
      },
      {
        path: '/edc/create-invoice',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <CreateInvoicePage />
          </Suspense>
        )
      },
      {
        path: '/reports',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <ReportsPage />
          </Suspense>
        )
      },
      {
        path: '/reports/general-counts',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <GeneralCountsPage />
          </Suspense>
        )
      },
      {
        path: '/reports/document-types',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <DocumentTypesPage />
          </Suspense>
        )
      },
      {
        path: '/reports/reports-by-status',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <ReportsByStatusPage />
          </Suspense>
        )
      },
      {
        path: '/edc/update-contract/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <UpdateContractPage />
          </Suspense>
        )
      },
      {
        path: '/edc/update-contract/draft/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <UpdateContractPage />
          </Suspense>
        )
      },
      {
        path: '/edc/update-addition/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <UpdateAdditionPage />
          </Suspense>
        )
      },

      {
        path: '/edc/update-addition/draft/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <UpdateAdditionPage />
          </Suspense>
        )
      },

      {
        path: '/edc/view-contract/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <ViewContractPage />
          </Suspense>
        )
      },
      {
        path: '/edc/view-contract/draft/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <ViewContractPage />
          </Suspense>
        )
      },
      {
        path: '/edc/view-addition/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <ViewAdditionPage />
          </Suspense>
        )
      },
      {
        path: '/edc/view-addition/draft/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <ViewAdditionPage />
          </Suspense>
        )
      },
      {
        path: '/edc/view-act/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <ViewActPage />
          </Suspense>
        )
      },
      {
        path: '/edc/view-act/draft/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <ViewActPage />
          </Suspense>
        )
      },
      {
        path: '/edc/update-act/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <UpdateActPage />
          </Suspense>
        )
      },

      {
        path: '/edc/update-act/draft/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <UpdateActPage />
          </Suspense>
        )
      },
      {
        path: '/edc/view-invoice/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <ViewInvoicePage />
          </Suspense>
        )
      },
      {
        path: '/edc/view-invoice/draft/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <ViewInvoicePage />
          </Suspense>
        )
      },
      {
        path: '/edc/update-invoice/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <UpdateInvoicePage />
          </Suspense>
        )
      },
      {
        path: '/edc/update-invoice/draft/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <UpdateInvoicePage />
          </Suspense>
        )
      },
      {
        path: '/settings/users',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <StaffPage />
          </Suspense>
        )
      },
      {
        path: '/notifications',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <NotificationsListPage />
          </Suspense>
        )
      },

      {
        path: 'no-permission',
        element: <h1>no permission</h1>
      },
      {
        path: '404',
        element: <h1>404</h1>
      }
    ]
  },

  {
    path: 'login',
    element: <LoginPage />
  },
  {
    path: 'legal-entities',
    element: <LegalEnitiesPage />
  },
  {
    path: '*',
    element: <Navigate to="/404" />
  }
];

export default routes;
