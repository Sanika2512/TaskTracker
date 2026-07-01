import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AddTaskModal from '../components/modals/AddTaskModal';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useTasks } from '../hooks/useTasks';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { createTask } = useTasks();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar
        onAddTask={() => setIsAddModalOpen(true)}
        toggleSidebar={() => setIsSidebarOpen((value) => !value)}
      />

      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          isMobile={isMobile}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-screen-2xl">
            <Outlet />
          </div>
        </main>
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={createTask}
      />
    </div>
  );
};

export default MainLayout;
