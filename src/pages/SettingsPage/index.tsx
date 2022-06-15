/**
 * Page
 */
import React from 'react';

// import SettingsBody from './components/SettingsBody';
import SettingsAccount from './components/SettingsAccount/Loadable';
import SettingsSubscription from './components/SettingsSubscription/Loadable';
import MainLayout from 'src/components/layouts/MainLayout';
import { Header } from 'src/components/layouts/MainLayout/Header';
import HeaderMenu from 'src/elements-v2/HeaderMenu';

const SettingsPage: React.FC = () => (
  <MainLayout>
    <Header>
      <HeaderMenu title="Settings" subtitle="Account" back />
    </Header>
    {/* <SettingsBody useSession={session} /> */}
    <SettingsAccount />
    <SettingsSubscription />
  </MainLayout>
);

export default SettingsPage;
