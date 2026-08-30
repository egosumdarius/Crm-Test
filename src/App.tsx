/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CrmProvider, useCrm } from './context/CrmContext';
import { Navbar } from './components/Navbar';
import { PipelineView } from './components/PipelineView';
import { ContactsView } from './components/ContactsView';
import { CalendarView } from './components/CalendarView';
import { EmailHistoryView } from './components/EmailHistoryView';
import { DashboardView } from './components/DashboardView';
import { Toast } from './components/Toast';
import { DealModal } from './components/modals/DealModal';
import { ContactModal } from './components/modals/ContactModal';
import { MeetingModal } from './components/modals/MeetingModal';
import { EmailModal } from './components/modals/EmailModal';
import { GoogleModal } from './components/modals/GoogleModal';

const MainLayout: React.FC = () => {
  const { currentView } = useCrm();

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {currentView === 'pipeline' && <PipelineView />}
        {currentView === 'contacts' && <ContactsView />}
        {currentView === 'calendar' && <CalendarView />}
        {currentView === 'emails' && <EmailHistoryView />}
        {currentView === 'dashboard' && <DashboardView />}
      </main>

      {/* Modals & Dialogs */}
      <DealModal />
      <ContactModal />
      <MeetingModal />
      <EmailModal />
      <GoogleModal />

      {/* Toast Notifications */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <CrmProvider>
      <MainLayout />
    </CrmProvider>
  );
}
