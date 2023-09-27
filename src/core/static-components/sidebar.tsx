import { Button, Layout, Menu } from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { BiChart, BiFile, BiHomeAlt } from 'react-icons/bi';
import { FiUsers, FiSettings } from 'react-icons/fi';
// import { TbTemplate } from 'react-icons/tb';
import { useLocalStorage } from 'usehooks-ts';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { ReactComponent as Logo } from '@/assets/images/logo.svg';
import { ReactComponent as LogoCollapsed } from '@/assets/images/logo-collapsed.svg';
import { dictionary } from '@/utils/constants/dictionary';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem;
}

function Sidebar() {
  const [collapsed, setCollapsed] = useLocalStorage('menuCollapse', false);
  const location = useLocation();
  const items: MenuItem[] = [
    getItem(
      <Link to="/home"> {dictionary.en.home} </Link>,
      '/home',
      <BiHomeAlt size={18} />
    ),
    getItem(
      <Link to="/edc"> {dictionary.en.documentCirculation} </Link>,
      '/edc',
      <BiFile size={18} />
    ),
    getItem(
      <Link to="/reports"> {dictionary.en.report} </Link>,
      '/reports',
      <BiChart size={18} />
    ),
    getItem(dictionary.en.settings, '/settings', <FiSettings size={18} />, [
      getItem(
        <Link to="/settings/users"> {dictionary.en.users} </Link>,
        '/settings/users',
        <FiUsers />
      )
      // getItem(
      //   <Link to="/settings/circulation-templates"> Internal structure</Link>,
      //   '/settings/circulation-templates',
      //   <TbTemplate />
      // )
    ])
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      className="h-screen"
      style={{
        position: 'sticky',
        top: 0,
        left: 0
      }}
    >
      <div
        style={{
          width: '100%',
          height: 70,
          padding: 15,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        {collapsed ? (
          <Link to="/home">
            <LogoCollapsed height={'100%'} />
          </Link>
        ) : (
          <Link to="/home">
            <Logo height={'100%'} />
          </Link>
        )}
        <Button
          icon={
            collapsed ? (
              <RiArrowRightSLine size={20} />
            ) : (
              <RiArrowLeftSLine size={20} />
            )
          }
          onClick={() => setCollapsed(!collapsed)}
          style={{
            border: 'none',
            position: 'absolute',
            top: 20,
            zIndex: 999,
            left: collapsed ? 60 : 180,
            fontSize: '16px',
            width: 40,
            height: 40,
            borderRadius: '50%',
            boxShadow: 'rgba(0, 0, 0, 0.35) 0 5px 15px'
          }}
          className="center"
        />
      </div>

      <Menu
        className="h-full"
        defaultSelectedKeys={[location.pathname]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
}

export default Sidebar;
